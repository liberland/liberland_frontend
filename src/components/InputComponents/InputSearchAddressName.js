import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import cx from 'classnames';
import { getUsersIdentityData } from '../../api/explorer';
import TextInput from './TextInput';
import styles from './styles.module.scss';

function InputSearch({
  id,
  errorTitle,
  register,
  name,
  placeholder,
  validate,
  setValue,
  isRequired,
  trigger,
  defaultValue,
}) {
  const inputProps = {
    errorTitle,
    register,
    name,
    placeholder,
    isRequired,
    validate,
    id,
  };
  const [inputValue, setInputValue] = useState(defaultValue || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestedListShown, setIsSuggestedListShown] = useState(true);

  const debouncedSearch = _.debounce(async (searchTerm) => {
    const apiData = await getUsersIdentityData(searchTerm);
    setSuggestions(apiData);
  }, 300);

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setValue(name, searchTerm);
    setInputValue(searchTerm);
    if (searchTerm.length >= 3) {
      debouncedSearch(searchTerm);
      if (!isSuggestedListShown) {
        setIsSuggestedListShown(true);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setValue(name, suggestion);
    setInputValue(suggestion);
    setSuggestions([]);
    trigger(name);
  };

  return (
    <div className={styles.inputSearch}>
      <div className={styles.inputSearchWrapper}>
        <TextInput
          onChange={handleSearchChange}
          value={inputValue}
          {...inputProps}
        />
        {isSuggestedListShown && suggestions.length > 0 && (
          <div className={styles.suggestionWrapper}>
            <button className={styles.close} onClick={() => setIsSuggestedListShown(false)}>&#10005;</button>
            <ul className={styles.suggestionList}>
              {suggestions.map((result) => {
                const { name: nameUser, id: userId, isConfirmed } = result;
                return (
                  <li key={id}>
                    <button onClick={() => handleSuggestionClick(userId)}>
                      <span>
                        <b>{nameUser}</b>
                      &nbsp;
                        {id}
                      &nbsp;
                        {isConfirmed
                          ? <span className={styles.icon}>&#10003;</span>
                          : <span className={cx(styles.icon, styles.iconRed)}>&#10005;</span>}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

        )}
      </div>
    </div>
  );
}

InputSearch.propTypes = {
  id: PropTypes.string,
  errorTitle: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  validate: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  isRequired: PropTypes.bool.isRequired,
  trigger: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
};

export default InputSearch;
