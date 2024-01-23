import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import * as Important from 'src/important';

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