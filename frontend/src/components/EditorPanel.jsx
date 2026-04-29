import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, CheckCircle } from 'lucide-react';

export default function EditorPanel() {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('// Write your solution here\nfunction solve(input) {\n  return input;\n}');
  const [output, setOutput] = useState('');

  const handleRun = () => {
    setOutput('Running test cases...\nTest Case 1: Passed (12ms)\nTest Case 2: Passed (8ms)\nTest Case 3: Passed (15ms)\n\nAll test cases passed successfully!');
  };

  return (
    <div className="editor-panel h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-white/10 bg-black/40">
        <select 
          className="bg-secondary text-primary border border-white/10 rounded px-3 py-1.5 outline-none"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="go">Go</option>
        </select>
        
        <div className="flex gap-3">
          <button onClick={handleRun} className="btn btn-secondary text-sm">
            <Play size={14} /> Run Code
          </button>
          <button className="btn btn-primary text-sm">
            <CheckCircle size={14} /> Submit
          </button>
        </div>
      </div>
      
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(val) => setCode(val)}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'var(--font-mono)',
            padding: { top: 16 }
          }}
        />
      </div>

      {output && (
        <div className="h-48 bg-black/60 border-t border-white/10 p-4 font-mono text-sm overflow-y-auto">
          <h4 className="text-secondary mb-2 uppercase text-xs tracking-wider">Output / Terminal</h4>
          <pre className="text-emerald-400 whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
}
