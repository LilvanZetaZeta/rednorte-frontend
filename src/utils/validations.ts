export const validations = {
  email: (value: string): string | null => {
    if (!value) return null;
    if (value.length > 255) return 'El correo no puede exceder 255 caracteres';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Por favor ingresa un correo válido (ej: usuario@ejemplo.com)';
    return null;
  },

  password: (value: string): string | null => {
    if (!value) return null;
    if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    if (value.length > 32) return 'La contraseña no puede exceder 32 caracteres';
    if (!/[A-Z]/.test(value)) return 'La contraseña debe contener al menos una mayúscula';
    if (!/[a-z]/.test(value)) return 'La contraseña debe contener al menos una minúscula';
    if (!/[0-9]/.test(value)) return 'La contraseña debe contener al menos un número';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) 
      return 'La contraseña debe contener al menos un carácter especial (!@#$%^&*)';
    return null;
  },

  fullName: (value: string): string | null => {
    if (!value) return null;
    if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres';
    if (value.length > 50) return 'El nombre no puede exceder 50 caracteres';
    if (!/^[a-záéíóúñüA-ZÁÉÍÓÚÑÜ\s]+$/.test(value)) 
      return 'El nombre solo puede contener letras y espacios';
    return null;
  },

  rut: (value: string): string | null => {
    if (!value) return null;
    
    if (!/^[0-9]+-[0-9kK]{1}$/.test(value)) {
      return 'El RUT debe tener formato: números-dígito verificador (ej: 12345678-9 o 12345678-K)';
    }
    
    const parts = value.split('-');
    const rutNumber = parts[0];
    const verifier = parts[1].toLowerCase();
    
    const expectedVerifier = calculateRutVerifier(rutNumber);
    
    if (verifier !== expectedVerifier) {
      return 'El RUT no es válido (dígito verificador incorrecto)';
    }
    
    return null;
  },

  phone: (value: string): string | null => {
    if (!value) return null;
    const phoneRegex = /^\+?[0-9]{9,15}$/;
    if (!phoneRegex.test(value.replace(/[\s\-]/g, ''))) 
      return 'Por favor ingresa un teléfono válido (9-15 números)';
    return null;
  },
};

export const calculateRutVerifier = (rutNumber: string): string => {
  let sum = 0;
  let multiplier = 2;
  
  for (let i = rutNumber.length - 1; i >= 0; i--) {
    sum += parseInt(rutNumber[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const mod = 11 - (sum % 11);
  if (mod === 11) return '0';
  if (mod === 10) return 'k';
  return mod.toString();
};

export const validateRegistration = (data: {
  fullName: string;
  email: string;
  rut: string;
  password: string;
}): Record<string, string | null> => {
  return {
    fullName: validations.fullName(data.fullName),
    email: validations.email(data.email),
    rut: validations.rut(data.rut),
    password: validations.password(data.password),
  };
};

export const validateLogin = (data: {
  email: string;
  password: string;
}): Record<string, string | null> => {
  return {
    email: validations.email(data.email) || (!data.email ? 'El correo es requerido' : null),
    password: validations.password(data.password) || (!data.password ? 'La contraseña es requerida' : null),
  };
};
