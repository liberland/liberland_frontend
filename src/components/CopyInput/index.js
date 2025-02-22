import React from 'react';
import PropTypes from 'prop-types';
import Space from 'antd/es/space';
import Input from 'antd/es/input';
import Avatar from 'antd/es/avatar';
import notification from 'antd/es/notification';
import CopyInputIcon from '../../assets/icons/copy-input.svg';
import Button from '../Button/Button';
import styles from './styles.module.scss';

function CopyInput({
  buttonLabel,
  value,
  hideLink,
}) {
  const [api, contextHolder] = notification.useNotification();
  const handleCopyClick = () => {
    navigator.clipboard.writeText(value);
    api.success({ message: 'Link copied!' });
  };
  const icon = (
    <Avatar size={20} shape="square" src={CopyInputIcon} className={styles.copyIcon} />
  );
  const button = (
    <Button onClick={handleCopyClick}>
      {buttonLabel}
      <Space />
      {icon}
    </Button>
  );

  if (hideLink) {
    return button;
  }

  return (
    <Space.Compact>
      {contextHolder}
      <Input defaultValue={value} className={styles.copyInput} />
      <Button onClick={handleCopyClick}>
        {buttonLabel}
        <Space />
        {icon}
      </Button>
    </Space.Compact>
  );
}

CopyInput.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  hideLink: PropTypes.bool,
};

export default CopyInput;
