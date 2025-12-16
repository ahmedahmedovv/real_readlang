import React from 'react';
import { Tab, Story } from '../types';

interface HomeViewProps {
  onNavigate: (tab: Tab) => void;
  onRead: (story: Story) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onRead }) => {
  
  // Mock story for the dashboard continuation
  const continueStory: Story = { 
      id: '1', title: 'The Hungry Cat', level: 'B1', 
      summary: '', coverColor: '#43b08a', 
      content: `Whiskers is a cat. He is very hungry. He looks in his bowl. It is empty. "Meow!" he says. Sarah hears him. She goes to the kitchen. She opens a can of food. She fills the bowl. Whiskers is happy now. He eats all the food. Then, he sleeps on the sofa.` 
  };

  return (
    <div>
       <div className="dashboardRow">
          
          {/* Continue Reading Panel */}
          <div className="dashboardPanel">
             <h2>Continue Reading</h2>
             <div className="bookCover">
                <div className="libraryDocument" onClick={() => onRead(continueStory)}>
                   <div className="leftHandSide">
                      <div className="categoryContainer">
                         <span className="category">Other</span>
                      </div>
                   </div>
                   <div className="mainInfo">
                      <h4>The Hungry Cat</h4>
                      <div className="attribution">Advanced (C1), 4,113 words</div>
                      <div className="progressBarContainer">
                         <div className="progressBar">
                            <div className="completedBar" style={{width: '65%'}}></div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
             <p style={{textAlign:'right', marginTop:'10px', marginRight:'20px'}}>
                <a href="#" onClick={(e) => {e.preventDefault(); onNavigate(Tab.LIBRARY);}}>Manage my queue →</a>
             </p>
          </div>

          {/* Practice Panel */}
          <div className="dashboardPanel practiceFlashcards">
             <h2>Practice</h2>
             
             <a href="#" className="startFlashcardsButton" onClick={(e) => {e.preventDefault(); onNavigate(Tab.PRACTICE);}}>
                <svg className="buttonIcon" viewBox="0 0 24 24"><path d="M4 6h16v12H4zm2 2v8h12V8zm-4 4h2v-2H2z" /></svg>
                <span>Start Practice</span>
             </a>
             
             <a href="#" className="startChatButton" onClick={(e) => {e.preventDefault(); onNavigate(Tab.CHAT);}}>
                <svg className="buttonIcon" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" /></svg>
                <span>Start Conversation</span>
             </a>

             <p style={{textAlign:'right', marginTop:'10px', width:'100%', maxWidth:'350px'}}>
                <a href="#">Customize practice →</a>
             </p>
          </div>
       </div>

       {/* Streak Panel */}
       <div className="dashboardPanel" style={{textAlign:'center', background:'#f0eedf'}}>
          <h2 style={{fontSize:'28px'}}>You Have A 719 Day Streak!</h2>
          <p>Read 500 words or practice 10 flashcards every day to keep your streak going.</p>
          
          <div className="streakPanelContainer" style={{maxWidth:'500px', margin:'15px auto'}}>
             <div className="streakPanel">
                <div className="barChartLabels">
                   <div className="barChartLabel"><span className="wordsReadLabelSquare"></span> Words Read</div>
                   <div className="barChartLabel"><span className="wordsPracticedLabelSquare"></span> Words Practiced</div>
                   <div className="barChartLabel"><span className="goalLineLabelExample"></span> Daily Goal</div>
                </div>
                
                <div className="barChart">
                   <div className="goalLine"></div>
                   <div className="bottomLine"></div>
                   
                   <table className="chartTable">
                      <tbody>
                         <tr>
                            {[120, 15, 110, 140, 130, 138, 133].map((val, i) => (
                               <td key={i}>
                                 <div className="barContainer" style={{height: `${Math.min(val, 100)}%`}}>
                                    <div className="barPractice" style={{height: '100%'}}></div>
                                 </div>
                               </td>
                            ))}
                         </tr>
                         <tr>
                            {['W', 'T', 'F', 'S', 'S', 'M', 'T'].map((d, i) => (
                               <td key={i}>
                                  <div className="dayLabel">{d}</div>
                                  <svg className="fireIcon goalMet" viewBox="0 0 13 16">
                                     <path d="M6.5 16C2.8 16 0 12.6 0 8.6C0 7.4 0.5 5.9 1.3 4.5C2.1 3 3.2 1.5 4.6 0.2C5.4 -0.5 6.2 0.8 5.4 1.5C3.7 3 2.5 5 2.5 7C2.5 7.5 2.8 8 3.3 8.3C4.8 6.5 6.5 5 8 3C9.5 5 13 7 13 9C13 13 10 16 6.5 16Z" />
                                  </svg>
                               </td>
                            ))}
                         </tr>
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
          
          <p style={{textAlign:'right', maxWidth:'500px', margin:'10px auto'}}>
            <a href="#">Show Long Term Progress →</a>
          </p>
          
          <div className="dashboardPanel">
             <h2>Earn Karma By Sharing Texts</h2>
             <p style={{maxWidth:'600px', margin:'0 auto'}}>You have a karma score of 0 from the 0 Polish text you shared. Your karma score will increase every time another user likes one of your shared texts.</p>
          </div>
       </div>
    </div>
  );
};