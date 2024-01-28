import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Avatar from 'react-avatar';
import cx from 'classnames';

import Button from '../Button/Button';
import {
  userSelectors, walletSelectors, blockchainSelectors, identitySelectors, onboardingSelectors,
} from '../../redux/selectors';
import { formatDollars, formatMerits } from '../../utils/walletHelpers';
import { ReactComponent as GlobeIcon } from '../../assets/icons/globe.svg';
import truncate from '../../utils/truncate';

import styles from './styles.module.scss';
import liberlandEmblemImage from '../../assets/images/liberlandEmblem.svg';
import Card from '../Card';
import { OnchainIdentityModal } from '../Modals';
import { identityActions, onBoardingActions } from '../../redux/actions';
import {
  parseLegal, parseIdentityData, parseDOB, parseAdditionalFlag, parseCitizenshipJudgement,
} from '../../utils/identityParser';

function Profile({ className }) {
  const userName = useSelector(userSelectors.selectUserGivenName);
  const lastName = useSelector(userSelectors.selectUserFamilyName);
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const blockNumber = useSelector(blockchainSelectors.blockNumber);
  const identity = useSelector(identitySelectors.selectorIdentity);
  const walletInfo = useSelector(walletSelectors.selectorWalletInfo);
  const balances = useSelector(walletSelectors.selectorBalances);
  const liquidMerits = useSelector(walletSelectors.selectorLiquidMeritsBalance);
  const liquidDollars = useSelector(walletSelectors.selectorLiquidDollarsBalance);
  const isUserEligibleForComplimentaryLLD = useSelector(onboardingSelectors.selectorEligibleForComplimentaryLLD);
  // eslint-disable-next-line max-len
  const ineligibleForComplimentaryLLDReason = useSelector(onboardingSelectors.selectorIneligibleForComplimentaryLLDReason);

  const dispatch = useDispatch();
  // eslint-disable-next-line no-unsafe-optional-chaining
  const lockBlocks = walletInfo?.balances?.electionLock - blockNumber;
  const lockDays = lockBlocks > 0 ? (lockBlocks * 6) / 3600 / 24 : 0;

  const [isModalOpenOnchainIdentity, setIsModalOpenOnchainIdentity] = useState(false);

  useEffect(() => {
    dispatch(onBoardingActions.getEligibleForComplimentaryLld.call());
    dispatch(identityActions.getIdentity.call(walletAddress));
  }, [liquidDollars]);

  const toggleModalOnchainIdentity = () => {
    setIsModalOpenOnchainIdentity(!isModalOpenOnchainIdentity);
  };

  const handleSubmitOnchainIdentity = (values) => {
    let eligible_on = null;

    if (values.older_than_15) {
      eligible_on = new Date(0);
    } else if (values.date_of_birth) {
      const dob = new Date(values.date_of_birth);
      eligible_on = new Date(dob.getFullYear() + 15, dob.getMonth(), dob.getDate());
    }

    const params = {
      display: values.display,
      legal: values.legal,
      web: values.web,
      email: values.email,
      onChainIdentity: values.onChainIdentity,
      eligible_on,
    };

    dispatch(identityActions.setIdentity.call({ userWalletAddress, values: params }));
    toggleModalOnchainIdentity();
  };

  const { judgements, info } = identity?.isSome ? identity.unwrap() : {};
  const date_of_birth = parseDOB(info?.additional, blockNumber);

  const displayName = userName && lastName ? `${userName} ${lastName}` : '';
  const emptyElement = <em>&lt;empty&gt;</em>;

  const onChainIdenityList = [
    {
      dataFunction: () => parseIdentityData(info?.display),
      title: 'Display',
      isDataToShow: true,
    },
    {
      dataFunction: () => parseLegal(info),
      title: 'Legal',
      isDataToShow: true,
    },
    {
      dataFunction: () => parseIdentityData(info?.web),
      title: 'Web',
      isDataToShow: true,
    },
    {
      dataFunction: () => parseIdentityData(info?.email),
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
      dataFunction: () => parseCitizenshipJudgement(judgements),
      title: 'Identity confirmed',
      isDataToShow: false,
    },
  ];

  return (
    <div className={styles.wrapper}>
      <Card className={cx(styles.profile, className)} isNotBackground>
        <div className={cx('left-column', styles.column)}>
          <div className={styles.wrapperBlock}>
            <div className={styles.avatar}>
              <h3 className={cx(styles.avatarTitle, styles.font)}>Profile</h3>
              <div className={styles.avatarComponent}>
                <Avatar name={displayName} size="100%" round color="#F6F6F6" />
              </div>
              <Button className={styles.button} medium>EDIT YOUR PROFILE</Button>
            </div>
          </div>
        </div>
        <div className={cx('right-column', styles.column)}>
          <div className={styles.wrapperBlock}>
            <div className={styles.userNameBalance}>
              <div className={styles.userNameRole}>
                <h3 className={styles.font}>
                  {displayName || 'Account'}
                </h3>
                <div>
                  <img className={styles.liberlandLogo} src={liberlandEmblemImage} alt="liberlandEmblem" />
                </div>
              </div>
              <div className="bottom-block">
                <div className={styles.balance}>
                  <span>
                    {`${formatMerits(liquidMerits)} LLM (liquid)`}
                  </span>
                  <div className={styles.balance}>
                    <span>
                      {`${formatMerits(balances.liberstake.amount)} LLM (Politipooled)`}
                    </span>
                  </div>
                  <div className={styles.balance}>
                    <span>
                      {`${formatDollars(balances.liquidAmount.amount)} LLD`}
                    </span>
                  </div>
                  <div className={styles.iconAddress}>
                    <GlobeIcon />
                    <span className={styles.walletAddress}>
                      {walletAddress ? truncate(walletAddress, 25) : ''}
                    </span>
                  </div>

                </div>
                { lockDays <= 0 ? null
                  : (
                    <div>
                      Unpooling in effect:
                      {' '}
                      {lockDays.toFixed(2)}
                      {' '}
                      days remaining.
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
        <div className={cx(styles.lastColumn, styles.column)}>
          <div className={styles.wrapperBlock}>
            <div className={styles.aboutUser}>
              <h3 className={styles.font}>On-chain identity</h3>
              <div className={styles.itemFooterAbout}>
                <ul>
                  {onChainIdenityList.map((onChainIdentityElement) => {
                    const { isDataToShow, title, dataFunction } = onChainIdentityElement;
                    const dataFromFunction = dataFunction();
                    const yesOrNo = dataFromFunction ? 'Yes' : 'No';
                    const htmlElement = isDataToShow ? dataFromFunction : yesOrNo;
                    return (
                      <li key={title}>
                        <span>
                          {title}
                        </span>
                        {': '}
                        {htmlElement ? <span className={styles.bold}>{htmlElement}</span> : emptyElement}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className={styles.buttons}>
                <Button className={styles.textColor} medium primary onClick={toggleModalOnchainIdentity}>
                  Update identity
                </Button>
                <Button
                  className={styles.textColor}
                  medium
                  primary={isUserEligibleForComplimentaryLLD}
                  grey={!isUserEligibleForComplimentaryLLD}
                  onClick={() => dispatch(onBoardingActions.claimComplimentaryLld.call())}
                >
                  {isUserEligibleForComplimentaryLLD ? 'Claim complimentary LLD' : ineligibleForComplimentaryLLDReason}
                </Button>
              </div>
            </div>
          </div>
        </div>
        {isModalOpenOnchainIdentity && (
        <OnchainIdentityModal
          closeModal={toggleModalOnchainIdentity}
          onSubmit={handleSubmitOnchainIdentity}
          identity={identity}
          blockNumber={blockNumber}
          name={displayName}
        />
        )}
      </Card>
    </div>
  );
}

Profile.defaultProps = {
  className: '',
};

Profile.propTypes = {
  className: PropTypes.string,
};

export default Profile;
