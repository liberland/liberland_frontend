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
import { useMotionContext } from '../../WalletCongresSenate/ContextMotions';

function ScheduledCongressSpending({ isVetoButton }) {
  const dispatch = useDispatch();
  const scheduledCalls = useSelector(senateSelectors.scheduledCalls);

  useEffect(() => {
    dispatch(senateActions.senateGetCongressSpending.call());
  }, [dispatch]);

  const { motionIds } = useMotionContext();
  const divRef = useRef(null);

  useEffect(() => {
    if (divRef.current) {
      dispatch(identityActions.getIdentityMotions.call(Array.from(new Set(motionIds))));
    }
  }, [motionIds, dispatch]);

  if (!scheduledCalls || scheduledCalls.length < 1) {
    return (<div>There are no open items</div>);
  }

  return (
    <>
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
        return (
          <Card
            className={stylesPage.overviewWrapper}
            key={proposalData}
            ref={scheduledCalls.length - 1 === index ? divRef : null}
          >
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
