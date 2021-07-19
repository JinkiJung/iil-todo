import React from 'react';
import './App.css';
import 'reflect-metadata';
import { PageRenderer } from './element/pageRenderer';
import { PageContext } from './type/pageContext';
import useKeycloak from './keycloak/useKeycloak';

const testURL = "http://localhost:12500/tasc";
const keycloakJsonFilePath = '../json/keycloak.json';

export const OperationContext = React.createContext({});

function App() {
  const {keycloak, authenticated, userId } = useKeycloak(keycloakJsonFilePath);
  return (
    <div className="App">
      <OperationContext.Provider value={{backEndUrl: testURL, ownerId: userId}}>
        {keycloak ? 
          authenticated ?
            userId ?
              <PageRenderer url={testURL} ownerId={userId} givenPageContext={PageContext.Incoming} onLogOut={(e) => keycloak.logout()}/>
              :
              <div>Loading user information</div>
            :
          <div>Move to authentication page...</div>
          :
          <div>There is a problem in Keycloak configuration.</div>}
      </OperationContext.Provider>
    </div>
  );
}

export default App;
