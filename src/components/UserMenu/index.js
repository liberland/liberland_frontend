import React from 'react';
import { useHistory } from 'react-router-dom';
import { useMediaQuery } from 'usehooks-ts';
import Avatar from 'antd/es/avatar';
import Dropdown from 'antd/es/dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from 'react-oauth2-code-pkce';
import { userSelectors } from '../../redux/selectors';
import { authActions } from '../../redux/actions';
import ChangeWallet from '../Home/ChangeWallet';

function UserMenu() {
  const { logOut, login } = React.useContext(AuthContext);
  const history = useHistory();
  const user = useSelector(userSelectors.selectUser);
  const dispatch = useDispatch();
  const isBiggerThanSmallScreen = useMediaQuery('(min-width: 576px)');

  const logAction = user ? {
    key: 'logout',
    label: 'Logout',
    onSelect: () => {
      logOut();
      dispatch(authActions.signOut.call(history));
      window.location.href = `
      ${process.env.REACT_APP_SSO_API}/logout?redirect=${process.env.REACT_APP_FRONTEND_REDIRECT}`;
    },
  } : {
    key: 'login',
    label: 'Login',
    onSelect: () => {
      login();
    },
  };

  return (
    <Dropdown
      menu={[
        logAction,
      ].concat(isBiggerThanSmallScreen ? [] : [{
        key: 'wallets',
        label: <ChangeWallet />,
      }])}
      trigger={['click']}
    >
      <Avatar />
    </Dropdown>
  );
}

export default UserMenu;
