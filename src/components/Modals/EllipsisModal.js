import React from 'react';
import PropTypes from 'prop-types';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import Markdown from 'markdown-to-jsx';
import Button from '../Button/Button';
import modalWrapper from './components/ModalWrapper';
import styles from './styles.module.scss';

const componentOverride = { component: 'div' };

function EllipsisDisplay({
  onClose,
  paragraph,
  title,
}) {
  return (
    <Flex vertical gap="16px">
      <Title level={3}>{title}</Title>
      <Paragraph>
        <Markdown
          options={{
            disableParsingRawHTML: true,
          }}
        >
          {paragraph}
        </Markdown>
      </Paragraph>
      <Flex wrap gap="15px">
        <Button
          onClick={onClose}
        >
          Close
        </Button>
      </Flex>
    </Flex>
  );
}

EllipsisDisplay.propTypes = {
  onClose: PropTypes.func.isRequired,
  paragraph: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
};

function ButtonModal({
  onClick,
  paragraph,
}) {
  if (!paragraph) {
    return null;
  }

  return (
    <div role="button" onClick={onClick} tabIndex={0} className={styles.paragraphBlock}>
      <Paragraph ellipsis={{ rows: 3 }}>
        <Markdown
          options={{
            disableParsingRawHTML: true,
            overrides: {
              h1: componentOverride,
              h2: componentOverride,
              h3: componentOverride,
              h4: componentOverride,
              h5: componentOverride,
              h6: componentOverride,
            },
          }}
        >
          {paragraph}
        </Markdown>
      </Paragraph>
    </div>
  );
}

ButtonModal.propTypes = {
  onClick: PropTypes.func.isRequired,
  paragraph: PropTypes.string,
};

const EllipsisModal = modalWrapper(EllipsisDisplay, ButtonModal);

export default EllipsisModal;
