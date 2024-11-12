import React, { useEffect } from 'react';
import cx from 'classnames';
import styles from '../../utils/pagesBase.module.scss';
import stylesStacking from './styles.module.scss';
import StakingHeader from "./StakingHeader";
import {Redirect, Route, Switch} from "react-router-dom";
import router from "../../router";
import RoleHOC from "../../hocs/RoleHOC";
import StakingOverview from "./Overview";
import ETHLPStaking from "./ETHLPStaking";
import stylesPage from "../../utils/pagesBase.module.scss";

export default function Staking() {


  return (
    <div className={styles.sectionWrapper}>
      <div className={stylesPage.menuAddressWrapper}>
        <StakingHeader />
      </div>
      <div className={cx(styles.contentWrapper, stylesStacking.contentWrapper)}>
        <div>
          <Switch>
            <Route
              path={router.staking.overview}
              component={StakingOverview}
            />
            <Route
              path={router.staking.ethlpstaking}
              component={ETHLPStaking}
            />
            <Route
              exact
              path={router.home.staking}
              render={() => (
                <RoleHOC>
                  <Redirect to={router.staking.overview} />
                </RoleHOC>
              )}
            />
          </Switch>
        </div>

      </div>
    </div>
  );
}
