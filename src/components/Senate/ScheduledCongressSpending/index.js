import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { senateActions } from '../../../redux/actions';
import { senateSelectors } from '../../../redux/selectors';
import Card from '../../Card';
import stylesPage from '../../../utils/pagesBase.module.scss';
import Button from '../../Button/Button';
import styles from './styles.module.scss';
import { MotionProvider } from '../../WalletCongresSenate/ContextMotions';
import RemarkTable from '../../Proposal/RemarkTable';

function ScheduledCongressSpending({ isVetoButton }) {
  const dispatch = useDispatch();
  const scheduledCalls = useSelector(senateSelectors.scheduledCalls);

  useEffect(() => {
    dispatch(senateActions.senateGetCongressSpending.call());
  }, [dispatch]);

  const tableData = React.useMemo(() => scheduledCalls?.map(({
    preimage,
    proposal,
    blockNumber,
    idx,
    sectionType,
  }) => {
    const proposalData = preimage || proposal;
    if (sectionType !== 'congress') {
      return undefined;
    }
    const onVetoClick = () => {
      dispatch(senateActions.senateProposeCloseMotion.call(
        { executionBlock: blockNumber, idx },
      ));
    };
    return {
      proposal: proposalData,
      veto: isVetoButton ? (
        <div className={styles.button}>
          <Button onClick={onVetoClick} primary small>Veto</Button>
        </div>
      ) : null,
    };
  }).filter(Boolean), [isVetoButton, dispatch, scheduledCalls]);

  if (!scheduledCalls || scheduledCalls.length < 1) {
    return (<div>There are no open items</div>);
  }

  return (
    <MotionProvider>
      <Card className={stylesPage.overviewWrapper}>
        <RemarkTable
          data={tableData.map((row) => ({
            proposal: row.proposal,
            extra: row.veto,
          }))}
        />
      </Card>
    </MotionProvider>

  );
}

ScheduledCongressSpending.defaultProps = {
  isVetoButton: false,
};

ScheduledCongressSpending.propTypes = {
  isVetoButton: PropTypes.bool,
};

export default ScheduledCongressSpending;
