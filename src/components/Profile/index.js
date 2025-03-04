import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Collapse from 'antd/es/collapse';
import Descriptions from 'antd/es/descriptions';
import Flex from 'antd/es/flex';
import List from 'antd/es/list';
import { useMediaQuery } from 'usehooks-ts';
import Button from '../Button/Button';
import {
  userSelectors,
  walletSelectors,
  blockchainSelectors,
  identitySelectors,
  onboardingSelectors,
} from '../../redux/selectors';
import { formatDollars, formatMerits } from '../../utils/walletHelpers';
import styles from './styles.module.scss';
import liberlandEmblemImage from '../../assets/images/liberlandEmblem.svg';
import UpdateProfile from './UpdateProfile';
import { blockchainActions, identityActions, onBoardingActions } from '../../redux/actions';
import {
  parseDOB,
  parseAdditionalFlag,
  parseCitizenshipJudgement,
  decodeAndFilter,
} from '../../utils/identityParser';
import CopyIconWithAddress from '../CopyIconWithAddress';
import truncate from '../../utils/truncate';
import { setCentralizedBackendAddress } from '../../utils/setCentralizedBackendAddress';

function Profile() {
  const userName = useSelector(userSelectors.selectUserGivenName);
  const lastName = useSelector(userSelectors.selectUserFamilyName);
  const isBigScreen = useMediaQuery('(min-width: 1500px)');
  const spanSize = isBigScreen ? 12 : 24;
  const walletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  const userId = useSelector(userSelectors.selectUserId);
  const blockNumber = useSelector(blockchainSelectors.blockNumber);
  const identity = useSelector(identitySelectors.selectorIdentity);
  const walletInfo = useSelector(walletSelectors.selectorWalletInfo);
  const balances = useSelector(walletSelectors.selectorBalances);
  const liquidMerits = useSelector(walletSelectors.selectorLiquidMeritsBalance);
  const registeredAddress = useSelector(userSelectors.selectWalletAddress);
  const liquidDollars = useSelector(
    walletSelectors.selectorLiquidDollarsBalance,
  );
  const user = useSelector(userSelectors.selectUser);
  const isUserEligibleForComplimentaryLLD = useSelector(
    onboardingSelectors.selectorEligibleForComplimentaryLLD,
  );
  // eslint-disable-next-line max-len
  const ineligibleForComplimentaryLLDReason = useSelector(onboardingSelectors.selectorIneligibleForComplimentaryLLDReason);
  const isLoading = useSelector(onboardingSelectors.selectorIneligibleForComplimentaryLLDIsLoading);
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unsafe-optional-chaining
  const lockBlocks = walletInfo?.balances?.electionLock - blockNumber;
  const lockDays = lockBlocks > 0 ? (lockBlocks * 6) / 3600 / 24 : 0;

  useEffect(() => {
    dispatch(identityActions.getIdentity.call(walletAddress));
    dispatch(onBoardingActions.getEligibleForComplimentaryLld.call());
  }, [liquidDollars, dispatch, walletAddress]);

  const { judgements, info } = identity?.isSome ? identity.unwrap() : {};
  const date_of_birth = parseDOB(info?.additional, blockNumber);

  const displayName = userName && lastName ? `${userName} ${lastName}` : '';
  const emptyElement = <em>&lt;empty&gt;</em>;
  const decodedData = decodeAndFilter(info, ['display', 'web', 'legal', 'email']);
  const onChainIdenityList = [
    {
      dataFunction: () => decodedData?.display,
      title: 'Display',
      isDataToShow: true,
    },
    {
      dataFunction: () => decodedData?.legal,
      title: 'Legal',
      isDataToShow: true,
    },
    {
      dataFunction: () => decodedData?.web,
      title: 'Web',
      isDataToShow: true,
    },
    {
      dataFunction: () => decodedData?.email,
      title: 'Email',
      isDataToShow: true,
    },
    {
      dataFunction: () => (date_of_birth === false ? 'old enough to vote' : date_of_birth),
      title: 'Date of birth',
      isDataToShow: true,
    },
    {
      dataFunction: () => parseAdditionalFlag(info?.additional, 'citizen'),
      title: 'Citizen',
      isDataToShow: false,
    },
    {
      dataFunction: () => parseAdditionalFlag(info?.additional, 'eresident'),
      title: 'E-resident',
      isDataToShow: false,
    },
    {
      dataFunction: () => parseAdditionalFlag(info?.additional, 'company'),
      title: 'Company',
      isDataToShow: false,
    },
    {
      dataFunction: () => parseCitizenshipJudgement(judgements),
      title: 'Identity confirmed',
      isDataToShow: false,
    },
  ];

  const handleGetFreeLLD = () => {
    dispatch(onBoardingActions.claimComplimentaryLld.call());
  };

  const switchRegistered = userId && walletAddress && registeredAddress !== walletAddress && (
    <Flex wrap gap="15px">
      <Button
        primary
        onClick={() => {
          dispatch(blockchainActions.setUserWallet.success(walletAddress));
          setCentralizedBackendAddress(walletAddress, userId, { dispatch });
        }}
      >
        Register
        {' '}
        {truncate(walletAddress, isBigScreen ? 18 : 12)}
        {registeredAddress ? ' instead' : ''}
      </Button>
    </Flex>
  );

  return (
    <Collapse
      defaultActiveKey={['profile', 'account', 'onchain']}
      collapsible="icon"
      items={[
        {
          key: 'account',
          label: displayName || 'Account',
          extra: (
            <Flex wrap gap="15px">
              <Button disabled>
                Edit
              </Button>
              <img
                className={styles.liberlandLogo}
                src={liberlandEmblemImage}
                alt="liberlandEmblem"
              />
            </Flex>
          ),
          children: (
            <Flex vertical gap="20px">
              <Descriptions
                column={24}
                layout={isBigScreen ? 'horizontal' : 'vertical'}
                title="Information"
              >
                <Descriptions.Item span={spanSize} label="LLM (liquid)">
                  {formatMerits(liquidMerits)}
                </Descriptions.Item>
                <Descriptions.Item span={spanSize} label="LLM (Politipooled)">
                  {formatMerits(
                    balances.liberstake.amount,
                  )}
                </Descriptions.Item>
                <Descriptions.Item span={spanSize} label="LLD">
                  {formatDollars(balances.liquidAmount.amount)}
                </Descriptions.Item>
                <Descriptions.Item span={spanSize} label="Wallet">
                  <CopyIconWithAddress address={walletAddress} />
                </Descriptions.Item>
                <Descriptions.Item span={spanSize} label="Registered wallet">
                  <Flex vertical gap="10px">
                    {registeredAddress ? (
                      <CopyIconWithAddress address={registeredAddress} />
                    ) : 'Unknown'}
                    {!isBigScreen && switchRegistered}
                  </Flex>
                </Descriptions.Item>
                <Descriptions.Item span={spanSize} label="Unpooling in effect">
                  {lockDays.toFixed(2)}
                  {' '}
                  days remaining.
                </Descriptions.Item>
              </Descriptions>
              {isBigScreen && switchRegistered}
            </Flex>
          ),
        },
        {
          key: 'onchain',
          label: 'On-chain identity',
          children: (
            <Flex vertical gap="20px">
              <List
                dataSource={onChainIdenityList}
                renderItem={({ isDataToShow, title, dataFunction }) => {
                  const dataFromFunction = dataFunction();
                  const yesOrNo = dataFromFunction ? 'Yes' : 'No';
                  const htmlElement = isDataToShow
                    ? dataFromFunction
                    : yesOrNo;
                  return (
                    <List.Item>
                      <List.Item.Meta
                        title={title}
                        description={htmlElement ? (
                          <strong>{htmlElement}</strong>
                        ) : (
                          emptyElement
                        )}
                      />
                    </List.Item>
                  );
                }}
              />
              <Flex wrap gap="15px">
                <UpdateProfile
                  blockNumber={blockNumber}
                  identity={identity}
                  lastName={lastName}
                  userName={userName}
                />
                <Button
                  primary={isUserEligibleForComplimentaryLLD && !isLoading}
                  onClick={handleGetFreeLLD}
                  grey={!isUserEligibleForComplimentaryLLD}
                  disabled={isLoading}
                >
                  {isUserEligibleForComplimentaryLLD || !user
                    ? 'Claim complimentary LLD'
                    : ineligibleForComplimentaryLLDReason}
                </Button>
              </Flex>
            </Flex>
          ),
        },
      ]}
    />
  );
}

export default Profile;
