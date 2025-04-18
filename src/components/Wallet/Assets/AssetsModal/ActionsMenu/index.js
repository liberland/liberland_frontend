import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import Button from '../../../../Button/Button';
import CreateOrUpdateAssetModal from '../CreateOrUpdateAsset';
import MintModal from '../MintModal';

function ActionsMenu({
  isOwner,
  isAdmin,
  isIssuer,
  isStock,
  assetId,
  defaultValues,
  onClose,
}) {
  return (
    <Flex gap="15px" justify="center" align="center" vertical>
      {(isOwner || isAdmin) && (
        <CreateOrUpdateAssetModal defaultValues={defaultValues} isStock={isStock} />
      )}
      {isIssuer && (
        <MintModal
          assetId={assetId}
          minimumBalance={defaultValues.balance}
        />
      )}
      <Button medium onClick={onClose}>
        Close
      </Button>
    </Flex>
  );
}

const defaultValues = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  symbol: PropTypes.string,
  decimals: PropTypes.number,
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
  isStock: PropTypes.bool,
  defaultValues,
};

export default ActionsMenu;
