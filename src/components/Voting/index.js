import React from 'react';
import {
  Switch, Route, Redirect,
} from 'react-router-dom';

import router from '../../router';
import { MotionProvider } from '../WalletCongresSenate/ContextMotions';
import { loader } from '../../utils/loader';

function ReferendumWrapper() {
  const Referendum = loader(() => import('./Referendum'));
  return (
    <MotionProvider>
      <Referendum />
    </MotionProvider>
  );
}

function Voting() {
  return (
    <Switch>
      <Route
        exact
        path={router.voting.congressionalAssemble}
        component={loader(() => import('./CongressionalAssemble'))}
      />
      <Route
        path={router.voting.proposalItem}
        component={loader(() => import('./Referendum/Items/ProposalPage'))}
      />
      <Route
        path={router.voting.referendum}
        component={ReferendumWrapper}
      />
      <Route
        path={router.voting.addLegislation}
        component={loader(() => import('./Referendum/ProposalForms/AddLegislation/AddLegislation'))}
      />
      <Route
        exact
        path={router.home.voting}
        render={() => (
          <Redirect to={router.voting.congressionalAssemble} />
        )}
      />
    </Switch>
  );
}

export default Voting;
