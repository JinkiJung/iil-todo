import React from 'react';
import './App.css';
import 'reflect-metadata';
import { PageRenderer } from './element/pageRenderer';
import { PageContext } from './type/pageContext';
import useKeycloak from './keycloak/useKeycloak';

const testURL = "http://localhost:12500/iil";
const keycloakJsonFilePath = '../json/keycloak.json';

export const OperationContext = React.createContext({});

/*
<OperationContext.Provider value={{backEndUrl: testURL, ownerId: userId}}>
        {
        keycloak ? 
          authenticated ?
            userId ?
              <PageRenderer url={testURL} ownerId={userId} givenPageContext={PageContext.Incoming} onLogOut={(e) => keycloak.logout()}/>
              :
              <div>Loading user information</div>
            :
          <div>Move to authentication page...</div>
          :
        <div>There is a problem in Keycloak configuration.</div>
        }
      </OperationContext.Provider>
      */

function App() {
  //const {keycloak, authenticated, userId } = useKeycloak(keycloakJsonFilePath); keycloak.logout()
  const userId = "64ee39b9-1682-4794-b747-9d1dbdf2398a"
  return (
    <div className="App">
      <PageRenderer url={testURL} ownerId={userId} givenPageContext={PageContext.Incoming} onLogOut={(e) => console.log()}/>
    </div>
  );
}

export default App;
