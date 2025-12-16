import React, { useState, useEffect, useRef } from 'react';
import { startChatSession } from '../services/geminiService';
import { ChatMessage, ChatSession } from '../types';

interface ChatViewProps {
  knownLang: string;
  learningLang: string;
}

export const ChatView: React.FC<ChatViewProps> = ({ knownLang, learningLang }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<ChatSession | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startNewChat();
  }, [knownLang, learningLang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const startNewChat = async () => {
    setMessages([]);
    setLoading(true);
    chatRef.current = startChatSession(knownLang, learningLang);
    
    try {
      const response = await chatRef.current.sendMessage({ 
        message: `Introduce yourself briefly as my ${learningLang} tutor.` 
      });
      
      if (response.text) {
        setMessages([{ id: 'init', role: 'model', text: response.text }]);
      }
    } catch (e) {
      setMessages([{ id: 'err', role: 'model', text: "Connection error." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatRef.current) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userMsg.text });
      if (response.text) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: response.text }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Error." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth:'800px', margin:'20px auto', background:'white', borderRadius:'8px', border:'1px solid #ccc', overflow:'hidden'}}>
      <div style={{background:'#f9f9f9', padding:'15px', borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
             <i className="fa fa-android fa-2x" style={{color:'#48a488'}}></i>
             <div>
               <h3 style={{margin:0, color:'#333'}}>{learningLang} Tutor</h3>
               <small style={{color:'#888'}}>Powered by Mistral AI</small>
             </div>
          </div>
          <button onClick={startNewChat} style={{background:'none', border:'none', cursor:'pointer', color:'#888'}}>
            <i className="fa fa-refresh fa-lg"></i>
          </button>
      </div>

      <div style={{height:'500px', overflowY:'auto', padding:'20px', background:'white'}}>
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div key={msg.id} style={{display:'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom:'15px'}}>
                <div style={{
                    maxWidth:'80%', 
                    padding:'10px 15px', 
                    borderRadius:'15px',
                    backgroundColor: isUser ? '#48a488' : '#f0f0f0',
                    color: isUser ? 'white' : '#333',
                    borderBottomRightRadius: isUser ? '0' : '15px',
                    borderBottomLeftRadius: isUser ? '15px' : '0'
                }}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          {loading && <div style={{color:'#888', fontStyle:'italic', marginLeft:'10px'}}>Thinking...</div>}
          <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} style={{padding:'15px', background:'#f9f9f9', borderTop:'1px solid #eee', display:'flex', gap:'10px'}}>
         <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{flex:1, padding:'10px', borderRadius:'20px', border:'1px solid #ccc', outline:'none'}}
            disabled={loading}
         />
         <button type="submit" disabled={!input.trim() || loading} style={{background:'#48a488', color:'white', border:'none', width:'40px', height:'40px', borderRadius:'50%', cursor:'pointer'}}>
            <i className="fa fa-paper-plane"></i>
         </button>
      </form>
    </div>
  );
};