export const markdown2sections = (data) => {
  const lines = data.split('\n');
  const sections = lines.reduce((acc, line) => {
    if (!line) return acc;
    if (line.startsWith('#') || acc.length === 0) acc.push('');
    acc[acc.length - 1] += `${line}\n`;
    return acc;
  }, []);
  return sections.map((s) => s.trim());
};
