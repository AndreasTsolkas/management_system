import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseAuthOptions {
  redirectTo: string;
}

export const hasAccessAuth = ({ redirectTo }: UseAuthOptions) => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) 
      navigate(redirectTo);
  }, [redirectTo]);

};

export const isAdminAuth = ({ redirectTo }: UseAuthOptions) => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) 
      navigate(redirectTo);
  }, [redirectTo]);

};