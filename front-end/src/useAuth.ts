import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Important from 'src/important';

export const hasAccessAuth = () => {
  const navigate = useNavigate();
  const redirectTo = Important.redirectWhenHasNoAccess;

  const checkAccess = () => {
    const token = localStorage.getItem('access_token');
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
  const redirectTo = Important.redirectWhenIsNotAdmin;

  const checkAdmin = () => {
    const admin = localStorage.getItem('admin');
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