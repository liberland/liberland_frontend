import React from 'react';
import Button from '../Button/Button';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import classNames from 'classnames';

function AgreeDisagreeModal({
  text = 'are you sure you want to proceed?',
  onAgree,
  onDisagree,
  agreeButtonType,
  children,
  style,
}) {
  return (
    <div className={classNames(styles.agreeDisagree, style)}>
      <h3>{text}</h3>
      {!!children ? children : <span>This opperation cost 100 LLD.</span>}
      <div className={styles.buttons}>
        <Button type="button" onClick={onDisagree} medium>
          No
        </Button>
        <Button type={agreeButtonType} onClick={onAgree} primary medium>
          Yes
        </Button>
      </div>
    </div>
  );
}
AgreeDisagreeModal.defaultProps = {
  text: 'Are you sure you want to proceed',
  agreeButtonType: 'button',
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
