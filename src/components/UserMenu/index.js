import React, { useContext } from 'react';
import DownOutlined from '@ant-design/icons/DownOutlined';
import { useHistory } from 'react-router-dom';
import { useMediaQuery } from 'usehooks-ts';
import Avatar from 'antd/es/avatar';
import Dropdown from 'antd/es/dropdown';
import Flex from 'antd/es/flex';
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from 'react-oauth2-code-pkce';
import UserIcon from '../../assets/icons/user.svg';
import { blockchainSelectors, userSelectors } from '../../redux/selectors';
import { authActions, blockchainActions, validatorActions } from '../../redux/actions';
import Button from '../Button/Button';
import ChangeWallet from '../Home/ChangeWallet';
import styles from './styles.module.scss';

function UserMenu() {
  const { logOut, login } = useContext(AuthContext);
  const history = useHistory();
  const user = useSelector(userSelectors.selectUser);
  const walletAddress = useSelector(userSelectors.selectWalletAddress);
  const dispatch = useDispatch();
  const isBiggerThanSmallScreen = useMediaQuery('(min-width: 576px)');
  const isWalletAdressSame = useSelector(
    blockchainSelectors.isUserWalletAddressSameAsUserAdress,
  );

  const switchToRegisteredWallet = () => {
    dispatch(blockchainActions.setUserWallet.success(walletAddress));
    dispatch(validatorActions.getInfo.call());
    localStorage.removeItem('BlockchainAdress');
  };

  const logoutAction = {
    key: 'logout',
    label: 'Logout',
  };

  const switchToRegisteredAction = {
    key: 'registered',
    label: 'Switch to registered wallet',
  };

  if (!user) {
    return (
      <Flex wrap gap="15px" justify="center" align="center">
        <Button primary onClick={login}>
          Login
        </Button>
      </Flex>
    );
  }

  return (
    <Dropdown
      menu={{
        items: (user && !isWalletAdressSame ? [switchToRegisteredAction] : [])
          .concat([
            logoutAction,
          ]).concat(isBiggerThanSmallScreen ? [] : [{
            key: 'wallets',
            label: <ChangeWallet />,
          }]),
        onClick: ({ key }) => {
          switch (key) {
            case logoutAction.key:
              logOut();
              dispatch(authActions.signOut.call(history));
              window.location.href = `${
                process.env.REACT_APP_SSO_API}/logout?redirect=${process.env.REACT_APP_FRONTEND_REDIRECT}`;
              break;
            case switchToRegisteredAction.key:
              switchToRegisteredWallet();
              break;
            default:
              break;
          }
        },
      }}
      trigger={['click']}
    >
      <Button link className={styles.dropdownLink}>
        <Avatar src={UserIcon} size={30} className={styles.avatar} />
        <DownOutlined />
      </Button>
    </Dropdown>
  );
}

export default UserMenu;
