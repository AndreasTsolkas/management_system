import {Cookies} from 'react-cookie';
import * as Important from "src/important";

const accessTokenCookieName = Important.accessTokenCookie;
const adminCookieName = Important.adminCookie;

export const isTokenExpired = () => {
    const cookies = new Cookies();
    const accessToken = cookies.get(accessTokenCookieName); 
    const adminCookie = cookies.get(adminCookieName); 
  
    if (!accessToken || !adminCookie) 
      return true;
  
    const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
    const expirationDate = new Date(tokenPayload.exp * 1000);
  
    return expirationDate < new Date();
  };
  

export const deleteAllCookies = () => {
    const cookies = new Cookies();
    cookies.remove(accessTokenCookieName); 
    cookies.remove(adminCookieName); 
};

export const cookiesValidation = () => {
    let valid = true;
    if(isTokenExpired()) {
        valid = false;
        deleteAllCookies();
    }
    console.log('Running every X time...');
    return valid;
  };