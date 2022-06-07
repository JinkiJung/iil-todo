import {useEffect, useState } from 'react';
import Keycloak, { KeycloakInstance } from 'keycloak-js';

const UseKeycloak = (jsonFilePath: string) => {
    const [ keycloak ] = useState<KeycloakInstance>(Keycloak(jsonFilePath));
    const [ authenticated, setAuthenticated ] = useState(false);
    const [ userId, setUserId ] = useState("");
    useEffect(() => {
        keycloak.init({onLoad: 'login-required'}).then(res_authenticated => {
            setAuthenticated(res_authenticated); 
            keycloak.loadUserInfo().then((userInfo: any) => {setUserId(userInfo.sub);})
        });
    },[keycloak]);

    return {keycloak, authenticated, userId};  
  };

export default UseKeycloak;
