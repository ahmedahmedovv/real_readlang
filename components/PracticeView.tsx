import React, { useState, useEffect, useRef } from 'react';
import { generatePracticeSentence } from '../services/geminiService';
import { PracticeSentence, WordItem } from '../types';

interface PracticeViewProps {
  targetWord?: string | null;
  knownLang: string;
  learningLang: string;
  words: WordItem[];
  onClose: () => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({ targetWord, knownLang, learningLang, words, onClose }) => {
  const [mode, setMode] = useState<'setup' | 'session'>(targetWord ? 'session' : 'setup');

  const handleStart = () => {
    setMode('session');
  };

  if (mode === 'setup') {
    return <PracticeSetup onStart={handleStart} wordCount={words.length} />;
  }

  return (
    <FlashcardSession 
      targetWord={targetWord}
      knownLang={knownLang}
      learningLang={learningLang}
      words={words}
      onClose={onClose}
    />
  );
};

const PracticeSetup: React.FC<{ onStart: () => void, wordCount: number }> = ({ onStart, wordCount }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw a dummy bar chart
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = 40;
        const gap = 25;
        const startX = 30;
        const maxHeight = 150;
        const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
        const values = [20, 45, 10, 80, 50, 90, 30]; // random dummy data

        ctx.fillStyle = '#eee';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw axes
        ctx.beginPath();
        ctx.moveTo(20, 10);
        ctx.lineTo(20, 180);
        ctx.lineTo(460, 180);
        ctx.strokeStyle = '#ccc';
        ctx.stroke();

        values.forEach((val, i) => {
           const x = startX + i * (barWidth + gap);
           const height = (val / 100) * maxHeight;
           const y = 180 - height;
           
           // Bar
           ctx.fillStyle = '#419ecd';
           ctx.fillRect(x, y, barWidth, height);
           
           // Label
           ctx.fillStyle = '#666';
           ctx.font = '12px Arial';
           ctx.fillText(days[i], x + 12, 195);
        });
      }
    }
  }, []);

  return (
    <div id="learnPageContent">
        <h2>Review Your Words</h2>
        
        <div className="practiceControls">
            <button className="startFlashcardsButton" onClick={onStart}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <circle cx="30" cy="30" r="30" fill="white" fillOpacity="0.2"/>
                   <path d="M18 18H42V42H18V18Z" fill="white"/>
                   <path d="M22 22H38V38H22V22Z" fill="#419ecd"/>
                </svg>
                <span>Start Practice</span>
            </button>
            
            <div>
                <table className="practiceOptionsTable">
                    <tbody>
                        <tr>
                            <td><label>Mode:</label></td>
                            <td>
                                <select defaultValue="classic">
                                    <option value="blitz">Blitz (no typing)</option>
                                    <option value="new">Mastery (with typing)</option>
                                    <option value="classic">Classic Flashcards</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td><label>Length:</label></td>
                            <td>
                                <select defaultValue="medium">
                                    <option value="verySmall">4 words</option>
                                    <option value="small">8 words</option>
                                    <option value="medium">15 words</option>
                                    <option value="large">25 words</option>
                                    <option value="veryLarge">50 words</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td><label>Source:</label></td>
                            <td>
                                <select defaultValue="all">
                                    <option value="all">({wordCount} words ready) All Words</option>
                                    <option value="book1">(12 words ready) Harry Potter</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div id="weeklyChartContainerContainer">
            <h2>Practice <strong>Every Day</strong></h2>
            <div id="weeklyChartContainer">
                <canvas ref={canvasRef} id="weeklyChart" width="470" height="200"></canvas>
            </div>
        </div>

        <div className="callout">
            <label>
                <input type="checkbox" name="dailyReminder" style={{marginRight:'8px'}} />
                Email me a daily reminder if I forget to practice.
            </label>
        </div>
    </div>
  );
};

const FlashcardSession: React.FC<PracticeViewProps> = ({ targetWord, knownLang, learningLang, words, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [aiContent, setAiContent] = useState<PracticeSentence | null>(null);
  
  const practiceList = words; 
  const currentWordItem = practiceList[currentIndex];

  useEffect(() => {
    if (targetWord && practiceList.length > 0) {
      const idx = practiceList.findIndex(w => w.term === targetWord);
      if (idx !== -1) setCurrentIndex(idx);
    }
  }, [targetWord, practiceList]);

  useEffect(() => {
    if (!currentWordItem) return;
    setRevealed(false);
    setAiContent(null);
    const loadData = async () => {
      try {
        const res = await generatePracticeSentence(knownLang, learningLang, currentWordItem.term);
        setAiContent(res);
      } catch (e) {
        console.error(e);
      }
    };
    loadData();
  }, [currentWordItem, knownLang, learningLang]);

  const handleNext = () => {
    if (currentIndex < practiceList.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      alert("Practice Complete!");
      onClose();
    }
  };

  const handleDelete = () => {
    handleNext();
  };

  if (!currentWordItem) return null;

  const contextSentence = currentWordItem.context || aiContent?.original || `... ${currentWordItem.term} ...`;
  const translationText = aiContent?.translation || currentWordItem.translation;

  const renderContext = () => {
    if (!contextSentence) return null;
    const parts = contextSentence.split(new RegExp(`(${currentWordItem.term})`, 'gi'));
    return (
      <span style={{fontWeight:300}}>
        {parts.map((part, i) => 
          part.toLowerCase() === currentWordItem.term.toLowerCase() 
            ? <strong key={i} style={{fontWeight:600}}>{part}</strong> 
            : part
        )}
      </span>
    );
  };

  return (
    <div id="flashcardsPage" style={{maxWidth:'820px', margin:'0 auto'}}>
      
      <div className="flashcardsContainer" style={{ opacity: 1 }}>
        
        {/* Top Bar */}
        <div className="flashcardTopBar">
          <h4 id="cardCount">
            {practiceList.length - currentIndex} / {practiceList.length} words left
          </h4>
          <button id="exitTest" title="Exit Test" onClick={onClose}>✕</button>
        </div>

        {/* Context Container */}
        <div id="contextContainer">
          <div id="context">
            {renderContext()}
          </div>
          <div id="nextContext" title="Next Context" style={{display:'block', opacity: 0.2}}>
            <i className="fa fa-chevron-right icon-large"></i>
          </div>
        </div>

        {/* Word Cards */}
        <div id="wordCards" style={{textAlign:'center'}}>
          
          {/* Left Card: Word */}
          <div id="word" className="wordCard">
             <span id="wordCardText">
                {currentWordItem.term}
             </span>
             <i id="wordCardAudio" title="Pronounce" className="fa fa-volume-up icon-volume-down needsclick" style={{fontSize:'20px', marginTop:'10px', color:'#aaa', cursor:'pointer'}}></i>
          </div>

          <div className="wordCardSpacer"></div>

          {/* Right Card: Translation */}
          <div 
            id="translation" 
            className="wordCard clickable"
            onClick={() => setRevealed(true)}
          >
             {/* Corner Ribbon */}
             <div className="cornerRibbon" data-category="justStarted">Last seen yesterday</div>

             {revealed ? (
               <div>
                 <span id="translationText">{translationText}</span>
                 <div id="newCardHint" style={{display:'block', fontSize:'12px', color:'#888', marginTop:'10px'}}>
                    New card, verify and edit it <i className="fa fa-pencil"></i>
                 </div>
               </div>
             ) : (
               <span id="translationText">?</span>
             )}
          </div>
        </div>

        {/* Feedback Section */}
        <h2 id="feedback">
          {revealed ? "Did you remember?" : "Try guessing first, then click the question mark to reveal the answer"}
        </h2>

        {/* Buttons */}
        {revealed && (
          <div id="buttons" style={{display:'block'}}>
            <button className="recall prominent" data-score="0" onClick={handleNext}>
              <small className="noMobile">1. &nbsp;</small>Not at all
            </button>&nbsp;
            <button className="recall prominent" data-score="2" onClick={handleNext}>
               <small className="noMobile">2. &nbsp;</small>Almost
            </button>&nbsp;
            <button className="recall prominent" data-score="5" onClick={handleNext}>
               <small className="noMobile">3. &nbsp;</small>Yes <i className="fa fa-check"></i>
            </button>
            <br/><br/>
          </div>
        )}

        {/* Delete Button */}
        {revealed && (
           <button id="delete" className="prominent" style={{display:'inline-block', background:'#d9534f'}} onClick={handleDelete}>
             <i className="fa fa-trash"></i> &nbsp; Delete this card
           </button>
        )}

      </div>
    </div>
  );
};