import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from '../../Button/Button';
import ProposalDetailsModal from '../../Modals/ProposalDetailsModal';

import { assemblyActions } from '../../../redux/actions';
import { assemblySelectors } from '../../../redux/selectors';

import { ReactComponent as Icon } from '../../../assets/icons/blue-square.svg';
import styles from './styles.module.scss';

const Article = ({ article, type }) => {
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [proposalModalProps, setproposalModalProps] = useState({});
  const dispatch = useDispatch();
  const texFromPdf = useSelector(assemblySelectors.textPdfSelector);

  const handleProposalModalOpen = (proposal) => {
    setIsProposalModalOpen(!isProposalModalOpen);
    setproposalModalProps({ ...proposal, proposalModalShown: 0 });
  };

  const handleWorkerCall = () => {
    setproposalModalProps({ ...proposalModalProps, proposalModalShown: 1 });
    dispatch(assemblyActions.getTextPdf.call(proposalModalProps.id));
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
          proposal={proposalModalProps}
          closeModal={handleProposalModalOpen}
          goToProposal={handleWorkerCall}
          texFromPdf={texFromPdf}
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
