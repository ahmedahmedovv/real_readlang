import React, { useState, useEffect, useRef } from 'react';
import { Story, Tab } from '../types';

interface ReaderViewProps {
  story: Story;
  onClose: () => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({ story, onClose }) => {
  const [processedContent, setProcessedContent] = useState<React.ReactNode[]>([]);
  const [selectedWord, setSelectedWord] = useState<{ text: string, top: number, left: number } | null>(null);

  useEffect(() => {
    // Simple text processor: splits by spaces and wraps in spans
    const paragraphs = story.content.split('\n');
    const nodes = paragraphs.map((para, pIndex) => (
      <p key={pIndex}>
        {para.split(' ').map((word, wIndex) => {
           // Basic cleaning of punctuation for the clickable part, though we display full
           const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()"]/g, ""); 
           return (
             <React.Fragment key={`${pIndex}-${wIndex}`}>
               <span 
                 className="word" 
                 onClick={(e) => handleWordClick(e, cleanWord)}
               >
                 {word}
               </span>{' '}
             </React.Fragment>
           );
        })}
      </p>
    ));
    setProcessedContent(nodes);
  }, [story.content]);

  const handleWordClick = (e: React.MouseEvent, word: string) => {
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setSelectedWord({
      text: word, // In a real app, translate this word here using API
      top: rect.top,
      left: rect.left + (rect.width / 2)
    });
  };

  const closeTooltip = () => setSelectedWord(null);

  return (
    <div id="readerPage" onClick={closeTooltip}>
      {/* Title Bar */}
      <div id="titleBar" className="titleBar">
        <div className="homeButton">
          <a href="#" onClick={(e) => { e.preventDefault(); onClose(); }} title="Readlang Homepage">
            <i className="fa fa-chevron-left" style={{marginRight:'5px'}}></i>
            <span className="icon">R</span>
          </a>
        </div>
        
        <div id="title">
          <div className="selectBox">
            <select>
              <option>{story.title}</option>
              <option disabled>──────────</option>
              <option>Author: Unknown</option>
            </select>
          </div>
        </div>

        <div id="streak" className="titleBarWidget">
          <div className="streakView metGoal">
            <div className="image">
               <svg className="fireIcon metGoal" width="13" height="16" viewBox="0 0 13 16" fill="currentColor">
                  <path d="M4.6 0.1C4.8 -0.1 5.2 -0.1 5.4 0.1C6.2 1.0 7.0 1.9 7.7 2.8C8.0 2.3 8.4 1.9 8.8 1.5C9.0 1.2 9.3 1.2 9.6 1.5C10.6 2.5 11.4 3.9 12.0 5.1C12.6 6.4 13 7.7 13 8.6C13 12.6 10.1 16 6.5 16C2.9 16 0 12.6 0 8.6C0 7.4 0.5 6.0 1.3 4.5C2.1 3.1 3.3 1.5 4.6 0.2Z" />
               </svg>
            </div>
            <div className="days includesToday">719</div>
          </div>
        </div>

        <div id="dropdownMenu" className="titleBarWidget">
           <i className="fa fa-ellipsis-v menuButton" style={{fontSize:'20px', color:'#888'}}></i>
        </div>
        
        <div className="titleBarWidget clickable">
           <i className="fa fa-align-left" style={{fontSize:'20px', color:'#888'}}></i>
        </div>
      </div>

      {/* Content */}
      <div id="pageTextViewport">
        <div id="pageText">
           {processedContent}
        </div>
      </div>

      {/* Translation Tooltip Mockup */}
      {selectedWord && (
        <div 
          className="translation-tooltip" 
          style={{ top: selectedWord.top, left: selectedWord.left }}
        >
          Translated: {selectedWord.text}
        </div>
      )}

      {/* Footer Controls */}
      <div id="readerFooter">
         <span className="pageControls">
            <button className="pageControlButton" title="Previous Page">
               <i className="fa fa-caret-left"></i>
            </button>
            
            <span className="pageNumber">15%</span>
            
            <button className="pageControlButton" title="Skip Backward" style={{margin:'0 15px'}}>
               <i className="fa fa-undo"></i>
            </button>
            
            <button className="pageControlButton" title="Read Aloud">
               <i className="fa fa-volume-up"></i>
            </button>
            
            <button className="pageControlButton" title="Skip Forward" style={{margin:'0 15px'}}>
               <i className="fa fa-repeat"></i>
            </button>
            
            <button className="pageControlButton" title="Next Page">
               <i className="fa fa-caret-right"></i>
            </button>
         </span>
      </div>
    </div>
  );
};