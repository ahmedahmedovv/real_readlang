
import React, { useState } from 'react';
import { Header } from './components/Header';
import { PracticeView } from './components/PracticeView';
import { ChatView } from './components/ChatView';
import { WordListView, INITIAL_WORDS } from './components/WordListView';
import { LibraryView } from './components/LibraryView';
import { HomeView } from './components/HomeView';
import { ReaderView } from './components/ReaderView';
import { Tab, WordItem, Story } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [practiceTargetWord, setPracticeTargetWord] = useState<string | null>(null);
  const [currentReadingStory, setCurrentReadingStory] = useState<Story | null>(null);
  
  const [knownLang, setKnownLang] = useState('Turkish');
  const [learningLang, setLearningLang] = useState('Polish');
  const [words, setWords] = useState<WordItem[]>(INITIAL_WORDS);

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
    // Settings logic would go here
    alert("Settings dialog (Mock)");
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
    </div>
  );
};

export default App;
