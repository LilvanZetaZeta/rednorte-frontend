import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

export const useLayoutVM = () => {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (isMounted && session?.user) {
        const metadata = session.user.user_metadata;
        setUserName(metadata?.nombre_completo || metadata?.full_name || 'Usuario');
        setUserRole(metadata?.rol?.toLowerCase() || 'paciente');
      }
    };

    fetchUser();
    return () => { isMounted = false; };
  }, []);

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut();
    window.location.href = '/'; 
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return {
    userName,
    userRole,
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    handleCerrarSesion
  };
};