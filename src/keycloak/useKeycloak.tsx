import {useEffect, useState } from 'react';
import Keycloak, { KeycloakInstance } from 'keycloak-js';

const UseKeycloak = (jsonFilePath: string) => {
    const [ keycloak, setKeycloak ] = useState<KeycloakInstance>(Keycloak(jsonFilePath));
    const [ authenticated, setAuthenticated ] = useState(false);

    useEffect(() => {
        keycloak.init({onLoad: 'login-required'}).then(res_authenticated => {
            setAuthenticated(res_authenticated);            
        });
    },[keycloak]);

    return {keycloak, authenticated};  
  };

export default UseKeycloak;
