import React from 'react';
import { Play } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { useNavigate } from 'react-router-dom';
import NexusBackground from '../components/NexusBackground';

const topics = [
  'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming',
  'Sorting', 'Searching', 'Hashing', 'Stacks & Queues', 'Heaps', 'Tries',
  'Backtracking', 'Greedy', 'Bit Manipulation', 'Math'
];

// Mock Heatmap Component
function Heatmap() {
  const days = Array.from({ length: 365 }, () => Math.floor(Math.random() * 5));
  
  return (
    <div className="glass-panel p-6 mt-8 nexus-card-3d">
      <div className="nexus-card-content">
        <h3 className="text-xl font-semibold mb-4">Daily Streak Heatmap</h3>
        <div className="heatmap-grid">
          {days.map((intensity, i) => {
            let bg = 'var(--bg-secondary)';
            if (intensity === 1) bg = 'rgba(16, 185, 129, 0.3)';
            if (intensity === 2) bg = 'rgba(16, 185, 129, 0.5)';
            if (intensity === 3) bg = 'rgba(16, 185, 129, 0.8)';
            if (intensity >= 4) bg = 'var(--accent-emerald)';
            
            return (
              <div 
                key={i} 
                className="heatmap-cell" 
                style={{ backgroundColor: bg }}
                title={`Day ${i + 1}: ${intensity} problems`}
              />
            );
          })}
        </div>
        <div className="flex gap-8 mt-4 text-sm text-secondary">
          <div>Current Streak: <span className="text-primary font-bold">12 days</span></div>
          <div>Longest Streak: <span className="text-primary font-bold">45 days</span></div>
          <div>Total Solved: <span className="text-primary font-bold">234</span></div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { startSession } = useSession();
  const navigate = useNavigate();

  const handleStart = (topic) => {
    startSession(topic, 'Medium');
    navigate('/session');
  };

  return (
    <NexusBackground>
      <div className="container py-12 relative z-10 h-full overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-gradient" style={{ textShadow: '0 0 20px rgba(46,91,255,0.5)' }}>AlgoArena Pro</h1>
          <div className="flex gap-4">
            <button className="btn btn-secondary nexus-card-3d">
              <span className="nexus-card-content">Profile</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl mb-6 font-display">Select a Topic</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {topics.map(topic => (
                <div 
                  key={topic} 
                  className="topic-card flex flex-col items-center text-center justify-center gap-2 nexus-card-3d"
                  onClick={() => handleStart(topic)}
                >
                  <div className="nexus-card-content flex flex-col items-center gap-2">
                    <div className="font-medium text-sm">{topic}</div>
                    <Play size={16} className="text-accent-indigo opacity-50" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="glass-panel p-6 mb-6 nexus-card-3d">
              <div className="nexus-card-content">
                <h3 className="text-xl font-semibold mb-2">Proctoring Ready</h3>
                <p className="text-secondary text-sm mb-4">Your camera and screen will be monitored during the session. Please ensure you are in a quiet environment.</p>
                <div className="flex items-center gap-2 text-accent-emerald text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  System Checks Passed
                </div>
              </div>
            </div>
          </div>
        </div>

        <Heatmap />
      </div>
    </NexusBackground>
  );
}
