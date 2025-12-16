
import React, { useState } from 'react';
import { Story } from '../types';
import { analyzeText } from '../services/geminiService';

interface LibraryViewProps {
  knownLang: string;
  onRead: (story: Story) => void;
}

const STORIES: Story[] = [
  { id: '1', title: 'Harry Potter', level: 'B1', summary: 'A story about a cat named Whiskers who wants dinner.', coverColor: '#fb923c', content: `Whiskers is a cat. He is very hungry. He looks in his bowl. It is empty. "Meow!" he says. Sarah hears him. She goes to the kitchen. She opens a can of food. She fills the bowl. Whiskers is happy now. He eats all the food. Then, he sleeps on the sofa.` },
  { id: '2', title: 'yds 2025', level: 'C2', summary: 'Description of a simple, cozy new home.', coverColor: '#60a5fa', content: `I have a new house. It is small but very nice. The walls are blue. The windows are big and clean. There is a garden with red flowers. I like to sit in the garden and read books. My bedroom is upstairs. It is quiet there. My new house is perfect for me.` },
  { id: '3', title: 'The Lost Key', level: 'A2', summary: 'Tom loses his key and looks everywhere for it.', coverColor: '#f87171', content: `Tom stands at his door. He puts his hand in his pocket. "Oh no!" he says. "Where is my key?" He looks in his bag. It is not there. He looks on the ground. It is not there. He is worried. He calls his mom. "Mom, I lost my key," he says. Just then, he looks in his other pocket. The key is there! Tom laughs. He is lucky today.` },
];

export const LibraryView: React.FC<LibraryViewProps> = ({ knownLang, onRead }) => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('myTexts');

  const handleAnalyze = async () => {
    if (!selectedStory) return;
    setLoading(true);
    const result = await analyzeText(selectedStory.content, knownLang);
    setAnalysis(result);
    setLoading(false);
  };

  if (selectedStory) {
    return (
      <div style={{maxWidth:'820px', margin:'20px auto'}}>
        <button onClick={() => { setSelectedStory(null); setAnalysis(null); }} style={{background:'none', border:'none', cursor:'pointer', color:'#888', marginBottom:'15px', display:'flex', alignItems:'center', gap:'5px'}}>
          <i className="fa fa-chevron-left"></i> Back to Library
        </button>

        <div style={{background:'white', borderRadius:'8px', border:'1px solid #ccc', overflow:'hidden'}}>
          <div style={{background:'#f9f9f9', padding:'20px', borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <span style={{background: selectedStory.coverColor, color:'white', padding:'2px 6px', borderRadius:'4px', fontSize:'12px', fontWeight:'bold'}}>{selectedStory.level}</span>
              <h2 style={{margin:'5px 0 0 0', color:'#333'}}>{selectedStory.title}</h2>
            </div>
            <div>
               <button onClick={() => onRead(selectedStory)} className="prominent" style={{marginRight:'10px'}}>
                 <i className="fa fa-book"></i> Read
               </button>
               <button onClick={handleAnalyze} disabled={loading || !!analysis} className="prominent" style={{background:'#fff', color:'#333', border:'1px solid #ccc', opacity: (loading || analysis) ? 0.5 : 1}}>
                 <i className="fa fa-magic"></i> {loading ? 'Analyzing...' : `Analyze Text`}
               </button>
            </div>
          </div>

          <div style={{display:'flex'}}>
            <div style={{padding:'30px', width: analysis ? '65%' : '100%', fontSize:'18px', lineHeight:'1.6', color:'#333'}}>
              {selectedStory.content}
            </div>

            {analysis && (
              <div style={{width:'35%', background:'#f9f9f9', borderLeft:'1px solid #eee', padding:'20px', fontSize:'14px'}}>
                <h3 style={{marginTop:0, color:'#48a488'}}><i className="fa fa-lightbulb-o"></i> Analysis</h3>
                <div style={{whiteSpace:'pre-wrap', color:'#555'}}>{analysis}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="library">
      <div className="libraryHeader">
         <ul className="libraryViewTabBar">
            <li className={activeTab === 'myTexts' ? 'selected' : ''} onClick={() => setActiveTab('myTexts')}>
               My Texts
            </li>
            <li className={activeTab === 'publicTexts' ? 'selected' : ''} onClick={() => setActiveTab('publicTexts')}>
               Public Texts
            </li>
            <li className={activeTab === 'websites' ? 'selected' : ''} onClick={() => setActiveTab('websites')}>
               Web Sites
            </li>
         </ul>
         <div className="libraryButtons">
            <button className="prominent" style={{marginRight:'5px'}}>
               <i className="fa fa-magic"></i> Generate Story
            </button>
            <button className="prominent">
               <i className="fa fa-arrow-circle-up"></i> Upload Text or Audio
            </button>
         </div>
      </div>

      <div style={{paddingTop:'8px'}}>
         {/* Toolbar */}
         <div className="libraryToolbar">
            <div className="browse">
               <small style={{marginRight:'5px'}}>Browse:</small>
               <label className="customSelectLabel">
                  <select className="customSelect">
                     <option>All ({STORIES.length})</option>
                     <option>To Read</option>
                     <option>Completed</option>
                  </select>
                  <i className="fa fa-sort icon-sort"></i>
               </label>
            </div>
            <div className="searchView">
               <span className="searchInputContainer">
                  <input type="text" placeholder="Search" />
                  <i className="fa fa-search searchIcon"></i>
               </span>
               <button className="prominent" style={{background:'#fff', color:'#333', border:'1px solid #ccc'}}>Search</button>
            </div>
         </div>

         <div className="buttonBar" style={{marginBottom:'10px'}}>
            <button className="prominent" style={{background:'#fff', color:'#333', border:'1px solid #ccc', opacity:0.5}} disabled>
               Actions <small>▼</small>
            </button>
         </div>

         {/* Table */}
         <table className="table texts lined">
            <thead>
               <tr>
                  <th className="col-dragHandle"></th>
                  <th className="col-checkbox">
                     <div className="checkboxCell">
                        <i className="fa fa-square-o"></i>
                     </div>
                  </th>
                  <th className="col-title">Name</th>
                  <th className="col-difficulty"></th>
                  <th className="col-permissions"></th>
                  <th className="col-owner">Owner</th>
                  <th className="col-wordCount">Total<br/>Words</th>
                  <th className="col-readStatus">Status</th>
               </tr>
            </thead>
            <tbody>
               {STORIES.map(story => (
                  <tr key={story.id}>
                     <td className="col-dragHandle"><i className="fa fa-bars"></i></td>
                     <td className="col-checkbox">
                        <div className="checkboxCell">
                           <i className="fa fa-square-o"></i>
                        </div>
                     </td>
                     <td className="col-title">
                        <a href="#" onClick={(e) => { e.preventDefault(); onRead(story); }}>{story.title}</a>
                     </td>
                     <td className="col-difficulty">{story.level}</td>
                     <td className="col-permissions"><i className="fa fa-lock" style={{opacity:0.5}}></i></td>
                     <td className="col-owner"><a href="#">ahmet</a></td>
                     <td className="col-wordCount">1,093</td>
                     <td className="col-readStatus">Read 15%</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};
