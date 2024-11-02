import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { senateActions } from '../../../redux/actions';
import { senateSelectors } from '../../../redux/selectors';
import Card from '../../Card';
import stylesPage from '../../../utils/pagesBase.module.scss';
import Button from '../../Button/Button';
import {
  groupProposals,
  proposalHeading,
  isTableReady,
  unBatchProposals,
} from '../../Proposal/utils';
import { MotionProvider } from '../../WalletCongresSenate/ContextMotions';
import ProposalTable from '../../Proposal/ProposalTable';
import styles from './styles.module.scss';
import { Proposal } from '../../Proposal';

function ScheduledCongressSpending({ isVetoButton }) {
  const dispatch = useDispatch();
  const scheduledCalls = useSelector(senateSelectors.scheduledCalls);

  useEffect(() => {
    dispatch(senateActions.senateGetCongressSpending.call());
  }, [dispatch]);

  const congressOnly = React.useMemo(
    () => unBatchProposals(
      scheduledCalls?.filter(({ sectionType }) => sectionType === 'congress') || [],
      (prop) => prop.proposal.toHuman(),
    ),
    [scheduledCalls],
  );

  const grouped = React.useMemo(() => groupProposals(
    congressOnly,
    (proposal) => proposal.proposal.toHuman(),
  ), [congressOnly]);

  if (!congressOnly.length) {
    return (<div>There are no open items</div>);
  }

  return (
    <MotionProvider>
      {Object.values(grouped).map((props) => Object.values(props).map((proposals) => (
        <Card key={proposals[0]} title={proposalHeading(proposals[0])} className={stylesPage.overviewWrapper}>
          {isTableReady(proposals[0]) ? (
            <ProposalTable
              proposals={proposals.map(({ preimage, proposal }) => preimage || proposal)}
              controls={proposals.map(({
                blockNumber,
                idx,
              }) => {
                const onVetoClick = () => {
                  dispatch(senateActions.senateProposeCloseMotion.call(
                    { executionBlock: blockNumber, idx },
                  ));
                };
                return isVetoButton ? (
                  <div className={styles.button}>
                    <Button onClick={onVetoClick} primary small>Veto</Button>
                  </div>
                ) : null;
              })}
            />
          ) : proposals.map(({ preimage, proposal }) => (
            <Proposal proposal={preimage || proposal} key={proposal} />
          ))}
        </Card>
      )))}
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
