import React from 'react';
import PropTypes from 'prop-types';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Flex from 'antd/es/flex';
import Space from 'antd/es/space';
import Button from '../Button/Button';

function SearchBar({
  setSearchTerm,
}) {
  const [form] = Form.useForm();
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={({ searchTerm }) => setSearchTerm(searchTerm)}
    >
      <Form.Item
        name="searchTerm"
        label="Search validators"
      >
        <Input />
      </Form.Item>
      <Flex wrap gap="15px">
        <Button primary>
          Search
          <Space />
          <SearchOutlined />
        </Button>
      </Flex>
    </Form>
  );
}

SearchBar.propTypes = {
  setSearchTerm: PropTypes.func.isRequired,
};

export default SearchBar;
