import React, { useContext } from 'react';
import DownOutlined from '@ant-design/icons/DownOutlined';
import { useHistory } from 'react-router-dom';
import Avatar from 'antd/es/avatar';
import Dropdown from 'antd/es/dropdown';
import Flex from 'antd/es/flex';
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from 'react-oauth2-code-pkce';
import UserIcon from '../../assets/icons/user.svg';
import { userSelectors } from '../../redux/selectors';
import { authActions } from '../../redux/actions';
import Button from '../Button/Button';
import styles from './styles.module.scss';
import useLogin from '../../hooks/useLogin';

function UserMenu() {
  const { logOut } = useContext(AuthContext);
  const login = useLogin();
  const history = useHistory();
  const user = useSelector(userSelectors.selectUser);
  const dispatch = useDispatch();

  const logoutAction = {
    key: 'logout',
    label: 'Logout',
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
        items: [
          logoutAction,
        ],
        onClick: ({ key }) => {
          switch (key) {
            case logoutAction.key:
              logOut();
              dispatch(authActions.signOut.call(history));
              window.location.href = `${
                process.env.REACT_APP_SSO_API}/logout?redirect=${process.env.REACT_APP_FRONTEND_REDIRECT}`;
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
