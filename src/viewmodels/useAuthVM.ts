import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import { validations, validateLogin, validateRegistration } from '../utils/validations';

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
  
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({
    email: null,
    password: null,
    fullName: null,
    rut: null,
  });

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

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (!isLogin) {
      setFieldErrors(prev => ({ ...prev, email: validations.email(value) }));
    } else {
      setFieldErrors(prev => ({ ...prev, email: null }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (!isLogin) {
      setFieldErrors(prev => ({ ...prev, password: validations.password(value) }));
    } else {
      setFieldErrors(prev => ({ ...prev, password: null }));
    }
  };

  const handleFullNameChange = (value: string) => {
    setFullName(value);
    setFieldErrors(prev => ({ ...prev, fullName: validations.fullName(value) }));
  };

  const handleRutChange = (value: string) => {
    setRut(value);
    setFieldErrors(prev => ({ ...prev, rut: validations.rut(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    // Validar campos antes de enviar
    if (isLogin) {
      const errors = validateLogin({ email, password });
      setFieldErrors(errors);
      if (Object.values(errors).some(err => err !== null)) return;
    } else {
      const errors = validateRegistration({ fullName, email, rut, password });
      setFieldErrors(errors);
      if (Object.values(errors).some(err => err !== null)) return;
    }

    setIsLoading(true);
    
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthError('Credenciales incorrectas.');
    } else {
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre_completo: fullName,
            rut: rut,
            rol: 'PACIENTE'
          }
        }
      });
      
      if (error) setAuthError(error.message);
      else {
        alert('Cuenta creada exitosamente. Ya puedes iniciar sesión.');
        setIsLogin(true);
        setPassword('');
      }
    }
    setIsLoading(false);
  };

  return {
    session, isInitializing, showAuthForm, setShowAuthForm,
    isLogin, setIsLogin, email, handleEmailChange, password, handlePasswordChange,
    fullName, handleFullNameChange, rut, handleRutChange, authError, isLoading, handleSubmit,
    fieldErrors
  };
};