import objectHash from 'object-hash';

export const getAvatarParameters = (name) => {
  const text = name || 'U';
  const color = `#${objectHash(text).slice(0, 6)}`;
  return { color, text: text[0].toUpperCase() };
};
