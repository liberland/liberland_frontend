// LIBS
import React from 'react';
import cx from 'classnames';

// COMPONENTS
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import { ReactComponent as OccupationImage } from '../../assets/icons/occuoation.svg';
import { ReactComponent as LikeGrey } from '../../assets/icons/like-grey.svg';
import { ReactComponent as GroupChat } from '../../assets/icons/group-chat.svg';

// STYLES
import styles from './styles.module.scss';

const ProposalDetailsModal = ({
  closeModal, proposalId
}) => {
  // Here you need to fetch data for chosen proposal using proposalRow
  return (
    <div className={styles.getCitizenshipModal}>
      <div className={styles.h3}>Proposal details</div>
      <div className={styles.h4}>Create lorem ipsum dolor sit consectetur</div>
      <div className={styles.description}>
        Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Aliquet elementum vel diam neque orci id egestas.
      </div>
      <div className={styles.infoSection}>
        <div className={styles.infoItem}>
          <OccupationImage />
          <span>Submitted by</span>
          <span className={styles.valueOfItem}> Dmitry Veselov</span>
        </div>
        <div className={styles.infoItem}>
          <LikeGrey />
          <span>Current status</span>
          <span className={styles.valueOfItem}> Current status Voting (71h 52m 44s left)</span>
        </div>
        <div className={styles.infoItem}>
          <GroupChat />
          <span>Discussion thread</span>
          <span className={cx(styles.valueOfItem, styles.yellow)}> Reddit</span>
        </div>
      </div>
      <div className={styles.buttonWrapper}>
        <Button
          medium
          onClick={closeModal}
        >
          Cancel
        </Button>
        <Button
          primary
          medium
        >
          Go to proposal
        </Button>
      </div>
    </div>
  );
};

const ProposalDetailsModalWrapper = (props) => (
  <ModalRoot>
    <ProposalDetailsModal {...props} />
  </ModalRoot>
);

export default ProposalDetailsModalWrapper;
