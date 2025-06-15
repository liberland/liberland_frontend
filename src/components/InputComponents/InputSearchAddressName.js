import React, { useState } from 'react';
import Autocomplete from 'antd/es/auto-complete';
import Spin from 'antd/es/spin';
import Flex from 'antd/es/flex';
import { getUsersIdentityData } from '../../api/explorer';
import IsConfirmed from './IsConfirmed';

function InputSearch(props) {
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [suggestions, setSuggestions] = useState([]);
  const debouncedSearch = async (searchTerm) => {
    setError(false);
    setLoading(true);
    try {
      const apiData = await getUsersIdentityData(searchTerm);
      setSuggestions(apiData.map(({ name, id, isConfirmed }) => ({
        value: id,
        label: (
          <Flex gap="15px">
            <IsConfirmed isConfirmed={isConfirmed} />
            <strong>{name}</strong>
            <span>
              {id}
            </span>
          </Flex>
        ),
      })));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const loader = [
    {
      label: 'Loading...',
      disabled: true,
      value: '',
      children: <Spin />,
    },
  ];

  return (
    <Autocomplete
      onSearch={debouncedSearch}
      options={loading ? loader : suggestions}
      placeholder="Start typing to see users"
      status={error ? 'error' : undefined}
      {...props}
    />
  );
}

export default InputSearch;
