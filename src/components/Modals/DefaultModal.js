import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../Button/Button';
import styles from './styles.module.scss';

function DefaultModal({
  text,
  onClickButton,
  children,
  style,
  textButton,
}) {
  return (
    <div className={classNames(styles.getCitizenshipModal, styles.defaultModal, style)}>
      <h3 className={styles.h3}>{text}</h3>
      {children}
      <div className={styles.buttons}>
        <Button type="button" onClick={onClickButton} primary medium>
          {textButton}
        </Button>
      </div>
    </div>
  );
}
DefaultModal.defaultProps = {
  children: undefined,
  style: undefined,
  textButton: 'I understand',
};

DefaultModal.propTypes = {
  textButton: PropTypes.string,
  onClickButton: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  children: PropTypes.element,
  style: PropTypes.string,
};

export default DefaultModal;
