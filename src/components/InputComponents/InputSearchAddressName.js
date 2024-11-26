import React, { useState } from 'react';
import Autocomplete from 'antd/es/auto-complete';
import cx from 'classnames';
import { getUsersIdentityData } from '../../api/explorer';
import styles from './styles.module.scss';

function InputSearch(props) {
  const [suggestions, setSuggestions] = useState([]);
  const debouncedSearch = async (searchTerm) => {
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
            ? <span className={styles.icon}>&#10003;</span>
            : <span className={cx(styles.icon, styles.iconRed)}>&#10005;</span>}
        </span>
      ),
    })));
  };

  return (
    <Autocomplete
      {...props}
      onSearch={debouncedSearch}
      options={suggestions}
    />
  );
}

export default InputSearch;
