import React from 'react';
import PropTypes from 'prop-types';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import Markdown from 'markdown-to-jsx';
import Button from '../Button/Button';
import modalWrapper from './components/ModalWrapper';
import styles from './styles.module.scss';

function CandidateDisplay({
  onClose,
  politician,
  actions,
}) {
  return (
    <Flex vertical gap="16px">
      <Title level={3}>{politician.name}</Title>
      {politician.description && (
        <Paragraph>
          <Markdown
            options={{
              disableParsingRawHTML: true,
            }}
          >
            {politician.description}
          </Markdown>
        </Paragraph>
      )}
      <Flex wrap gap="15px">
        {actions}
        <Button
          onClick={onClose}
        >
          Close
        </Button>
      </Flex>
    </Flex>
  );
}

CandidateDisplay.propTypes = {
  onClose: PropTypes.func.isRequired,
  politician: PropTypes.shape({
    name: PropTypes.string,
    legal: PropTypes.string,
    website: PropTypes.string,
    votedFor: PropTypes.bool,
    description: PropTypes.string,
    image: PropTypes.string,
    rawIdentity: PropTypes.string.isRequired,
    identityData: PropTypes.shape({
      info: PropTypes.shape({
        web: PropTypes.shape({
          raw: PropTypes.string,
          none: PropTypes.string,
        }),
      }),
    }).isRequired,
  }).isRequired,
  actions: PropTypes.arrayOf(PropTypes.node),
};

function ButtonModal({
  onClick,
  children,
}) {
  return (
    <div role="button" onClick={onClick} tabIndex={0} className={styles.paragraphBlock}>
      {children}
    </div>
  );
}

ButtonModal.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
};

const CandidateModal = modalWrapper(CandidateDisplay, ButtonModal);

export default CandidateModal;
