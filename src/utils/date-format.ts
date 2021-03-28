export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const meses = [
    'jan',
    'fev',
    'mar',
    'abr',
    'mai',
    'jun',
    'jul',
    'ago',
    'set',
    'out',
    'nov',
    'dez',
  ];
  return `${date.getDate()} ${meses[date.getMonth()]} ${date.getFullYear()}`;
};
