import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DownOutlined from '@ant-design/icons/DownOutlined';
import { useHistory } from 'react-router-dom';
import { useMediaQuery } from 'usehooks-ts';
import Avatar from 'antd/es/avatar';
import Dropdown from 'antd/es/dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from 'react-oauth2-code-pkce';
import UserIcon from '../../assets/icons/user.svg';
import { blockchainSelectors, userSelectors } from '../../redux/selectors';
import { authActions, blockchainActions, validatorActions } from '../../redux/actions';
import ChangeWallet from '../Home/ChangeWallet';
import { GetCitizenshipModal } from '../Modals';
import styles from './styles.module.scss';

function UserMenu({
  isEResident,
}) {
  const { logOut, login } = React.useContext(AuthContext);
  const history = useHistory();
  const user = useSelector(userSelectors.selectUser);
  const walletAddress = useSelector(userSelectors.selectWalletAddress);
  const dispatch = useDispatch();
  const isBiggerThanSmallScreen = useMediaQuery('(min-width: 576px)');
  const [isCitizenshipModalOpen, setCitizenshipModalOpen] = useState();
  const isWalletAdressSame = useSelector(
    blockchainSelectors.isUserWalletAddressSameAsUserAdress,
  );

  const switchToRegisteredWallet = () => {
    dispatch(blockchainActions.setUserWallet.success(walletAddress));
    dispatch(validatorActions.getInfo.call());
    localStorage.removeItem('BlockchainAdress');
  };

  const logAction = user ? {
    key: 'logout',
    label: 'Logout',
  } : {
    key: 'login',
    label: 'Login',
  };

  const eResidentAction = {
    key: 'eresident',
    label: 'Get a Liberland Citizenship!',
  };

  const switchToRegisteredAction = {
    key: 'registered',
    label: 'Switch to registered wallet',
  };

  return (
    <>
      <Dropdown
        menu={{
          items: [
            logAction,
          ].concat(isBiggerThanSmallScreen ? [] : [{
            key: 'wallets',
            label: <ChangeWallet />,
          }]).concat(
            isEResident ? [eResidentAction] : [],
          ).concat(
            user && !isWalletAdressSame ? [switchToRegisteredAction] : [],
          ),
          onClick: ({ key }) => {
            if (key === 'login') {
              login();
            } else if (key === 'logout') {
              logOut();
              dispatch(authActions.signOut.call(history));
              window.location.href = `${
                process.env.REACT_APP_SSO_API}/logout?redirect=${process.env.REACT_APP_FRONTEND_REDIRECT}`;
            } else if (key === 'eresident') {
              setCitizenshipModalOpen(true);
            } else if (key === 'registered') {
              switchToRegisteredWallet();
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
      {isCitizenshipModalOpen && (
        <GetCitizenshipModal closeModal={() => setCitizenshipModalOpen(false)} />
      )}
    </>
  );
}

UserMenu.propTypes = {
  isEResident: PropTypes.bool,
};

export default UserMenu;
