import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import Result from 'antd/es/result';
import { useSelector } from 'react-redux';
import Markdown from 'markdown-to-jsx';
import Button from '../Button/Button';
import modalWrapper from './components/ModalWrapper';
import styles from './styles.module.scss';
import { democracySelectors } from '../../redux/selectors';

function CandidateDisplay({
  onClose,
  actions,
  rawIdentity,
}) {
  const democracy = useSelector(democracySelectors.selectorDemocracyInfo);

  const politician = useMemo(() => {
    const {
      currentCongressMembers, candidates, runnersUp,
    } = democracy?.democracy || {};
    const allMembers = [
      ...(currentCongressMembers || []),
      ...(candidates || []),
      ...(runnersUp || []),
    ];
    return allMembers.find((member) => member.rawIdentity === rawIdentity);
  }, [democracy?.democracy, rawIdentity]);

  if (!politician) {
    return <Result status={404} title="Profile not found" />;
  }

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
  rawIdentity: PropTypes.string.isRequired,
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

const CandidateModal = modalWrapper(
  CandidateDisplay,
  ButtonModal,
  {
    matchHash: (props, object) => {
      const { rawIdentity } = props;
      const { rawIdentity: compareIdentity, component } = object || {};
      return component === 'CandidateModal' && rawIdentity === compareIdentity;
    },
    createHash: ({ rawIdentity }) => ({
      component: 'CandidateModal',
      rawIdentity,
    }),
  },
);

export default CandidateModal;
