import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import Result from 'antd/es/result';
import { contractsSelectors } from '../../../redux/selectors';
import { contractsActions } from '../../../redux/actions';
import ContractItem from '../ContractItem';

function Contract() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const contract = useSelector(contractsSelectors.selectorSingleContract);

  useEffect(() => {
    dispatch(contractsActions.getSingleContract.call({ id }));
  }, [dispatch, id]);

  if (!contract) {
    return <Result status={404} title="No contract data found" />;
  }

  return (
    <ContractItem
      {...contract}
    />
  );
}

export default Contract;
