import React from 'react';
import { useSelector } from 'react-redux';
import Avatar from 'react-avatar';
import cx from 'classnames';

import Button from '../Button/Button';
import { userSelectors } from '../../redux/selectors';

import styles from './styles.module.scss';

import eCardImage from '../../assets/images/e_card_image.svg';
import liberlandEmblemImage from '../../assets/images/liberlandEmblem.svg';
import locationImage from '../../assets/icons/location.svg';
import languagesImage from '../../assets/icons/languages.svg';
import occupationImage from '../../assets/icons/occuoation.svg';
import genderImage from '../../assets/icons/gender.svg';
import startOfKyc from '../../assets/icons/startOfKyc.svg';
import Card from '../Card';

const Profile = ({ className }) => {
  const userName = useSelector(userSelectors.selectUserName);
  const lastName = useSelector(userSelectors.selectUserLastName);
  const userBalance = '100.000';
  const walletAddress = '0x495f...7b5e';
  const userRole = useSelector(userSelectors.selectUserRole);
  const aboutUser = useSelector(userSelectors.selectUserAbout);
  const originFrom = useSelector(userSelectors.selectUserOrigin);
  const language = useSelector(userSelectors.selectUserLanguages);
  const occupation = useSelector(userSelectors.selectUserOccupation);
  const gender = useSelector(userSelectors.selectUserGender);

  return (
    <Card className={cx(styles.profile, className)}>
      <div className="left-column">
        <div className={styles.wrapperBlock}>
          <div className={styles.avatar}>
            <div className={styles.avatarImage}>
              <Avatar name={`${userName} ${lastName}`} round size="251" color="#FDF4E0" />
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
                {`${userName} ${lastName}` }
              </h3>
              <div>
                <img src={liberlandEmblemImage} alt="" />
                <span>
                  {` ${userRole} `}
                </span>
                {(userRole !== 'non-citizen') ? 'of Liberland' : ''}
              </div>
            </div>
            <div className="bottom-block">
              <div className={styles.balance}>
                balance:
                <span>
                  {`${userBalance} LLM`}
                </span>
                <span className={styles.walletAddress}>
                  {walletAddress}
                </span>
              </div>
            </div>
          </div>
        </div>
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
      </div>
    </Card>
  );
};

export default Profile;
