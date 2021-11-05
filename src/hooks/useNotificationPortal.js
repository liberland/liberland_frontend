import { useState, useEffect } from 'react';

export const useNotofication = () => {
  const [loaded, setLoaded] = useState(false);
  const [portalId] = useState(new Date().valueOf() * Math.random());

  useEffect(() => {
    const div = document.createElement('div');
    div.id = portalId;
    document.getElementsByTagName('body')[0].prepend(div);
    setLoaded(true);

    return () => document.getElementsByTagName('body')[0].removeChild(div);
  }, [portalId]);

  return { loaded, portalId };
};
