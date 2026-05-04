import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import type { Session } from '@supabase/supabase-js';

export const useAuthVM = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isLogin, setIsLogin] = useState(true); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); 
  const [rut, setRut] = useState(''); 
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsInitializing(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthError('Credenciales incorrectas.');
    } else {
      const { error } = await supabase.auth.signUp({
        email, password, options: { data: { full_name: fullName, rut: rut, rol: 'paciente' } }
      });
      if (error) setAuthError(error.message);
      else {
        alert('Cuenta creada. Ya puedes iniciar sesión.');
        setIsLogin(true);
        setPassword('');
      }
    }
    setIsLoading(false);
  };

  return {
    session,
    isInitializing,
    showAuthForm,
    setShowAuthForm,
    isLogin,
    setIsLogin,
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    rut,
    setRut,
    authError,
    isLoading,
    handleSubmit
  };
};