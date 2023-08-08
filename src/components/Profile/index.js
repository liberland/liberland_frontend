import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Avatar from 'react-avatar';
import cx from 'classnames';

import Button from '../Button/Button';
import { userSelectors, walletSelectors, blockchainSelectors, identitySelectors } from '../../redux/selectors';
import { formatDollars, formatMerits } from '../../utils/walletHelpers';

import truncate from '../../utils/truncate';

import styles from './styles.module.scss';

import eCardImage from '../../assets/images/e_card_image.svg';
import liberlandEmblemImage from '../../assets/images/liberlandEmblem.svg';
import locationImage from '../../assets/icons/location.svg';
import languagesImage from '../../assets/icons/languages.svg';
import occupationImage from '../../assets/icons/occuoation.svg';
import genderImage from '../../assets/icons/gender.svg';
import startOfKyc from '../../assets/icons/startOfKyc.svg';
import Card from '../Card';
import { OnchainIdentityModal } from '../Modals';
import { identityActions } from '../../redux/actions';
import { parseLegal, parseIdentityData, parseDOB, parseAdditionalFlag, parseCitizenshipJudgement } from '../../utils/identityParser';

function Profile({ className }) {
  const userName = useSelector(userSelectors.selectUserGivenName);
  const lastName = useSelector(userSelectors.selectUserFamilyName);
  const walletAddress = useSelector(walletSelectors.selectorWalletAddress);
  const userRole = useSelector(userSelectors.selectUserRole);
  const aboutUser = useSelector(userSelectors.selectUserAbout);
  const originFrom = useSelector(userSelectors.selectUserOrigin);
  const language = useSelector(userSelectors.selectUserLanguages);
  const occupation = useSelector(userSelectors.selectUserOccupation);
  const gender = useSelector(userSelectors.selectUserGender);
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const blockNumber = useSelector(blockchainSelectors.blockNumber);
  const identity = useSelector(identitySelectors.selectorIdentity);
  const walletInfo = useSelector(walletSelectors.selectorWalletInfo);
  const balances = useSelector(walletSelectors.selectorBalances);
  const liquidMerits = useSelector(walletSelectors.selectorLiquidMeritsBalance);
  const lockBlocks = walletInfo?.balances?.electionLock - blockNumber;
  const lockDays = lockBlocks > 0 ? lockBlocks * 6 / 3600 / 24 : 0;

  const dispatch = useDispatch();

  const [isModalOpenOnchainIdentity, setIsModalOpenOnchainIdentity] = useState(false);

  const toggleModalOnchainIdentity = () => {
    setIsModalOpenOnchainIdentity(!isModalOpenOnchainIdentity);
  };

  const handleSubmitOnchainIdentity = (values) => {
    let eligible_on = null;

    if (values.older_than_13) {
      eligible_on = new Date(0)
    } else if (values.date_of_birth) {
      const dob = new Date(values.date_of_birth);
      eligible_on = new Date(dob.getFullYear()+13, dob.getMonth(), dob.getDate());
    }

    const params = {
      display: values.display,
      legal: values.legal,
      web: values.web,
      email: values.email,
      citizen: values.citizen,
      eligible_on,
      eresident: values.e_resident
    }

    dispatch(identityActions.setIdentity.call({userWalletAddress, values: params}));
    toggleModalOnchainIdentity();
  };

  const {judgements, info} = identity?.isSome ? identity.unwrap() : {};
  const date_of_birth = parseDOB(info?.additional, blockNumber);

  const displayName = userName && lastName ? `${userName} ${lastName}` : "";

  return (
    <Card className={cx(styles.profile, className)}>
      <div className="left-column">
        <div className={styles.wrapperBlock}>
          <div className={styles.avatar}>
            <div className={styles.avatarImage}>
              <Avatar name={displayName} round size="251" color="#FDF4E0" />
            </div>
            <Button medium>Edit Your Profile</Button>
          </div>
        </div>
        {(userRole !== 'non-citizen')
          ? (
            <div className={styles.wrapperBlock}>
              <div className={styles.liberlandId}>
                <h3>Your Liberland ID</h3>
                <div className={styles.avatarImage}>
                  <img src={eCardImage} alt="" />
                </div>
                <Button medium primary>Show QR code</Button>
              </div>
            </div>
          )
          : (
            <div className={styles.wrapperBlock}>
              <div className={styles.startOfKyc}>
                <img src={startOfKyc} alt="" />
                <h3>Get a real freedom</h3>
                <h3>with Liberland E-residency</h3>
                <span>
                  We need to know more information about you to provide e-residency status.
                </span>
                <Button medium primary>Start KYC</Button>
              </div>
            </div>
          )}
      </div>
      <div className="right-column">
        <div className={styles.wrapperBlock}>
          <div className={styles.userNameBalance}>
            <div className={styles.userNameRole}>
              <h3>
                {displayName || "Account"}
              </h3>
              <div>
                <img src={liberlandEmblemImage} alt="" />
                {/*
                <span>
                  {` ${userRolesHelper.getUserRolesString(userRole)} `}
                </span>
                {(userRolesHelper.getUserRolesString(userRole) !== 'Non citizen') ? 'of Liberland' : ''}
                */}
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
                <span className={styles.walletAddress}>
                  {walletAddress ? truncate(walletAddress, 13) : ''}
                </span>
              </div>
              { lockDays <= 0 ? null :
                <div>
                  Unpooling in effect: {lockDays.toFixed(2)} days remaining.
                </div>
              }
            </div>
          </div>
        </div>
        {/*
        <div className={styles.wrapperBlock}>
          <div className={styles.aboutUser}>
            <h3>About Me</h3>
            <span>{aboutUser}</span>
            <div className={styles.aboutUserFooter}>
              <div className={styles.itemFooterAbout}>
                <img src={locationImage} alt="location" />
                <span>Origin from</span>
                <span className={styles.valueOfItem}>{originFrom}</span>
              </div>
              <div className={styles.itemFooterAbout}>
                <img src={languagesImage} alt="languages" />
                <span>Language(s)</span>
                <span className={styles.valueOfItem}>{language.join(', ')}</span>
              </div>
              <div className={styles.itemFooterAbout}>
                <img src={occupationImage} alt="Occupation" />
                <span>Occupation</span>
                <span className={styles.valueOfItem}>{occupation}</span>
              </div>
              <div className={styles.itemFooterAbout}>
                <img src={genderImage} alt="Gender" />
                <span>Gender</span>
                <span className={styles.valueOfItem}>{gender}</span>
              </div>
            </div>
          </div>
        </div>
        */}
        <div className={styles.wrapperBlock}>
          <div className={styles.aboutUser}>
            <h3>On-chain identity</h3>
            <div className={styles.itemFooterAbout}>
              <ul>
                <li>Display: {parseIdentityData(info?.display) ?? <em>&lt;empty&gt;</em>}</li>
                <li>Legal: {parseLegal(info) ?? <em>&lt;empty&gt;</em>}</li>
                <li>Web: {parseIdentityData(info?.web) ?? <em>&lt;empty&gt;</em>}</li>
                <li>Email: {parseIdentityData(info?.email) ?? <em>&lt;empty&gt;</em>}</li>
                { date_of_birth === false ?
                  <li>Date of birth: old enough to vote</li> :
                  <li>Date of birth: {date_of_birth ?? <em>&lt;empty&gt;</em>}</li>
                }
                <li>Citizen: {parseAdditionalFlag(info?.additional, 'citizen') ? "YES" : "NO"}</li>
                <li>E-resident: {parseAdditionalFlag(info?.additional, 'eresident') ? "YES" : "NO"}</li>
                <li>Identity confirmed: {parseCitizenshipJudgement(judgements) ? "YES" : "NO"}</li>
              </ul>
            </div>
            <Button medium primary onClick={toggleModalOnchainIdentity}>Update identity</Button>
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
  );
}

Profile.defaultProps = {
  className: '',
};

Profile.propTypes = {
  className: PropTypes.string,
};

export default Profile;
