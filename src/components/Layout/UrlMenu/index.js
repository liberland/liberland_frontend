import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Menu from 'antd/es/menu';
import Flex from 'antd/es/flex';
import MenuIcon from '@ant-design/icons/MenuOutlined';
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'usehooks-ts';
import styles from '../styles.module.scss';
import { useNavigationList } from '../hooks';
import { navigationList } from '../../../constants/navigationList';
import { blockchainSelectors, userSelectors } from '../../../redux/selectors';
import { blockchainActions, validatorActions } from '../../../redux/actions';
import Button from '../../Button/Button';
import ChangeWallet from '../../Home/ChangeWallet';
import truncate from '../../../utils/truncate';
import ModeSwitch from '../../ModeSwitch';
import GetLLDWrapper from '../../GetLLDWrapper';

function UrlMenu({
  onClose,
}) {
  const isBiggerThanDesktop = useMediaQuery('(min-width: 992px)');
  const isBiggerThanSmallScreen = useMediaQuery('(min-width: 768px)');
  const dispatch = useDispatch();
  const user = useSelector(userSelectors.selectUser);
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const isWalletAdressSame = useSelector(
    blockchainSelectors.isUserWalletAddressSameAsUserAdress,
  );
  const walletAddress = useSelector(userSelectors.selectWalletAddress);
  const hasSwitchWallet = user && !isWalletAdressSame;
  const switchToRegisteredWallet = () => {
    dispatch(blockchainActions.setUserWallet.success(walletAddress));
    dispatch(validatorActions.getInfo.call());
    localStorage.removeItem('BlockchainAdress');
    if (!isBiggerThanSmallScreen) {
      onClose?.();
    }
  };

  const { pathname } = useLocation();
  const history = useHistory();
  const navigate = (route) => {
    history.push(route);
    onClose?.();
  };
  const getMenuKey = () => {
    if (isBiggerThanDesktop) {
      return 'large';
    }
    if (isBiggerThanSmallScreen) {
      return 'desktop';
    }
    return 'small';
  };
  const { matchedSubLink } = useNavigationList();
  const openKeys = React.useMemo(() => {
    const matchOpen = matchedSubLink;
    return {
      citizen: true,
      state: true,
      [matchOpen ? matchOpen.route : pathname]: true,
    };
  }, [matchedSubLink, pathname]);
  const createMenu = (navigation) => {
    const subs = Object.entries(navigation.subLinks).map(([name, link]) => ({
      label: <div className={styles.navigationTitle}>{truncate(name, 22)}</div>,
      key: link,
      onClick: () => navigate(link),
    }));
    const Icon = navigation.icon;
    const icon = <Icon className={styles.icon} />;
    const label = (
      <span className={classNames(styles.navigationTitle, { [styles.discouraged]: navigation.isDiscouraged })}>
        {navigation.title}
      </span>
    );
    if (isBiggerThanSmallScreen) {
      return {
        icon,
        label,
        key: navigation.route,
        onClick: subs.length ? undefined : () => navigate(navigation.route),
        onTitleClick: !subs.length ? undefined : () => navigate(navigation.route),
        children: subs.length ? subs : undefined,
      };
    }
    return {
      icon,
      label,
      key: navigation.route,
      children: subs.length ? subs : undefined,
      onClick: subs.length ? undefined : () => navigate(navigation.route),
    };
  };

  const getLLD = userWalletAddress ? [] : [{
    label: <GetLLDWrapper />,
    key: 'getlld',
    className: styles.switchContainer,
  }];

  const switcher = hasSwitchWallet ? [{
    label: (
      <Button primary nano onClick={switchToRegisteredWallet} className={styles.switch}>
        Switch to registered wallet
      </Button>
    ),
    key: 'switch',
    className: styles.switchContainer,
  }] : [];

  const changeWallet = isBiggerThanSmallScreen ? [] : [
    {
      label: (
        <ChangeWallet onSelect={() => onClose?.()} />
      ),
      key: 'wallets',
      className: styles.switchContainer,
      onClick: ({ domEvent }) => domEvent.preventDefault(),
      onTitleClick: ({ domEvent }) => domEvent.preventDefault(),
    },
  ];

  const menu = (
    <Menu
      mode="inline"
      className={styles.sider}
      defaultOpenKeys={isBiggerThanDesktop ? Object.keys(openKeys) : undefined}
      selectedKeys={isBiggerThanDesktop ? [pathname] : undefined}
      key={getMenuKey()}
      overflowedIndicator={isBiggerThanSmallScreen ? undefined : <MenuIcon />}
      items={[
        ...getLLD,
        ...switcher,
        ...changeWallet,
        ...isBiggerThanSmallScreen ? [
          {
            label: 'For Citizens',
            key: 'citizen',
            children: navigationList.filter(({ isGovt }) => !isBiggerThanSmallScreen || !isGovt).map(createMenu),
          },
          {
            label: 'For State Officials',
            key: 'state',
            children: navigationList.filter(({ isGovt }) => isGovt).map(createMenu),
          },
        ] : navigationList.map(createMenu),
      ]}
    />
  );

  if (isBiggerThanSmallScreen) {
    return menu;
  }

  return (
    <Flex vertical gap="20px">
      <div onClick={(e) => e.stopPropagation()} className={styles.modeSwitch}>
        <ModeSwitch />
      </div>
      {menu}
    </Flex>
  );
}

UrlMenu.propTypes = {
  onClose: PropTypes.func,
};

export default UrlMenu;
