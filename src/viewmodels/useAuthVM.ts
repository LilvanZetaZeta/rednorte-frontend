import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import { validations, validateRegistration } from '../utils/validations';

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
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [fieldErrors, setFieldErrors] = useState<any>({ email: null, password: null, fullName: null, rut: null });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { 
      setSession(session); 
      setIsInitializing(false); 
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  const handleEmailChange = (v: string) => { 
    setEmail(v); 
    if (!isLogin) setFieldErrors({ ...fieldErrors, email: validations.email(v) }); 
  };
  
  const handlePasswordChange = (v: string) => { 
    setPassword(v); 
    if (!isLogin) setFieldErrors({ ...fieldErrors, password: validations.password(v) }); 
  };
  
  const handleFullNameChange = (v: string) => { 
    setFullName(v); 
    setFieldErrors({ ...fieldErrors, fullName: validations.fullName(v) }); 
  };
  
  const handleRutChange = (v: string) => { 
    setRut(v); 
    setFieldErrors({ ...fieldErrors, rut: validations.rut(v) }); 
  };

  const triggerSuccessPopup = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const translateError = (message: string): string => {
    if (message.includes('User already registered')) return 'Este correo ya se encuentra registrado.';
    if (message.includes('Invalid login credentials')) return 'Credenciales incorrectas. Inténtalo de nuevo.';
    if (message.includes('Email rate limit exceeded')) return 'Has superado el límite de intentos. Inténtalo más tarde.';
    if (message.includes('Signup disabled')) return 'El registro está deshabilitado temporalmente.';
    if (message.includes('Database error saving new user')) return 'Este RUT ya se encuentra registrado o hubo un error en los datos.';
    return message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setAuthError('');
    
    if (isLogin) {
      // Para login no mostramos errores de campo, solo procedemos
      setFieldErrors({ email: null, password: null, fullName: null, rut: null });
    } else {
      const errors = validateRegistration({ fullName, email, rut, password });
      setFieldErrors(errors);
      if (Object.values(errors).some(err => err !== null)) return;
    }
    
    setIsLoading(true);
    
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setAuthError('Credenciales incorrectas. Inténtalo de nuevo.');
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setIsSuccess(true);
        await new Promise(r => setTimeout(r, 2000));
        setShowAuthForm(false);
        setIsSuccess(false);
        triggerSuccessPopup('¡Inicio de sesión exitoso!');
      }
    } else {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password, 
        options: { data: { nombre_completo: fullName, rut, rol: 'PACIENTE' } } 
      });
      if (error) {
        setAuthError(translateError(error.message));
        setIsLoading(false);
      } else { 
        setIsLoading(false);
        setIsSuccess(true);
        await new Promise(r => setTimeout(r, 2000));
        setIsLogin(true); 
        setIsSuccess(false);
        triggerSuccessPopup('Cuenta creada exitosamente. Ya puedes iniciar sesión.');
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return { 
    session, isInitializing, showAuthForm, setShowAuthForm, 
    isLogin, setIsLogin, email, handleEmailChange, password, 
    handlePasswordChange, fullName, handleFullNameChange, rut, 
    handleRutChange, authError, isLoading, isSuccess, successMessage, handleSubmit, fieldErrors, // <-- AQUÍ EXPORTAMOS successMessage
    handleLogout 
  };
};