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
import { MotionProvider } from '../../WalletCongresSenate/ContextMotions';
import ProposalContainer from '../../Proposal/ProposalContainer';

function ScheduledCongressSpending({ isVetoButton }) {
  const dispatch = useDispatch();
  const scheduledCalls = useSelector(senateSelectors.scheduledCalls);

  useEffect(() => {
    dispatch(senateActions.senateGetCongressSpending.call());
  }, [dispatch]);

  if (!scheduledCalls || scheduledCalls.length < 1) {
    return (<div>There are no open items</div>);
  }

  return (
    <ProposalContainer>
      <MotionProvider>
        {scheduledCalls.map(({
          preimage, proposal, blockNumber, idx, sectionType,
        }) => {
          const proposalData = preimage || proposal;
          if (sectionType !== 'congress') return null;

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
                isTableRow
              />
            </Card>
          );
        })}
      </MotionProvider>
    </ProposalContainer>
  );
}

ScheduledCongressSpending.defaultProps = {
  isVetoButton: false,
};

ScheduledCongressSpending.propTypes = {
  isVetoButton: PropTypes.bool,
};

export default ScheduledCongressSpending;
