import React from 'react';
import ModalRoot from "./ModalRoot";
import Button from "../Button/Button";
import PropTypes from "prop-types";

function DeleteCompanyModal({
  closeModal
}){
  return (
    <div>
      <h4>Are you sure you want to request the deletion of company from the registrar ?</h4>
      <div style={{flexDirection:'row', display:'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Button red medium onClick={() => {closeModal()}}>Yes</Button>
        <Button green medium onClick={() => {closeModal()}}>No</Button>
      </div>
    </div>
  )
}

DeleteCompanyModal.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  onSubmitPropose: PropTypes.func.isRequired,
};

function DeleteCompanyModalWrapper(props) {
  return (
    <ModalRoot>
      <DeleteCompanyModal {...props} />
    </ModalRoot>
  )
}

export default DeleteCompanyModalWrapper
