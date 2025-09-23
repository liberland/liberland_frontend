import React from 'react';
import PropTypes from 'prop-types';
import Input from 'antd/es/input';
import Flex from 'antd/es/flex';
import { useDispatch, useSelector } from 'react-redux';
import Divider from 'antd/es/divider';
import styles from './styles.module.scss';

function Search({
  data,
  children,
  action,
  reset,
  selector,
  placeholder,
}) {
  const dispatch = useDispatch();
  const result = useSelector(selector);

  return (
    <Flex vertical>
      <Input.Search
        size="large"
        enterButton="Search"
        placeholder={placeholder}
        className={styles.search}
        allowClear
        onClear={() => reset()}
        onSearch={(value) => {
          dispatch(value ? action({ data, value }) : reset());
        }}
      />
      <Divider />
      {children(result || data)}
    </Flex>
  );
}

Search.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
  action: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  selector: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
};

export default Search;
