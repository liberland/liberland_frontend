import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { senateActions } from '../../../redux/actions';
import { senateSelectors } from '../../../redux/selectors';
import { Proposal } from '../../Proposal';
import Card from '../../Card';
import stylesPage from '../../../utils/pagesBase.module.scss';
import Button from '../../Button/Button';
import styles from './styles.module.scss';

function ScheduledCongressSpending({ isVetoButton }) {
  const dispatch = useDispatch();
  const scheduledCalls = useSelector(senateSelectors.scheduledCalls);

  useEffect(() => {
    dispatch(senateActions.senateGetCongressSpending.call());
  }, [dispatch]);

  const { preimagesInside, lookupItemsData } = scheduledCalls;

  if (!scheduledCalls || (preimagesInside.length < 1 && lookupItemsData.length < 1)) {
    return (<div>There is no any item</div>);
  }
  const scheduledCallsList = [...preimagesInside, ...lookupItemsData];

  return (
    <>
      {scheduledCallsList.map(({
        preimage, proposal, blockNumber, idx,
      }) => {
        const proposalData = preimage || proposal;
        const onVetoClick = () => {
          dispatch(senateActions.senateProposeCloseMotion.call(
            { executionBlock: blockNumber, idx },
          ));
        };
        return (
          <Card className={stylesPage.overviewWrapper} key={proposalData}>
            {isVetoButton && (
            <div className={styles.button}>
              <Button onClick={onVetoClick} primary small>Veto</Button>
            </div>
            )}

            <Proposal
              proposal={proposalData}
            />
          </Card>
        );
      })}
    </>

  );
}

ScheduledCongressSpending.defaultProps = {
  isVetoButton: false,
};

ScheduledCongressSpending.propTypes = {
  isVetoButton: PropTypes.bool,
};

export default ScheduledCongressSpending;
