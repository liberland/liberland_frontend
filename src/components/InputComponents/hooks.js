import { useEffect, useState } from 'react';
import { getUsersIdentityData } from '../../api/explorer';

export const useConfirmed = ({ value }) => {
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [name, setName] = useState('Unknown');
  useEffect(() => {
    (async () => {
      setError(false);
      setLoading(true);
      try {
        const apiData = await getUsersIdentityData(value);
        setIsConfirmed(apiData[0]?.isConfirmed || false);
        if (apiData[0]?.name) {
          setName(apiData[0]?.name);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [value]);
  return {
    loading,
    error,
    isConfirmed,
    name,
  };
};
