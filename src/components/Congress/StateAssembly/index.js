import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Spin from 'antd/es/spin';
import {
  congressSelectors, senateSelectors, walletSelectors,
} from '../../../redux/selectors';
import { congressActions, senateActions, identityActions } from '../../../redux/actions';
import { formatMerits } from '../../../utils/walletHelpers';
import Motion from '../../WalletCongresSenate/Motion';
import { MotionProvider } from '../../WalletCongresSenate/ContextMotions';
import Button from '../../Button/Button';
import router from '../../../router';
import styles from './styles.module.scss';

/*
 * Congress & Senate, as the Liberland State design language draws it: the two
 * chambers side by side — the motions Congress is voting on, and what the
 * Senate has under review — with the citizen's own political weight beneath.
 *
 * The design puts on one screen what the application keeps on three routes.
 * Nothing is moved: those routes still exist and still work. This is the
 * overview the design asked for, assembled from the same selectors, with the
 * voting itself left to the Motion component the Ledger uses.
 */

function Column({
  label, tone, motions, userIsMember, onVote, onClose, emptyText, action,
}) {
  return (
    <section className={styles.column}>
      <div className={styles.columnHead}>
        <span className={`${styles.dash} ${tone}`} aria-hidden="true" />
        <h2 className={styles.columnTitle}>{label}</h2>
        {action}
      </div>
      {motions === undefined ? <Spin /> : null}
      {motions && motions.length === 0 ? (
        <p className={styles.empty}>{emptyText}</p>
      ) : null}
      {motions && motions.length > 0 ? (
        <div className={styles.motions}>
          {motions.map(({
            proposal, proposalOf, voting, membersCount,
          }) => (
            <Motion
              key={proposal.toString()}
              userIsMember={userIsMember}
              membersCount={membersCount}
              proposal={proposal.toString()}
              proposalOf={proposalOf.unwrap()}
              voting={voting.unwrap()}
              voteMotion={onVote}
              closeMotion={onClose}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

/* eslint-disable react/forbid-prop-types */
Column.propTypes = {
  label: PropTypes.string.isRequired,
  tone: PropTypes.string.isRequired,
  motions: PropTypes.array,
  userIsMember: PropTypes.bool,
  onVote: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  emptyText: PropTypes.string.isRequired,
  action: PropTypes.node,
};

export default function StateAssembly() {
  const dispatch = useDispatch();
  const history = useHistory();

  const congressMotions = useSelector(congressSelectors.motions);
  const congressIsMember = useSelector(congressSelectors.userIsMember);
  const senateMotions = useSelector(senateSelectors.motions);
  const senateIsMember = useSelector(senateSelectors.userIsMember);
  const balances = useSelector(walletSelectors.selectorBalances);
  const pooled = balances?.liberstake?.amount;

  useEffect(() => {
    dispatch(congressActions.getMotions.call());
    dispatch(congressActions.getMembers.call());
    dispatch(senateActions.senateGetMotions.call());
    dispatch(senateActions.senateGetMembers.call());
  }, [dispatch]);

  useEffect(() => {
    const addresses = (congressMotions || []).concat(senateMotions || [])
      .flatMap((item) => item.votes || []);
    if (addresses.length) {
      dispatch(identityActions.getIdentityMotions.call(Array.from(new Set(addresses))));
    }
  }, [congressMotions, senateMotions, dispatch]);

  return (
    <MotionProvider>
      <div className={styles.assembly}>
        <Column
          label="Congress motions"
          tone={styles.dashAssembly}
          motions={congressMotions}
          userIsMember={congressIsMember}
          onVote={(data) => congressActions.voteAtMotions.call(data)}
          onClose={(data) => congressActions.closeMotion.call(data)}
          emptyText="No motions are open before Congress."
          action={(
            <Button
              small
              className={styles.columnAction}
              onClick={() => history.push(router.congress.motions)}
            >
              All motions
            </Button>
          )}
        />

        <div className={styles.side}>
          <Column
            label="Senate review"
            tone={styles.dashRegistry}
            motions={senateMotions}
            userIsMember={senateIsMember}
            onVote={(data) => senateActions.senateVoteAtMotions.call(data)}
            onClose={(data) => senateActions.senateCloseMotion.call(data)}
            emptyText="Nothing is before the Senate."
          />

          <aside className={styles.weight}>
            <div className={styles.weightLabel}>Your political weight</div>
            <div className={styles.weightRow}>
              <span className={styles.weightValue}>
                {pooled != null ? formatMerits(pooled) : '—'}
              </span>
              <span className={styles.weightUnit}>LLM pooled</span>
            </div>
            <p className={styles.weightNote}>
              Politipooled merits carry your vote in referenda. Unpooling takes a
              full era to settle.
            </p>
          </aside>
        </div>
      </div>
    </MotionProvider>
  );
}
