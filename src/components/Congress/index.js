import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Overview from './Overview';
import Motions from './Motions';
import router from '../../router';
import Treasury from './Treasury';
import Wallet from './Wallet';
// eslint-disable-next-line max-len
import { CongressAddLegislation } from '../Voting/Referendum/ProposalForms/CongressAddLegislation/CongressAddLegislation';
// eslint-disable-next-line max-len
import { CongressAddLegislationViaReferendum } from '../Voting/Referendum/ProposalForms/CongressAddLegislationViaReferendum/CongressAddLegislationViaReferendum';
import { congressActions } from '../../redux/actions';
import { MotionProvider } from '../WalletCongresSenate/ContextMotions';

function MotionsWrapper() {
  return (
    <MotionProvider>
      <Motions />
    </MotionProvider>
  );
}

function Congress() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(congressActions.congressGetWallet.call());
  }, [dispatch]);

  return (
    <Switch>
      <Route exact path={router.congress.overview} component={Overview} />
      <Route exact path={router.congress.motions} component={MotionsWrapper} />
      <Route exact path={router.congress.treasury} component={Treasury} />
      <Route exact path={router.congress.wallet} component={Wallet} />
      <Route exact path={router.congress.addLegislation} component={CongressAddLegislation} />
      <Route
        exact
        path={router.congress.addLegislationViaReferendum}
        component={CongressAddLegislationViaReferendum}
      />
      <Route
        exact
        path={router.home.congress}
        render={() => (
          <Redirect to={router.congress.overview} />
        )}
      />
    </Switch>
  );
}

export default Congress;
