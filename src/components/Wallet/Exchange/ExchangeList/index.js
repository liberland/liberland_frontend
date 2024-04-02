import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { dexSelectors } from '../../../../redux/selectors';
import { dexActions } from '../../../../redux/actions';
import stylesPage from '../../../../utils/pagesBase.module.scss';
import styles from '../styles.module.scss';
import ExchangeItem from '../ExchangeItem';

function ExchangeList() {
  const dispatch = useDispatch();
  const dexs = useSelector(dexSelectors.selectorDex);
  useEffect(() => {
    dispatch(dexActions.getPools.call());
  }, [dispatch]);

  if (!dexs) {
    return (
      <div>Loading..</div>
    );
  }
  if (dexs.length < 1) {
    return (
      <div>There is no any pool...</div>
    );
  }
  return (
    <div className={cx(stylesPage.overViewCard, styles.list)}>
      {
        dexs.map((dex, index) => (
          <ExchangeItem
            dex={dex}
            // eslint-disable-next-line react/no-array-index-key
            key={index + dex.asset1 + dex.asset2}
          />
        ))
}
    </div>
  );
}

export default ExchangeList;
