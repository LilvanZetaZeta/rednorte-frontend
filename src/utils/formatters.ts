export const formatRut = (value: string) => {
  const raw = value.replace(/[^0-9kK]/g, '').toUpperCase();
  if (!raw) return '';
  if (raw.length <= 1) return raw;

  const cuerpo = raw.slice(0, -1);
  const dv = raw.slice(-1);
  return `${cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${dv}`;
};

export const normalizeRutForBackend = (value: string) => {
  return value.replace(/\./g, '').toUpperCase();
};
