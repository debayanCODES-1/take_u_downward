import Fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { GoogleGenerativeAI } from '@google/generative-ai';

const prisma = new PrismaClient();
const server = Fastify({ logger: true });

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'mock_key');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

// Register plugins
server.register(fastifyCors, { 
    origin: '*', // Restrict this in production
    credentials: true 
});

server.register(fastifyCookie);
server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'supersecret'
});

server.register(fastifyWebsocket, {
  options: { maxPayload: 1048576 }
});

// Basic HTTP health check
server.get('/health', async (request, reply) => {
  return { status: 'ok', time: new Date().toISOString() };
});

// AI Problem Generation Route
server.post('/problems/generate', async (request, reply) => {
  const { topic, difficulty } = request.body as { topic: string, difficulty: string };
  
  if (!topic || !difficulty) {
    return reply.status(400).send({ error: 'Topic and difficulty are required' });
  }

  try {
    const prompt = `Generate a unique Data Structures and Algorithms problem.
Topic: ${topic}
Difficulty: ${difficulty}
Output MUST be strictly in JSON format with the following schema:
{
  "title": "String",
  "description": "String (Markdown)",
  "examples": [{ "input": "String", "output": "String", "explanation": "String" }],
  "constraints": ["String"]
}
Do not include any other text, just the raw JSON block.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    
    const problemData = JSON.parse(text);

    // Save to database
    const newProblem = await prisma.problem.create({
      data: {
        topic,
        difficulty,
        title: problemData.title,
        description: problemData.description,
        examples: problemData.examples,
        constraints: problemData.constraints,
        isAiGenerated: true
      }
    });

    return reply.send(newProblem);
  } catch (err) {
    server.log.error(err);
    return reply.status(500).send({ error: 'Failed to generate problem via AI' });
  }
});

// WebSocket for Proctoring
server.register(async function (fastify) {
  fastify.get('/ws/proctor', { websocket: true }, (connection, req) => {
    
    // Authenticate / Validate connection here
    // In production, you'd extract session ID and check HMAC signatures
    
    connection.socket.on('message', async message => {
      try {
        const data = JSON.parse(message.toString());
        
        // Example logic:
        // Expected payload: { sessionId, type, severity, metadata, signature }
        if (data.type === 'violation') {
            console.log(`[VIOLATION] Session ${data.sessionId}: ${data.severity} - ${data.metadata}`);
            
            // TODO: Verify signature here using session secret
            
            // Save to TimescaleDB
            /* 
            await prisma.violationEvent.create({
                data: {
                    sessionId: data.sessionId,
                    type: data.type,
                    severity: data.severity,
                    metadata: data.metadata
                }
            });
            */
           
           // If violation count exceeds threshold, we could terminate session
        }
      } catch (err) {
        console.error('Invalid WS message', err);
      }
    });

    connection.socket.on('close', () => {
      console.log('Client disconnected from proctor WS');
    });
  });
});

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000');
    await server.listen({ port, host: '0.0.0.0' });
    console.log(`Server listening on port ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
