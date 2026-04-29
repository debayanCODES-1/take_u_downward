import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { useProctoring } from '../hooks/useProctoring';
import EditorPanel from '../components/EditorPanel';
import { AlertTriangle, Clock } from 'lucide-react';

export default function Session() {
  const { activeSession, timer, endSession } = useSession();
  const navigate = useNavigate();
  
  // Hook up proctoring
  const { stream, violations, cameraError } = useProctoring(activeSession?.id);

  useEffect(() => {
    if (!activeSession) {
      navigate('/');
    }
  }, [activeSession, navigate]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleEnd = () => {
    endSession();
    navigate('/');
  };

  if (!activeSession) return null;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="glass-header px-6 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">AlgoArena</h1>
          <span className="bg-secondary px-3 py-1 rounded-full text-sm font-medium border border-white/10">
            {activeSession.topicId} • {activeSession.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-6">
          {violations.length > 0 && (
            <div className="flex items-center gap-2 text-accent-rose text-sm font-medium bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              <AlertTriangle size={16} />
              {violations.length} Violation{violations.length > 1 ? 's' : ''}
            </div>
          )}
          
          <div className={`flex items-center gap-2 font-mono text-lg font-bold ${timer < 300 ? 'text-accent-rose animate-pulse' : 'text-primary'}`}>
            <Clock size={20} className={timer < 300 ? 'text-accent-rose' : 'text-secondary'} />
            {formatTime(timer)}
          </div>
          
          <button onClick={handleEnd} className="btn btn-danger text-sm">
            End Session
          </button>
        </div>
      </header>

      <div className="split-layout">
        {/* Problem Panel */}
        <div className="split-panel flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Two Sum</h2>
            <div className="flex gap-2 text-sm">
              <span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">Easy</span>
              <span className="text-secondary bg-secondary/50 px-2 py-1 rounded">Array</span>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none text-secondary">
            <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p>
            <p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>
            <p>You can return the answer in any order.</p>
            
            <h3 className="text-primary mt-6 mb-2">Example 1:</h3>
            <pre className="bg-black/50 p-4 rounded border border-white/5">
              <code>Input: nums = [2,7,11,15], target = 9<br/>Output: [0,1]<br/>Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].</code>
            </pre>
          </div>
        </div>

        {/* Editor Panel */}
        <EditorPanel />
      </div>

      {/* Floating Proctor Camera */}
      <div className="proctor-camera">
        {cameraError ? (
          <div className="w-full h-full flex items-center justify-center bg-rose-500/20 text-rose-400 text-xs text-center p-4">
            {cameraError}
          </div>
        ) : (
          <video 
            autoPlay 
            muted 
            playsInline 
            ref={video => {
              if (video && stream) video.srcObject = stream;
            }} 
          />
        )}
      </div>
    </div>
  );
}
