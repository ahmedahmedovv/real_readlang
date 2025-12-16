import React, { useState } from 'react';
import { WordItem } from '../types';

interface WordListViewProps {
  words: WordItem[];
  setWords: React.Dispatch<React.SetStateAction<WordItem[]>>;
  onPracticeWord: (word: string) => void;
}

export const INITIAL_WORDS: WordItem[] = [
  { id: '1', term: 'czytam', translation: 'I am reading', context: 'czytam interesującą książkę.', partOfSpeech: 'Verb' },
  { id: '2', term: 'interesującą', translation: 'interesting', context: 'czytam interesującą książkę.', partOfSpeech: 'Adjective' },
  { id: '3', term: 'rodzicami', translation: 'parents', context: 'Mieszkam z moimi rodzicami.', partOfSpeech: 'Noun' },
  { id: '4', term: 'wieczorami', translation: 'evenings', context: 'Lubię czytać wieczorami.', partOfSpeech: 'Noun' },
  { id: '5', term: 'imprezę', translation: 'party', context: 'Idziesz na imprezę?', partOfSpeech: 'Noun' },
  { id: '6', term: 'dziesiątej', translation: 'ten o\'clock', context: 'Spotkanie o dziesiątej.', partOfSpeech: 'Noun' },
  { id: '7', term: 'wysokiego', translation: 'tall', context: 'Widzę wysokiego mężczyznę.', partOfSpeech: 'Adjective' },
  { id: '8', term: 'wszystkimi', translation: 'everyone', context: 'Porozmawiaj ze wszystkimi.', partOfSpeech: 'Pronoun' },
];

export const WordListView: React.FC<WordListViewProps> = ({ words, onPracticeWord }) => {
  const [filter, setFilter] = useState('all');

  // Helper to render bold context
  const renderContext = (word: WordItem) => {
    if (!word.context) return <strong>{word.term}</strong>;
    const parts = word.context.split(new RegExp(`(${word.term})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === word.term.toLowerCase() 
            ? <strong key={i}>{part}</strong> 
            : part
        )}
      </>
    );
  };

  return (
    <div>
      {/* Top Controls */}
      <div className="wordsPageTopControls">
         <div className="searchLabel"></div>
         <span className="searchInputContainer">
            <i className="fa fa-search searchIcon"></i>
            <input className="searchInput" type="text" placeholder="Lookup word or phrase" />
            <button className="prominent" style={{marginLeft:'5px'}}>Search</button>
            <button className="prominent" style={{marginLeft:'5px'}}>
               <i className="fa fa-upload"></i> Import Words
            </button>
         </span>
      </div>

      <div>
         {/* Sidebar */}
         <div className="sidebar leftColumn">
            <ul className="sidebarList">
              <li>
                <input id="sb-all" type="radio" name="wf" checked={filter === 'all'} onChange={() => setFilter('all')}/>
                <label htmlFor="sb-all">All Words</label>
              </li>
              <li>
                <input id="sb-fav" type="radio" name="wf" checked={filter === 'fav'} onChange={() => setFilter('fav')}/>
                <label htmlFor="sb-fav">Starred</label>
              </li>
              <li>
                <input id="sb-sched" type="radio" name="wf" checked={filter === 'sched'} onChange={() => setFilter('sched')}/>
                <label htmlFor="sb-sched">Scheduled</label>
              </li>
              <li>
                <input id="sb-not" type="radio" name="wf" checked={filter === 'not'} onChange={() => setFilter('not')}/>
                <label htmlFor="sb-not">Not Started</label>
              </li>
              <li>
                <input id="sb-learn" type="radio" name="wf" checked={filter === 'learn'} onChange={() => setFilter('learn')}/>
                <label htmlFor="sb-learn">Learning</label>
              </li>
              <li>
                <input id="sb-del" type="radio" name="wf" checked={filter === 'del'} onChange={() => setFilter('del')}/>
                <label htmlFor="sb-del">Deleted</label>
              </li>
              <hr style={{border:'0', borderBottom:'1px solid #ccc', width:'80%', margin:'10px 0'}}/>
            </ul>
         </div>

         {/* Main List */}
         <div className="rightColumn">
            <div className="wordsToolbarContainer" style={{marginBottom:'10px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
               <div style={{display:'flex', gap:'5px'}}>
                 <button style={{width:'30px', height:'30px', border:'1px solid #ccc', background:'#fff'}}><i className="fa fa-check-square-o"></i></button>
                 <button className="prominent" style={{background:'#fff', color:'#666', border:'1px solid #ccc'}}>Actions <i className="fa fa-caret-down"></i></button>
               </div>
               
               <div style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'13px'}}>
                  <select style={{padding:'4px', border:'1px solid #ccc', borderRadius:'4px'}}>
                    <option>Recently Modified</option>
                    <option>Alphabetical</option>
                  </select>
                  <b>1 - {words.length} of {words.length}</b>
                  <div>
                    <button style={{padding:'2px 8px', marginRight:'2px'}} disabled><i className="fa fa-chevron-left"></i></button>
                    <button style={{padding:'2px 8px'}}><i className="fa fa-chevron-right"></i></button>
                  </div>
               </div>
            </div>

            <div className="mainWordList">
               <table className="wordTable">
                 <colgroup>
                    <col width="30"/>
                    <col width="30"/>
                    <col width="30"/>
                    <col/>
                    <col width="120"/>
                    <col width="50"/>
                 </colgroup>
                 <tbody>
                    {words.map(word => (
                      <tr key={word.id} className="clickable wordRow">
                        <td>
                           <div className="checkboxCell">
                             <input type="checkbox" id={`chk-${word.id}`} style={{display:'none'}}/>
                             <label htmlFor={`chk-${word.id}`} className="checkboxLabel">
                               <i className="fa fa-square-o"></i>
                             </label>
                           </div>
                        </td>
                        <td><i className="fa fa-volume-up icon-volume-down"></i></td>
                        <td><i className="fa fa-star favorite"></i></td>
                        <td className="wordColumn">
                           {renderContext(word)}
                        </td>
                        <td className="translationColumn">{word.translation}</td>
                        <td style={{textAlign:'right'}}>
                           <a href="#" onClick={(e) => { e.preventDefault(); onPracticeWord(word.term); }} style={{color:'#3b99d9', textDecoration:'none', fontSize:'12px'}}>full</a>
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
            </div>
         </div>
      </div>
      <div className="clear"></div>
    </div>
  );
};