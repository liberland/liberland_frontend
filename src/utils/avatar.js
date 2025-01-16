export const getAvatarParameters = (name) => {
  const text = name || 'U';
  const color = `#${
    text.split('').map((c) => c.charCodeAt(0).toString(16)).join('').slice(0, 6)}`;
  return { color, text: text[0] };
};
