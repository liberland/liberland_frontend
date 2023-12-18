import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../Button/Button';
import styles from './styles.module.scss';

function AgreeDisagreeModal({
  text,
  onAgree,
  onDisagree,
  agreeButtonType,
  children,
  style,
}) {
  return (
    <div className={classNames(styles.agreeDisagree, style)}>
      <h3>{text}</h3>
      {children || <span>This opperation costs 100 LLD.</span>}
      <div className={styles.buttons}>
        <Button type="button" onClick={onDisagree} medium>
          Cancel
        </Button>
        <Button type={agreeButtonType} onClick={onAgree} primary medium>
          Submit
        </Button>
      </div>
    </div>
  );
}
AgreeDisagreeModal.defaultProps = {
  text: 'Are you sure you want to proceed?',
  agreeButtonType: 'button',
  onAgree: () => {},
  children: undefined,
  style: undefined,
};

AgreeDisagreeModal.propTypes = {
  onAgree: PropTypes.func,
  text: PropTypes.string,
  onDisagree: PropTypes.func.isRequired,
  agreeButtonType: PropTypes.string,
  children: PropTypes.element,
  style: PropTypes.string,
};

export default AgreeDisagreeModal;
