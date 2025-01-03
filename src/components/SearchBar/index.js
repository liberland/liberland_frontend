import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Flex from 'antd/es/flex';
import styles from './styles.module.scss';
import { ReactComponent as SearchIcon } from '../../assets/icons/search.svg';
import Button from '../Button/Button';

function SearchBar({
  setSearchTerm,
}) {
  const [form] = Form.useForm();
  return (
    <div className={styles.searchBarWrapper}>
      <Form form={form} onFinish={({ searchTerm }) => setSearchTerm(searchTerm)} className={styles.signInForm}>
        <Form.Item
          name="searchTerm"
          label="Search validators"
        >
          <Input />
        </Form.Item>
        <Flex wrap gap="15px">
          <Button className={styles.button}>
            Search
            <SearchIcon className={styles.icon} />
          </Button>
        </Flex>
      </Form>
    </div>
  );
}

SearchBar.propTypes = {
  setSearchTerm: PropTypes.func.isRequired,
};

export default SearchBar;
