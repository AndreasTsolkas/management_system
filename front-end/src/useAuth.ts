import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import * as Important from 'src/important';
import * as Cookies from 'src/cookies';

const accessTokenCookie = Important.accessTokenCookie;
const adminCookie = Important.adminCookie;

export const hasAccessAuth = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const redirectTo = Important.redirectWhenHasNoAccess;

  const checkAccess = () => {
    const token = cookies[accessTokenCookie];
    if (!token) {
      navigate(redirectTo);
    }
  };

  useEffect(() => {
    checkAccess();
  }, [redirectTo]);

  return checkAccess;
};

export const isAdminAuth = (reverse?:boolean) => {
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const redirectTo = Important.redirectWhenHasNoAccess;
  const admin = cookies[adminCookie];

  const isAdmin = () => {
    if (!admin) {
      navigate(redirectTo);
    }
    return admin; 
  };

  const isNotAdmin = () => {
    if (admin) {
      navigate(redirectTo);
    }
    return admin; 
  };

  useEffect(() => {
    if(!reverse) isAdmin()
    else isNotAdmin();
  }, [redirectTo]);

};

export const isAccessTokenNotExpired = () => {
  const navigate = useNavigate();
  const redirectTo = Important.redirectWhenHasNoAccess;
  
  if(!Cookies.cookiesValidation())
    navigate(redirectTo);

};