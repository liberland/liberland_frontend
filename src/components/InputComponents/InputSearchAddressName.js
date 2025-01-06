import React, { useState } from 'react';
import Autocomplete from 'antd/es/auto-complete';
import Spin from 'antd/es/spin';
import CheckCircleFilled from '@ant-design/icons/CheckCircleFilled';
import CloseCircleFilled from '@ant-design/icons/CloseCircleFilled';
import { getUsersIdentityData } from '../../api/explorer';

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
        label: name,
        value: id,
        children: (
          <span>
            <strong>{name}</strong>
            &nbsp;
            {id}
            &nbsp;
            {isConfirmed
              ? <CheckCircleFilled color="green" />
              : <CloseCircleFilled color="red" />}
          </span>
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
