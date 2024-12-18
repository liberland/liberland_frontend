import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ModalRoot from '../../../Modals/ModalRoot';
import Button from '../../../Button/Button';
import UpdateOrCreateAssetFormModalWrapper from '../UpdateOrCreateAssetForm';
import styles from './styles.module.scss';
import MintAssetFormModalWrapper from '../MintAssetForm';

function ActionsMenu({
  isOwner,
  isAdmin,
  isIssuer,
  assetId,
  defaultValues,
  onClose,
}) {
  return (
    <div className={classNames(styles.form, styles.assetButtonsContainer)}>
      {(isOwner || isAdmin) && (
        <UpdateOrCreateAssetFormModalWrapper defaultValues={defaultValues} />
      )}
      {isIssuer && (
        <MintAssetFormModalWrapper
          assetId={assetId}
          minimumBalance={defaultValues.balance}
        />
      )}
      <Button medium onClick={onClose}>
        Close
      </Button>
    </div>
  );
}

const defaultValues = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  symbol: PropTypes.string,
  decimals: PropTypes.string,
  balance: PropTypes.number,
  admin: PropTypes.string,
  issuer: PropTypes.string,
  freezer: PropTypes.string,
});

ActionsMenu.propTypes = {
  isOwner: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isIssuer: PropTypes.bool.isRequired,
  assetId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  defaultValues,
};

function ActionsMenuModalWrapper({
  isOwner,
  isAdmin,
  isIssuer,
  assetId,
  defaultValues: dV,
}) {
  const [show, setShow] = useState();
  if (!isOwner && !isIssuer && !isAdmin) {
    return null;
  }

  return (
    <div>
      <Button primary nano onClick={() => setShow(true)}>
        Actions menu
      </Button>
      {show && (
        <ModalRoot>
          <ActionsMenu
            assetId={assetId}
            isAdmin={isAdmin}
            isIssuer={isIssuer}
            isOwner={isOwner}
            defaultValues={dV}
            onClose={() => setShow(false)}
          />
        </ModalRoot>
      )}
    </div>
  );
}

ActionsMenuModalWrapper.propTypes = {
  isOwner: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isIssuer: PropTypes.bool.isRequired,
  assetId: PropTypes.number.isRequired,
  defaultValues,
};

export default ActionsMenuModalWrapper;
