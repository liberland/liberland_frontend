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
  buttonLeft,
  buttonRight,
}) {
  return (
    <div className={classNames(styles.agreeDisagree, style)}>
      <h3>{text}</h3>
      {children || <span>This operation costs 100 LLD.</span>}
      <div className={styles.buttons}>
        <Button type="button" onClick={onDisagree} medium>
          {buttonLeft || 'Cancel'}
        </Button>
        <Button type={agreeButtonType} onClick={onAgree} primary medium>
          {buttonRight || 'Submit'}
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
  buttonLeft: undefined,
  buttonRight: undefined,
};

AgreeDisagreeModal.propTypes = {
  onAgree: PropTypes.func,
  text: PropTypes.string,
  onDisagree: PropTypes.func.isRequired,
  agreeButtonType: PropTypes.string,
  children: PropTypes.element,
  style: PropTypes.string,
  buttonLeft: PropTypes.string,
  buttonRight: PropTypes.string,
};

export default AgreeDisagreeModal;
