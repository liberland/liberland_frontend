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
import { votingSelectors } from '../../redux/selectors';
import Referendum from './Referendum';

const Voting = () => {
  const location = useLocation();

  const dispatch = useDispatch();

  useEffect(() => {
    const timerId = setInterval(() => {
      dispatch(votingActions.getAssembliesList.call());
    }, 6000);
    return (() => {
      clearInterval(timerId);
    });
  }, [dispatch]);

  return (
    <div className={styles.votingWrapper}>
      <div className={styles.navWrapper}>
        <VotingHeader />
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
            path={router.voting.referendum}
            component={Referendum}
          />
          <Route
            path={router.voting.election}
            component={() => <div>Election</div>}
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
