import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { identityActions, senateActions } from '../../../redux/actions';
import { senateSelectors } from '../../../redux/selectors';
import { Proposal } from '../../Proposal';
import Card from '../../Card';
import stylesPage from '../../../utils/pagesBase.module.scss';
import Button from '../../Button/Button';
import styles from './styles.module.scss';
import ProposalContainer from '../../Proposal/ProposalContainer';
import { useMotionContext } from '../../WalletCongresSenate/ContextMotions';

function ScheduledCongressSpending({ isVetoButton }) {
  const dispatch = useDispatch();
  const scheduledCalls = useSelector(senateSelectors.scheduledCalls);
  const userIsMember = useSelector(senateSelectors.userIsMember);

  useEffect(() => {
    dispatch(senateActions.senateGetCongressSpending.call());
  }, [dispatch]);

  const { motionIds } = useMotionContext();
  const divRef = useRef(null);

  useEffect(() => {
    if (divRef.current) {
      const votes = scheduledCalls.map((item) => item.votes);
      dispatch(identityActions.getIdentityMotions.call(Array.from(new Set(motionIds.concat(votes.flat())))));
    }
  }, [motionIds, dispatch, scheduledCalls]);

  if (!scheduledCalls || scheduledCalls.length < 1) {
    return (<div>There are no open items</div>);
  }

  return (
    <ProposalContainer>
      {scheduledCalls.map(({
        preimage, proposal, blockNumber, idx, sectionType,
      }, index) => {
        const proposalData = preimage || proposal;
        if (sectionType !== 'congress') return null;

        const onVetoClick = () => {
          dispatch(senateActions.senateProposeCloseMotion.call(
            { executionBlock: blockNumber, idx },
          ));
        };
        const isLastItem = scheduledCalls.length - 1 === index;
        return (
          <div ref={isLastItem ? divRef : null} key={proposalData}>
            <Card className={stylesPage.overviewWrapper}>
              {isVetoButton && userIsMember && (
                <div className={styles.button}>
                  <Button onClick={onVetoClick} primary small>Veto</Button>
                </div>
              )}

              <Proposal
                proposal={proposalData}
                isTableRow
              />
            </Card>
          </div>
        );
      })}
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
