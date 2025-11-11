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
        path={router.voting.congressionalAssembly}
        component={loader(() => import('./CongressionalAssembly'))}
      />
      <Route
        exact
        path={router.voting.candidates}
        component={loader(() => import('./CongressionalAssembly/Candidates'))}
      />
      <Route
        exact
        path={router.voting.information}
        component={loader(() => import('./CongressionalAssembly/Information'))}
      />
      <Route
        path={router.voting.proposalItem}
        component={loader(() => import('./Referendum/Items/ProposalPage'))}
      />
      <Route
        path={router.voting.referendum}
        exact
        component={ReferendumWrapper}
      />
      <Route
        path={router.voting.referendumItem}
        component={loader(() => import('./Referendum/Items/ReferendumPage'))}
      />
      <Route
        path={router.voting.dispatchItem}
        component={loader(() => import('./Referendum/Items/DispatchPage'))}
      />
      <Route
        path={router.voting.addLegislation}
        component={loader(() => import('./Referendum/ProposalForms/AddLegislation/AddLegislation'))}
      />
      <Route
        exact
        path={router.home.voting}
        render={() => (
          <Redirect to={router.voting.congressionalAssembly} />
        )}
      />
    </Switch>
  );
}

export default Voting;
