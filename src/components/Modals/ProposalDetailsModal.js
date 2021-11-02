// LIBS
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

// COMPONENTS
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import { ReactComponent as OccupationImage } from '../../assets/icons/occuoation.svg';
import { ReactComponent as LikeGrey } from '../../assets/icons/like-grey.svg';
import { ReactComponent as GroupChat } from '../../assets/icons/group-chat.svg';

// STYLES
import styles from './styles.module.scss';

const ProposalDetailsModal = ({
  // eslint-disable-next-line react/prop-types
  proposal: {
    proposalName,
    proposalStatus,
    shortDescription,
    threadLink,
    proposalSubmiter,
    proposalModalShown,
  },
  goToProposal,
  texFromPdf,
  closeModal,
}) => (
  // Here you need to fetch data for chosen proposal using proposalRow
  // eslint-disable-next-line no-console
  <>
    {proposalModalShown === 0 && (
      <div className={styles.getCitizenshipModal}>
        <div className={styles.h3}>Proposal details</div>
        <div className={styles.h4}>{proposalName}</div>
        <div className={styles.description}>{shortDescription}</div>
        <div className={styles.infoSection}>
          <div className={styles.infoItem}>
            <OccupationImage />
            <span>Submitted by</span>
            <span className={styles.valueOfItem}>{proposalSubmiter}</span>
          </div>
          <div className={styles.infoItem}>
            <LikeGrey />
            <span>Current status</span>
            <span className={styles.valueOfItem}>{proposalStatus}</span>
          </div>
          <div className={styles.infoItem}>
            <GroupChat />
            <span>Discussion thread</span>
            <span className={cx(styles.valueOfItem, styles.yellow)}>{threadLink}</span>
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
            onClick={goToProposal}
          >
            Go to proposal
          </Button>
        </div>
      </div>
    )}
    {proposalModalShown === 1 && (
      <div className={styles.getCitizenshipModal}>
        <p>{texFromPdf}</p>
        <div className={styles.buttonWrapper}>
          <Button
            medium
            onClick={closeModal}
          >
            Close
          </Button>
        </div>
      </div>
    )}
  </>
);

const ProposalDetailsModalWrapper = (props) => (
  <ModalRoot>
    <ProposalDetailsModal {...props} />
  </ModalRoot>
);

ProposalDetailsModal.propTypes = {
  proposal: PropTypes.shape({
    proposalName: PropTypes.string,
    proposalStatus: PropTypes.string,
    shortDescription: PropTypes.string,
    threadLink: PropTypes.string,
    proposalSubmiter: PropTypes.string,
    proposalModalShown: PropTypes.number,
  }),
  goToProposal: PropTypes.func,
  texFromPdf: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
};

ProposalDetailsModal.defaultProps = {
  proposal: ({
    proposalName: 'PROPOSAL NAME',
    proposalStatus: 'PROPOSAL STATUS',
    shortDescription: 'PROPOSAL DESCRIPTION',
    threadLink: 'THERE IS NO THREAD',
    proposalSubmiter: 'PROPOSAL SUBMITER',
    proposalModalShown: 0,
  }),
  goToProposal: () => null,
  texFromPdf: '',
};

export default ProposalDetailsModalWrapper;
