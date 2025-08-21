import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'usehooks-ts';
import Spin from 'antd/es/spin';
import { officesSelectors } from '../../../redux/selectors';
import { officesActions } from '../../../redux/actions';
import TopHoldersTable from './TopHoldersTable';
import TopHoldersList from './TopHoldersList';
import { enhanceTopHolders } from './utils';

function TopHolders() {
  const isDesktop = useMediaQuery('(min-width: 1200px)');
  const topHolders = useSelector(officesSelectors.selectorTopHolders);
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(officesActions.getTopHolders.call());
  }, [dispatch]);

  if (!topHolders) {
    return <Spin />;
  }

  const enhanced = enhanceTopHolders(topHolders);

  return isDesktop ? (
    <TopHoldersTable holders={enhanced} />
  ) : (
    <TopHoldersList holders={enhanced} />
  );
}

export default TopHolders;
