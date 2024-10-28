import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cx from 'classnames';
import { walletSelectors } from '../../../redux/selectors';
import { walletActions } from '../../../redux/actions';
import stylesPage from '../../../utils/pagesBase.module.scss';
import Card from '../../Card';
import Table from '../../Table';
import styles from './styles.module.scss';

function Assets() {
  const additionalAssets = useSelector(walletSelectors.selectorAdditionalAssets);
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(walletActions.getAdditionalAssets.call());
  }, [dispatch]);

  return (
    <div className={stylesPage.contentWrapper}>
      <div className={stylesPage.sectionWrapper}>
        <Card className={cx(stylesPage.overviewWrapper, styles.cardWrapper)} title="Info">
          <p>
            Here lies assets description
          </p>
        </Card>
        <br />
        <Card className={cx(stylesPage.overviewWrapper, styles.cardWrapper)} title="Overview">
          {additionalAssets ? <Table data={additionalAssets} /> : <div>Loading...</div>}
        </Card>
      </div>
    </div>
  );
}

export default Assets;
