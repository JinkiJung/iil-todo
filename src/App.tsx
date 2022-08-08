import React, { useState } from 'react';
import './App.css';
import 'reflect-metadata';
import { PageContext } from './type/pageContext';
import useKeycloak from './keycloak/useKeycloak';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { IilDetailPage } from './element/component/IilDetailPage';
import { Page } from './element/component/Page';

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
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Page ownerId={userId} onLogOut={(e) => console.log()}/>}>
        <Route path="expenses" element={<Page ownerId={userId} onLogOut={(e) => console.log()}/>}/>
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Route>
    </Routes>
    </BrowserRouter>
    
  );
}

export default App;
