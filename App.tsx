import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PracticeView } from './components/PracticeView';
import { ChatView } from './components/ChatView';
import { WordListView, INITIAL_WORDS } from './components/WordListView';
import { LibraryView } from './components/LibraryView';
import { HomeView } from './components/HomeView';
import { ReaderView } from './components/ReaderView';
import { Tab, WordItem, Story } from './types';

const App: React.FC = () => {
  const [mistralKey, setMistralKey] = useState<string | null>(null);
  const [isSkipped, setIsSkipped] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [inputKey, setInputKey] = useState('');
  
  const [activeTab, setActiveTab] = useState<Tab>(Tab.WORD_LIST);
  const [practiceTargetWord, setPracticeTargetWord] = useState<string | null>(null);
  const [currentReadingStory, setCurrentReadingStory] = useState<Story | null>(null);
  
  const [knownLang, setKnownLang] = useState('Turkish');
  const [learningLang, setLearningLang] = useState('Polish');
  const [words, setWords] = useState<WordItem[]>(INITIAL_WORDS);

  useEffect(() => {
    const storedKey = localStorage.getItem('mistral_api_key');
    if (storedKey) {
      setMistralKey(storedKey);
      setInputKey(storedKey);
    } else {
      setShowKeyModal(true);
    }
  }, []);

  const handleSaveKey = () => {
    if (inputKey.trim().length > 0) {
      localStorage.setItem('mistral_api_key', inputKey.trim());
      setMistralKey(inputKey.trim());
      setShowKeyModal(false);
      setIsSkipped(false);
    }
  };

  const handleSkip = () => {
    setIsSkipped(true);
    setShowKeyModal(false);
  };

  const handlePracticeWord = (word: string) => {
    setPracticeTargetWord(word);
    setActiveTab(Tab.PRACTICE);
  };

  const handleTabChange = (tab: Tab) => {
    if (tab !== Tab.PRACTICE) {
      setPracticeTargetWord(null);
    }
    setActiveTab(tab);
  };

  const handleReadStory = (story: Story) => {
    setCurrentReadingStory(story);
    setActiveTab(Tab.READER);
  };

  const openSettings = () => {
    setShowKeyModal(true);
  };

  return (
    <div id="entirePage">
      {activeTab !== Tab.READER && (
        <Header 
          activeTab={activeTab} 
          setActiveTab={handleTabChange}
          knownLang={knownLang}
          setKnownLang={setKnownLang}
          learningLang={learningLang}
          setLearningLang={setLearningLang}
          onOpenSettings={openSettings}
        />
      )}
      
      {activeTab === Tab.READER && currentReadingStory ? (
        <ReaderView 
          story={currentReadingStory} 
          onClose={() => setActiveTab(Tab.LIBRARY)} 
        />
      ) : (
        <div className="bookColumn">
          <div id="mainContent">
            {activeTab === Tab.HOME && <HomeView onNavigate={handleTabChange} onRead={handleReadStory} />}
            
            {activeTab === Tab.PRACTICE && (
              <PracticeView 
                targetWord={practiceTargetWord} 
                knownLang={knownLang}
                learningLang={learningLang}
                words={words}
                onClose={() => setActiveTab(Tab.WORD_LIST)}
              />
            )}
            
            {activeTab === Tab.CHAT && <ChatView knownLang={knownLang} learningLang={learningLang} />}
            
            {activeTab === Tab.WORD_LIST && (
              <WordListView 
                words={words} 
                setWords={setWords} 
                onPracticeWord={handlePracticeWord} 
              />
            )}

            {activeTab === Tab.LIBRARY && <LibraryView knownLang={knownLang} onRead={handleReadStory} />}
          </div>
        </div>
      )}

      {/* FOOTER */}
      {activeTab !== Tab.READER && (
        <div id="footer">
           <div className="bookColumn">
              <div className="footer-cols">
                 <div style={{width:'60%'}}>
                    <ul>
                       <li><a href="#">Forum (Help, Feedback & Community)</a></li>
                       <li><a href="#">Tutorial Videos</a></li>
                       <li><a href="#">Readlang Blog</a></li>
                       <li><a href="#">Web Reader Extension</a></li>
                       <li><a href="#">Readlang for mobile</a></li>
                       <li><a href="#">Privacy Policy</a></li>
                       <li><a href="#">Terms of Service</a></li>
                       <li><a href="#">About & Contact</a></li>
                    </ul>
                 </div>
                 <div className="footer-social">
                    <p>Connect with us</p>
                    <div>
                       <a href="#"><i className="fa fa-facebook-square"></i></a>
                       <a href="#"><i className="fa fa-twitter-square"></i></a>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Key Modal Overlay */}
      {showKeyModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white', 
            padding: '40px', 
            borderRadius: '8px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)', 
            textAlign: 'center',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2 style={{marginTop: 0, color: '#333'}}>Mistral API Key</h2>
            <p style={{color: '#666', marginBottom: '20px'}}>
              AI features (Practice, Chat, Analysis) require a Mistral API Key. 
            </p>
            <input 
              type="password" 
              placeholder="Enter sk-..." 
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              style={{
                padding: '10px', 
                width: '100%', 
                marginBottom: '20px', 
                borderRadius: '4px', 
                border: '1px solid #ccc',
                boxSizing: 'border-box'
              }}
            />
            <div style={{display:'flex', gap:'10px'}}>
              <button onClick={handleSaveKey} className="prominent" style={{flex:1, padding: '10px'}}>
                Save Key
              </button>
              <button 
                onClick={handleSkip} 
                style={{
                  flex:1, 
                  padding: '10px', 
                  background:'#eee', 
                  border:'1px solid #ccc', 
                  borderRadius:'4px', 
                  cursor:'pointer',
                  color: '#666'
                }}>
                Skip for now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;