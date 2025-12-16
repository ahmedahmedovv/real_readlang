import React from 'react';
import { Tab } from '../types';

interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  knownLang: string;
  setKnownLang: (lang: string) => void;
  learningLang: string;
  setLearningLang: (lang: string) => void;
  onOpenSettings: () => void;
}

const LANGUAGES = ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Turkish", "Russian", "Polish"];

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, setActiveTab, knownLang, setKnownLang, learningLang, setLearningLang, onOpenSettings
}) => {
  const handleNav = (e: React.MouseEvent, tab: Tab) => {
    e.preventDefault();
    setActiveTab(tab);
  };

  return (
    <div id="header">
      <div className="texture"></div>
      <div className="bookColumn">
        
        {/* LOGO */}
        <div id="logo">
          <span className="readlangLogoContainer" onClick={(e) => handleNav(e, Tab.HOME)}>
             <svg className="rabbitHole" viewBox="0 0 100 20" preserveAspectRatio="none">
               <ellipse cx="50" cy="10" rx="48" ry="8" fill="#2d2a26" />
             </svg>
             <div className="rabbitContainer">
               <svg className="rabbit" viewBox="0 0 100 100">
                  <path d="M30 60 V10 C30 5 38 5 38 10 V60" fill="white" stroke="#2d2a26" strokeWidth="3" />
                  <path d="M70 60 V10 C70 5 62 5 62 10 V60" fill="white" stroke="#2d2a26" strokeWidth="3" />
                  <ellipse cx="50" cy="70" rx="25" ry="22" fill="white" stroke="#2d2a26" strokeWidth="3" />
                  <circle cx="42" cy="65" r="2" fill="#333" />
                  <circle cx="58" cy="65" r="2" fill="#333" />
                  <circle cx="50" cy="75" r="2" fill="#333" />
               </svg>
             </div>
             <svg className="rabbitHoleForeground" viewBox="0 0 100 20" preserveAspectRatio="none">
               <path d="M2 10 A48 8 0 0 0 98 10" fill="none" stroke="#43b08a" strokeWidth="4" />
             </svg>
          </span>
          <a href="#" onClick={(e) => handleNav(e, Tab.HOME)}>
            <span className="readlangLogoText">Readlang</span>
          </a>
        </div>

        {/* HEADER SETTINGS */}
        <div id="headerSettings">
           <span className="languageContainer">
             I know<br/>
             <div className="dropdownBox">
               <span className="dropdownTitle">
                 {knownLang}<span className="dropdownArrow"></span>
               </span>
               <div className="dropdownList">
                 <h3>Select first language</h3>
                 {LANGUAGES.map(l => (
                   <div key={l} className="clickable" style={{padding:'4px'}} onClick={() => setKnownLang(l)}>{l}</div>
                 ))}
               </div>
             </div>
           </span>

           <span className="languageContainer">
             I'm learning<br/>
             <div className="dropdownBox">
               <span className="dropdownTitle">
                 {learningLang}<span className="dropdownArrow"></span>
               </span>
               <div className="dropdownList">
                 <h3>Select learning language</h3>
                 {LANGUAGES.map(l => (
                   <div key={l} className="clickable" style={{padding:'4px'}} onClick={() => setLearningLang(l)}>{l}</div>
                 ))}
               </div>
             </div>
           </span>

           <div id="userInfo" className="dropdownBox">
             <span className="dropdownTitle" style={{paddingRight:0}}>
                <img className="avatar" src="https://picsum.photos/id/64/100/100" alt="User" />
             </span>
             <div className="dropdownList">
                <h3 className="user-username">User</h3>
                <div className="clickable" style={{padding:'8px'}}><i className="fa fa-user"></i> Profile</div>
                <div className="clickable" style={{padding:'8px'}} onClick={onOpenSettings}><i className="fa fa-cog"></i> Settings</div>
                <div className="clickable" style={{padding:'8px'}}><i className="fa fa-rocket"></i> Premium</div>
                <div className="clickable" style={{padding:'8px'}}><i className="fa fa-sign-out"></i> Logout</div>
             </div>
           </div>

           <div id="streak">
             <div className="streakView metGoal">
                <div className="image">
                   <svg className="fireIcon" viewBox="0 0 13 16">
                      <path d="M6.5 16C2.8 16 0 12.6 0 8.6C0 7.4 0.5 5.9 1.3 4.5C2.1 3 3.2 1.5 4.6 0.2C5.4 -0.5 6.2 0.8 5.4 1.5C3.7 3 2.5 5 2.5 7C2.5 7.5 2.8 8 3.3 8.3C4.8 6.5 6.5 5 8 3C9.5 5 13 7 13 9C13 13 10 16 6.5 16Z" />
                   </svg>
                </div>
                <div className="days">719</div>
             </div>
           </div>
        </div>

        <div className="clear"></div>

        {/* NAVIGATION BAR */}
        <div id="navBar">
           <ul>
             <li><a href="#" className={activeTab === Tab.HOME ? 'active' : ''} onClick={(e) => handleNav(e, Tab.HOME)}><i className="fa fa-home"></i> Home</a></li>
             <li><a href="#" className={activeTab === Tab.LIBRARY ? 'active' : ''} onClick={(e) => handleNav(e, Tab.LIBRARY)}><i className="fa fa-book"></i> Library</a></li>
             <li><a href="#" className={activeTab === Tab.WORD_LIST ? 'active' : ''} onClick={(e) => handleNav(e, Tab.WORD_LIST)}><i className="fa fa-list"></i> Word List</a></li>
             <li className="navTabTest">
                <a href="#" className={activeTab === Tab.PRACTICE ? 'active' : ''} onClick={(e) => handleNav(e, Tab.PRACTICE)}>
                  <i className="fa fa-question-circle"></i> Practice
                </a>
             </li>
             <li><a href="#" className={activeTab === Tab.CHAT ? 'active' : ''} onClick={(e) => handleNav(e, Tab.CHAT)}><i className="fa fa-comments"></i> Chat</a></li>
             
             <div className="webReaderInstallerContainer">
                <a href="#" className="webReaderLink">Get Web Reader</a>
             </div>
           </ul>
        </div>

      </div>
    </div>
  );
};