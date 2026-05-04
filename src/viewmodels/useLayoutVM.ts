import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

export const useLayoutVM = () => {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.full_name || 'Usuario');
        setUserRole(user.user_metadata?.rol || 'paciente');
      }
    };
    fetchUser();
  }, []);

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut();
    // Forzamos recarga para limpiar memoria
    window.location.href = '/'; 
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return {
    userName,
    userRole,
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    handleCerrarSesion
  };
};