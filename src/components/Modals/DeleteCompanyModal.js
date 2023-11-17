import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import { registriesActions } from '../../redux/actions';

function DeleteCompanyModal({
  closeModal, companyId,
}) {
  const dispatch = useDispatch();

  return (
    <div>
      <h4>Are you sure you want to request the deletion of company from the registrar ?</h4>
      <div style={{
        flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      >
        <Button
          red
          medium
          onClick={() => {
            dispatch(
              registriesActions.requestUnregisterCompanyRegistrationAction.call({
                companyId,
              }),
            );
            closeModal();
          }}
        >
          Yes
        </Button>
        <Button green medium onClick={closeModal}>No</Button>
      </div>
    </div>
  );
}

DeleteCompanyModal.propTypes = {
  companyId: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};

function DeleteCompanyModalWrapper(props) {
  return (
    <ModalRoot>
      <DeleteCompanyModal {...props} />
    </ModalRoot>
  );
}

export default DeleteCompanyModalWrapper;
