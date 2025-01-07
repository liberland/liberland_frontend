import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import Alert from 'antd/es/alert';
import { contractsSelectors } from '../../../redux/selectors';
import { contractsActions } from '../../../redux/actions';
import ContractsList from '../ContractsList';

function Contract() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const contract = useSelector(contractsSelectors.selectorSingleContract);

  useEffect(() => {
    dispatch(contractsActions.getSingleContract.call({ id }));
  }, [dispatch, id]);

  if (!contract) {
    return <Alert type="info" message="no data" />;
  }

  return (
    <ContractsList contracts={[contract]} isOneItem />
  );
}

export default Contract;
