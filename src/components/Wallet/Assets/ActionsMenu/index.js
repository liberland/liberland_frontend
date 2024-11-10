import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ModalRoot from '../../../Modals/ModalRoot';
import Button from '../../../Button/Button';
import UpdateOrCreateAssetFormModalWrapper from '../UpdateOrCreateAssetForm';
import styles from './styles.module.scss';
import MintAssetFormModalWrapper from '../MintAssetForm';
import FreezeAssetFormModalWrapper from '../FreezeAssetForm';
import ThawAssetFormModalWrapper from '../ThawAssetForm';

function ActionsMenu({
  isFreezer,
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
        <MintAssetFormModalWrapper assetId={assetId} />
      )}
      {isFreezer && (
        <>
          <FreezeAssetFormModalWrapper assetId={assetId} />
          <ThawAssetFormModalWrapper assetId={assetId} />
        </>
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
  balance: PropTypes.string,
  admin: PropTypes.string,
  issuer: PropTypes.string,
  freezer: PropTypes.string,
});

ActionsMenu.propTypes = {
  isFreezer: PropTypes.bool.isRequired,
  isOwner: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isIssuer: PropTypes.bool.isRequired,
  assetId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  defaultValues,
};

function ActionsMenuModalWrapper(props) {
  const [show, setShow] = React.useState();
  return (
    <div>
      <Button primary nano onClick={() => setShow(true)}>
        Actions menu
      </Button>
      {show && (
        <ModalRoot>
          <ActionsMenu
            {...props}
            onClose={() => setShow(false)}
          />
        </ModalRoot>
      )}
    </div>
  );
}

export default ActionsMenuModalWrapper;
