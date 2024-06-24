import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import CongressHeader from './CongressHeader';
import stylesPage from '../../utils/pagesBase.module.scss';
import Overview from './Overview';
import Motions from './Motions';
import router from '../../router';
import Treasury from './Treasury';
import Wallet from './Wallet';
// eslint-disable-next-line max-len
import { CongressAddLegislation } from '../Voting/Referendum/ProposalForms/CongressAddLegislation/CongressAddLegislation';
// eslint-disable-next-line max-len
import { CongressAddLegislationViaReferendum } from '../Voting/Referendum/ProposalForms/CongressAddLegislationViaReferendum/CongressAddLegislationViaReferendum';

function Congress() {
  return (
    <div className={stylesPage.sectionWrapper}>
      <div className={stylesPage.menuAddressWrapper}>
        <CongressHeader />
      </div>
      <div className={stylesPage.contentWrapper}>
        <Switch>
          <Route exact path={router.congress.overview} component={Overview} />
          <Route exact path={router.congress.motions} component={Motions} />
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
      </div>
    </div>
  );
}

export default Congress;
