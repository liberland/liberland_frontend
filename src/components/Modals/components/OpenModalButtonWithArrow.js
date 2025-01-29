import React from 'react';
import PropTypes from 'prop-types';
import OpenModalButton from './OpenModalButton';
import styles from '../styles.module.scss';
import ButtonArrowIcon from '../../../assets/icons/button-arrow.svg';

function ButtonModalArrow(props) {
  const { text } = props;
  return (
    <OpenModalButton text={text} {...props}>
      <img src={ButtonArrowIcon} className={styles.arrowIcon} alt="button icon" />
    </OpenModalButton>
  );
}

ButtonModalArrow.propTypes = {
  text: PropTypes.string,
};

ButtonModalArrow.defaultProps = {
  text: '',
};

export default ButtonModalArrow;
