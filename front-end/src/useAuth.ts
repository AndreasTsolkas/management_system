import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseAuthOptions {
  redirectTo: string;
}

const useAuth = ({ redirectTo }: UseAuthOptions) => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) 
      navigate(redirectTo);
  }, [redirectTo]);

  return {
  };
};

export default useAuth;