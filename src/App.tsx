import React from 'react';
import './App.css';
import 'reflect-metadata';
import { PageRenderer } from './element/pageRenderer';
import { PageContext } from './type/pageContext';

const testActor = "jinki";
const testURL = "http://localhost:12500/tasc";

function App() {

  return (
    <div className="App">
      <PageRenderer url={testURL} ownerId={testActor} givenPageContext={PageContext.Incoming} />
    </div>
  );
}

export default App;
