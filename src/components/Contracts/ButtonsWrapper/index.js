import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import { contractsActions } from '../../../redux/actions';
import { contractsSelectors } from '../../../redux/selectors';
import Button from '../../Button/Button';

function ButtonsWrapper({
  contractId,
  isContractSign,
  isMeSignedAsJudge,
  isMeSigned,
  isMyContracts,
}) {
  const dispatch = useDispatch();
  const isUserJudge = useSelector(contractsSelectors.selectorIsUserJudgde);

  return (
    <Flex wrap gap="15px">
      {!isMeSigned && (
        <Button
          primary
          onClick={() => dispatch(contractsActions.signContract.call({ contractId, isMyContracts }))}
        >
          Sign as a party
        </Button>
      )}

      {!isMeSignedAsJudge && isUserJudge && (
        <Button
          primary
          onClick={() => dispatch(
            contractsActions.signContractJudge.call({
              contractId,
              isMyContracts,
            }),
          )}
        >
          Sign as a judge
        </Button>
      )}

      {!isContractSign && (
        <Button
          red
          onClick={() => dispatch(contractsActions.removeContract.call({ contractId, isMyContracts }))}
        >
          Remove
        </Button>
      )}
    </Flex>
  );
}

ButtonsWrapper.defaultProps = {
  isMyContracts: false,
};

ButtonsWrapper.propTypes = {
  isMyContracts: PropTypes.bool,
  contractId: PropTypes.string.isRequired,
  isContractSign: PropTypes.bool.isRequired,
  isMeSigned: PropTypes.bool.isRequired,
  isMeSignedAsJudge: PropTypes.bool.isRequired,
};

export default ButtonsWrapper;
