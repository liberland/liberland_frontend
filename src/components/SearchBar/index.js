import React from 'react';
import { useForm } from 'react-hook-form';
import styles from './styles.module.scss';
import { ReactComponent as SearchIcon } from '../../assets/icons/search.svg';
import { TextInput } from '../InputComponents';

function SearchBar() {
  const { register } = useForm();
  return (
    <div className={styles.searchBarWrapper}>
      <form className={styles.signInForm}>
        <TextInput
          register={register}
          name="searchTerm"
          placeholder="Search validators"
          withIcon
          Icon={SearchIcon}
        />
      </form>
    </div>
  );
}

export default SearchBar;
