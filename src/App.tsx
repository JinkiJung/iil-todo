import React from 'react';
import './App.css';
import 'reflect-metadata';
import { PageRenderer } from './element/pageRenderer';
import { PageContext } from './type/pageContext';
import useKeycloak from './keycloak/useKeycloak';

const testActor = "jinki";
const testURL = "http://localhost:12500/tasc";
const keycloakJsonFilePath = '../json/keycloak.json';


function App() {
  const {keycloak, authenticated } = useKeycloak(keycloakJsonFilePath);
  return (
    <div className="App">
      {keycloak ? 
          authenticated ?
            <PageRenderer url={testURL} ownerId={testActor} givenPageContext={PageContext.Incoming} />
              :
          <div>Not authenticated yet!</div>
          :
          <div>There is a problem in Keycloak configuration.</div>}
    </div>
  );
}

export default App;
