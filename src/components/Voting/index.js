import React, { useEffect } from 'react';
import {
  Switch, Route, Redirect, useLocation,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { votingActions } from '../../redux/actions';

import VotingHeader from './VotingHeader';
import RoleHOC from '../../hocs/RoleHOC';
import router from '../../router';

import CongressionalAssemble from './CongressionalAssemble';
import styles from './styles.module.scss';
import CongressionalAssemblyElectionsHeader from './CongressionalAssemblyElectionsHeader';
import CurrentCongressionalAssemble from './CurrentCongressionalAssemble';
import { votingSelectors } from '../../redux/selectors';

const Voting = () => {
  const location = useLocation();
  const param = location.pathname.split('/').pop();

  const dispath = useDispatch();

  const handlerOnClickApplyMyCandidacy = () => {
    dispath(votingActions.addMyCandidacy.call());
  };
  const isVotingInProgress = useSelector(votingSelectors.selectorIsVotingInProgress);

  useEffect(() => {
    dispath(votingActions.getPeriodAndVotingDuration.call());
  }, [dispath]);

  useEffect(() => {
    const timerId = setInterval(() => {
      dispath(votingActions.getMinistersList.call());
    }, 6000);
    return (() => {
      clearInterval(timerId);
    });
  }, [dispath, isVotingInProgress]);

  return (
    <div className={styles.votingWrapper}>
      <div className={styles.navWrapper}>
        {
          Number(param)
            ? (
              <CongressionalAssemblyElectionsHeader
                handlerOnClickApplyMyCandidacy={handlerOnClickApplyMyCandidacy}
              />
            )
            : <VotingHeader />
        }
      </div>

      <div>
        <Switch>
          <Route
            exact
            path={router.voting.congressionalAssemble}
            component={CongressionalAssemble}
          />
          <Route
            path={router.voting.vetoVotes}
            component={() => <div>Veto votes</div>}
          />
          <Route
            path={router.voting.voteHistory}
            component={() => <div>Vote history</div>}
          />

          <Route
            path={router.voting.currentCongressional}
            component={CurrentCongressionalAssemble}
          />
          <Route
            exact
            path={router.home.voting}
            render={() => (
              <RoleHOC>
                <Redirect to={router.voting.congressionalAssemble} />
              </RoleHOC>
            )}
          />
        </Switch>
      </div>
    </div>
  );
};

export default Voting;
