import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import stylesPage from '../../utils/pagesBase.module.scss';
import { contractsSelectors } from '../../redux/selectors';
import { contractsActions } from '../../redux/actions';
import ContractsList from './ContractsList';
import LoadingNoDataWrapper from '../LoadingNoDataWrapper';

export default function Contracts() {
  const dispatch = useDispatch();
  const contracts = useSelector(contractsSelectors.selectorContracts);

  useEffect(() => {
    dispatch(contractsActions.getContracts.call());
  }, [dispatch]);

  return (
    <div className={stylesPage.sectionWrapper}>
      <div className={stylesPage.contentWrapper}>
        <LoadingNoDataWrapper length={contracts?.length}>
          <ContractsList contracts={contracts} />
        </LoadingNoDataWrapper>
      </div>
    </div>
  );
}
