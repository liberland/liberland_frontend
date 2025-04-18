import { useState } from 'react';

export const useTitleFromMarkdown = (hideTitle, defaultTitle) => {
  const [title, setTitle] = useState(defaultTitle);
  const setTitleFromRef = (paragraphRef) => {
    const firstTitle = paragraphRef?.querySelector('h1,h2,h3,h4,h5');
    const titleContents = firstTitle?.innerText;
    if (titleContents && title !== titleContents) {
      setTitle(titleContents);
    }
    if (hideTitle) {
      firstTitle?.classList.add('hidden');
    }
  };
  return { title, setTitleFromRef };
};
