import React, { useState } from 'react';

import Card from '../../Card';
import { ReactComponent as PassportIcon } from '../../../assets/icons/passport-icon.svg';

import styles from './styles.module.scss';
import Button from '../../Button/Button';
import { GetCitizenshipModal } from '../../Modals';

const GetCitizenshipCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => setIsModalOpen(!isModalOpen);

  const handleSubmit = (values) => console.log('values', values);

  return (
    <>
      <Card className={styles.getCitizenshipCard}>
        <PassportIcon />
        <h3>Get a Liberland Citizenship!</h3>
        <p>You just need to stake 5k LLM</p>
        <Button primary small onClick={handleModalOpen}>Apply now</Button>
      </Card>
      {isModalOpen && <GetCitizenshipModal onSubmit={handleSubmit} closeModal={handleModalOpen} />}
    </>
  );
};

export default GetCitizenshipCard;
