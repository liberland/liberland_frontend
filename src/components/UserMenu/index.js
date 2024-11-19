import React from 'react';
import DownOutlined from '@ant-design/icons/DownOutlined';
import { useHistory } from 'react-router-dom';
import { useMediaQuery } from 'usehooks-ts';
import Avatar from 'antd/es/avatar';
import Dropdown from 'antd/es/dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from 'react-oauth2-code-pkce';
import UserIcon from '../../assets/icons/user.svg';
import { userSelectors } from '../../redux/selectors';
import { authActions } from '../../redux/actions';
import ChangeWallet from '../Home/ChangeWallet';
import styles from './styles.module.scss';

function UserMenu() {
  const { logOut, login } = React.useContext(AuthContext);
  const history = useHistory();
  const user = useSelector(userSelectors.selectUser);
  const dispatch = useDispatch();
  const isBiggerThanSmallScreen = useMediaQuery('(min-width: 576px)');

  const logAction = user ? {
    key: 'logout',
    label: 'Logout',
  } : {
    key: 'login',
    label: 'Login',
  };

  return (
    <Dropdown
      menu={{
        items: [
          logAction,
        ].concat(isBiggerThanSmallScreen ? [] : [{
          key: 'wallets',
          label: <ChangeWallet />,
        }]),
        onClick: ({ key }) => {
          if (key === 'login') {
            login();
          } else if (key === 'logout') {
            logOut();
            dispatch(authActions.signOut.call(history));
            window.location.href = `${
              process.env.REACT_APP_SSO_API}/logout?redirect=${process.env.REACT_APP_FRONTEND_REDIRECT}`;
          }
        },
      }}
      trigger={['click']}
    >
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a href="#" onClick={(e) => e.preventDefault()} className={styles.dropdownLink}>
        <Avatar src={UserIcon} size={30} className={styles.avatar} />
        <DownOutlined />
      </a>
    </Dropdown>
  );
}

export default UserMenu;
