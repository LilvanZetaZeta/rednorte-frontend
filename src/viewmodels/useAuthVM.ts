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
  
  // Estados para el flujo visual del modal y el popup
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // <-- AQUÍ DEFINIMOS successMessage

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

  // Función para manejar el popup flotante
  const triggerSuccessPopup = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000); // El popup desaparece después de 3 segundos
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setAuthError('');
    
    if (isLogin) {
      if (Object.values(validateLogin({ email, password })).some(err => err !== null)) return;
    } else {
      if (Object.values(validateRegistration({ fullName, email, rut, password })).some(err => err !== null)) return;
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
        // Esperamos 2 segundos para la animación del modal
        await new Promise(r => setTimeout(r, 2000));
        setShowAuthForm(false);
        setIsSuccess(false);
        triggerSuccessPopup('¡Inicio de sesión exitoso!'); // <-- DISPARAMOS EL POPUP
      }
    } else {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password, 
        options: { data: { nombre_completo: fullName, rut, rol: 'PACIENTE' } } 
      });
      if (error) {
        setAuthError(error.message);
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