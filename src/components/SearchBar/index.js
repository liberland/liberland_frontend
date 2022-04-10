import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import {useForm} from "react-hook-form";
import {ReactComponent as SearchIcon} from "../../assets/icons/search.svg";
import {TextInput} from "../InputComponents";

const SearchBar = ({
  setSearchTerm,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm();
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
};

SearchBar.propTypes = {
  setSearchTerm: PropTypes.func.isRequired,
};

export default SearchBar;
