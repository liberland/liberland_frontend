import React, { useEffect } from 'react';
import {
  Switch, Route, Redirect,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { votingActions } from '../../redux/actions';

import VotingHeader from './VotingHeader';
import RoleHOC from '../../hocs/RoleHOC';
import router from '../../router';

import CongressionalAssemble from './CongressionalAssemble';
import styles from './styles.module.scss';
import Referendum from './Referendum';
import { AddLegislation } from './Referendum/ProposalForms/AddLegislation/AddLegislation';

function Voting() {
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
            path={router.voting.referendum}
            component={Referendum}
          />
          <Route
            path={router.voting.addLegislation}
            component={AddLegislation}
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
}

export default Voting;
