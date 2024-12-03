import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import router from '../../router';
import { congressActions } from '../../redux/actions';
import { MotionProvider } from '../WalletCongresSenate/ContextMotions';
import { loaderFactory } from '../../utils/loader';

const loader = loaderFactory(__dirname);

function MotionsWrapper() {
  return (
    <MotionProvider>
      {loader('./Motions')}
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
      <Route exact path={router.congress.overview} component={loader('./Overview')} />
      <Route exact path={router.congress.motions} component={MotionsWrapper} />
      <Route exact path={router.congress.treasury} component={loader('./Treasury')} />
      <Route exact path={router.congress.wallet} component={loader('./Wallet')} />
      <Route
        exact
        path={router.congress.addLegislation}
        component={loader('../Voting/Referendum/ProposalForms/CongressAddLegislation/CongressAddLegislation')}
      />
      <Route
        exact
        path={router.congress.addLegislationViaReferendum}
        component={loader(
          '../Voting/Referendum/ProposalForms/CongressAddLegislationViaReferendum/CongressAddLegislationViaReferendum',
        )}
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
