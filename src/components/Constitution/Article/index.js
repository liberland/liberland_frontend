import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from '../../Button/Button';
import ProposalDetailsModal from '../../Modals/ProposalDetailsModal';

import { ReactComponent as Icon } from '../../../assets/icons/blue-square.svg';
import styles from './styles.module.scss';

const Article = ({ article, type }) => {
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [proposalModalProps, setproposalModalProps] = useState({});

  const handleProposalModalOpen = ({
    proposalName,
    proposalStatus,
    shortDescription,
    threadLink,
    id,
  }) => {
    setIsProposalModalOpen(!isProposalModalOpen);
    setproposalModalProps({
      proposalName,
      proposalStatus,
      shortDescription,
      threadLink,
      id,
    });
  };

  return (
    <div className={cx(styles.singleArticle, styles[type])}>
      <div className={styles.round}>
        <Icon />
      </div>
      <div>
        <div className={cx(styles.titleWrapper)}>
          <h3>
            {article.proposalName}
          </h3>
          <Button
            nano
            grey
            className={styles.detailsButton}
            onClick={() => handleProposalModalOpen(article)}
          >
            details
          </Button>
        </div>
        <span>
          Last update
          {' '}
          {article.updatedAt}
          {' '}
        </span>
        <span>
          Short Description
          {' '}
          {article.shortDescription}
        </span>
      </div>
      {isProposalModalOpen && (
        <ProposalDetailsModal
          closeModal={handleProposalModalOpen}
          proposalName={proposalModalProps.proposalName}
          proposalStatus={proposalModalProps.proposalStatus}
          shortDescription={proposalModalProps.shortDescription}
          threadLink={proposalModalProps.threadLink}
          proposalId={proposalModalProps.id}
        />
      )}
    </div>
  );
};

Article.propTypes = {
  article: PropTypes.shape({
    proposalName: PropTypes.string.isRequired,
    shortDescription: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
  }).isRequired,
  type: PropTypes.string.isRequired,
};

export default Article;
