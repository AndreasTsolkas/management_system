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

export const isAdminAuth = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const redirectTo = Important.redirectWhenHasNoAccess;
  
  const checkAdmin = () => {
    const admin = cookies[adminCookie];
    if (admin === 'false') {
      navigate(redirectTo);
    }
    return admin; 
  };

  useEffect(() => {
    checkAdmin();
  }, [redirectTo]);

  return checkAdmin();
};

export const isAccessTokenNotExpired = () => {
  const navigate = useNavigate();
  const redirectTo = Important.redirectWhenHasNoAccess;
  
  if(!Cookies.cookiesValidation())
    navigate(redirectTo);

};