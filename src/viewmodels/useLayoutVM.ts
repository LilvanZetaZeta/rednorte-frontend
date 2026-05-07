import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

export const useLayoutVM = () => {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserName(session.user.user_metadata?.nombre_completo || 'Usuario');
        setUserRole(session.user.user_metadata?.rol?.toLowerCase() || 'paciente');
      }
    });
  }, []);

  const handleCerrarSesion = async () => { await supabase.auth.signOut(); window.location.href = '/'; };
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return { userName, userRole, isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, handleCerrarSesion };
};