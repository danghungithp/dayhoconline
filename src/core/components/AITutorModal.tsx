import React, { useState } from 'react';
import { Bot, Sparkles, Send, X, Key, Check, Loader2 } from 'lucide-react';
import { AISnapshotContext } from '../../types/simulation.types';
import { askGeminiTutor, getStoredGeminiKey, setStoredGeminiKey } from '../../services/geminiService';

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: AISnapshotContext;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AITutorModal: React.FC<AITutorModalProps> = ({ isOpen, onClose, context }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Xin chào! Thầy/Cô là **Gia sư AI STEM & English Lab**. Thầy/Cô đã nắm được trạng thái hiện tại của bàn thí nghiệm **"${context.simulationTitle}"**. Em đang gặp khó khăn ở phần nào, hoặc muốn tìm hiểu sâu hiện tượng gì? Hãy hỏi nhé!`
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(getStoredGeminiKey());
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [keySavedToast, setKeySavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    setStoredGeminiKey(apiKey);
    setKeySavedToast(true);
    setTimeout(() => setKeySavedToast(false), 2000);
  };

  const handleSend = async () => {
    if (!inputQuestion.trim() || isLoading) return;

    const userText = inputQuestion.trim();
    setInputQuestion('');
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setIsLoading(true);

    try {
      const response = await askGeminiTutor(context, userText, apiKey);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (e: any) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `Có chút gián đoạn kết nối. Nhưng dựa trên trạng thái thí nghiệm của em: hãy kiểm tra lại các thông số biến đổi để tìm mối liên hệ vật lý/hóa học nhé!`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col h-[650px] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Gia sư AI STEM & English Lab</h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-700/50">
                  Gemini Context Aware
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Hiểu ngữ cảnh bài học: <span className="text-slate-200 font-medium">{context.simulationTitle}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyConfig(!showKeyConfig)}
              title="Cấu hình Google Gemini API Key"
              className={`p-2 rounded-lg border transition ${
                showKeyConfig
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Key className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* API Key Drawer */}
        {showKeyConfig && (
          <div className="p-3 bg-slate-950/90 border-b border-cyan-900/40 text-xs flex items-center gap-2 animate-fade-in">
            <span className="text-slate-300 whitespace-nowrap">Gemini API Key:</span>
            <input
              type="password"
              placeholder="AIzaSy... (Để trống nếu dùng Gia sư tích hợp offline)"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleSaveKey}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium flex items-center gap-1 transition"
            >
              {keySavedToast ? <Check className="w-3.5 h-3.5 text-green-300" /> : 'Lưu'}
            </button>
          </div>
        )}

        {/* Chat message list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-cyan-400 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-md leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-cyan-600 text-white rounded-br-none'
                    : 'bg-slate-800/90 border border-slate-700/70 text-slate-200 rounded-bl-none whitespace-pre-wrap'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-slate-400 text-xs animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Gia sư AI đang phân tích trạng thái mô phỏng và câu hỏi của em...</span>
            </div>
          )}
        </div>

        {/* Quick prompt suggestions */}
        <div className="px-5 py-2 bg-slate-950/60 border-t border-slate-800 flex gap-2 overflow-x-auto text-xs text-slate-400">
          <span className="shrink-0 text-slate-500 font-medium py-1">Gợi ý nhanh:</span>
          <button
            onClick={() => setInputQuestion('Giải thích giúp em trạng thái hiện tại của mô phỏng này?')}
            className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            🔍 Phân tích trạng thái hiện tại
          </button>
          <button
            onClick={() => setInputQuestion('Làm thế nào để hoàn thành nhiệm vụ tiếp theo?')}
            className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            🎯 Gợi ý làm nhiệm vụ
          </button>
          <button
            onClick={() => setInputQuestion('Ứng dụng thực tế của kiến thức bài này trong đời sống là gì?')}
            className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            🌍 Ứng dụng thực tiễn
          </button>
        </div>

        {/* Input box */}
        <div className="p-4 bg-slate-800/90 border-t border-slate-700 flex gap-2">
          <input
            type="text"
            placeholder="Hỏi bất kỳ điều gì về hiện tượng, công thức hay cách thao tác..."
            value={inputQuestion}
            onChange={e => setInputQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={handleSend}
            disabled={!inputQuestion.trim() || isLoading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition"
          >
            <Send className="w-4 h-4" />
            <span>Gửi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
