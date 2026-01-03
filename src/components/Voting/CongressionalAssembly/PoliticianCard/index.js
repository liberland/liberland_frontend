import React from 'react';
import PropTypes from 'prop-types';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import Divider from 'antd/es/divider';
import Avatar from 'antd/es/avatar';
import Tooltip from 'antd/es/tooltip';
import notification from 'antd/es/notification';
import Paragraph from 'antd/es/typography/Paragraph';
import Markdown from 'markdown-to-jsx';
import classNames from 'classnames';
import { useMediaQuery } from 'usehooks-ts';
import GlobalOutlined from '@ant-design/icons/GlobalOutlined';
import CopyOutlined from '@ant-design/icons/CopyOutlined';
import truncate from '../../../../utils/truncate';
import Button from '../../../Button/Button';
import ColorAvatar from '../../../ColorAvatar';
import sanitizeUrlHelper from '../../../../utils/sanitizeUrlHelper';
import styles from '../../styles.module.scss';
import CandidateModal from '../../../Modals/CandidateModal';

const componentOverride = { component: 'div' };

function PoliticanCard({
  politician,
  actions,
  preActions,
  isSelected,
}) {
  const modalHash = CandidateModal.createHash({ rawIdentity: politician.rawIdentity });
  const [api, contextHolder] = notification.useNotification();
  const handleCopyClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const modalLink = `${window.location.href.split('#')[0]}#${modalHash}`;
    navigator.clipboard.writeText(modalLink);
    api.success({ message: 'Link copied!' });
  };
  const isBigScreen = useMediaQuery('(min-width: 1600px)');
  const description = (
    <div className={styles.paragaphContainer}>
      <Paragraph ellipsis={{ rows: 6 }}>
        {politician.description && (
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
            {politician.description}
          </Markdown>
        )}
      </Paragraph>
    </div>
  );
  const copyLink = (
    <Tooltip title="Copy link" trigger={['click', 'focus', 'hover']}>
      <Button onClick={handleCopyClick}>
        <Flex gap="15px" align="center">
          <CopyOutlined aria-label="Copy link" />
        </Flex>
      </Button>
    </Tooltip>
  );

  return isBigScreen && !isSelected ? (
    <Card className={classNames({ [styles.votedFor]: politician.votedFor })}>
      <Flex align="stretch" vertical gap="16px">
        {contextHolder}
        <CandidateModal
          rawIdentity={politician.rawIdentity}
          actions={actions}
        >
          <Flex gap="16px" vertical>
            <Flex gap="12px" align="center">
              {politician.image ? (
                <Avatar size={64} src={politician.image} />
              ) : (
                <ColorAvatar size={64} name={politician.name} />
              )}
              <Flex align="center" gap="12px" justify="space-between" flex={1}>
                {truncate(politician.name, 20)}
                {copyLink}
              </Flex>
            </Flex>
            <Card.Meta
              description={description}
            />
          </Flex>
        </CandidateModal>
        <Divider />
        <Flex wrap gap="16px" align="center">
          {preActions}
          {politician.website && (
            <Button primary href={sanitizeUrlHelper(politician.website)} newTab>
              <Flex gap="15px" align="center">
                <GlobalOutlined />
                Learn more
              </Flex>
            </Button>
          )}
          {actions}
        </Flex>
      </Flex>
    </Card>
  ) : (
    <Card
      size="small"
      className={classNames(styles.candidate, { [styles.votedFor]: politician.votedFor })}
    >
      {contextHolder}
      <Flex vertical gap="15px">
        <CandidateModal
          rawIdentity={politician.rawIdentity}
          actions={actions}
        >
          <Flex vertical gap="15px">
            <Flex wrap gap="15px" align="center">
              {politician.image ? (
                <Avatar size={56} src={politician.image} />
              ) : (
                <ColorAvatar size={56} name={politician.name} />
              )}
              <Flex flex={1} gap="5px" align="center" justify="space-between">
                <strong>
                  {truncate(politician.name, 25)}
                </strong>
                {copyLink}
              </Flex>
            </Flex>
            <Card.Meta
              description={description}
            />
          </Flex>
        </CandidateModal>
        <Flex wrap gap="15px" align="center">
          {politician.website && !preActions?.length && (
            <Button primary href={sanitizeUrlHelper(politician.website)} newTab>
              <Flex gap="15px" align="center">
                <GlobalOutlined aria-label="Web" />
                Learn more
              </Flex>
            </Button>
          )}
          {preActions?.length ? preActions : null}
          {actions}
        </Flex>
      </Flex>
    </Card>
  );
}

PoliticanCard.propTypes = {
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
  preActions: PropTypes.arrayOf(PropTypes.node),
  actions: PropTypes.arrayOf(PropTypes.node),
  isSelected: PropTypes.bool,
};

export default PoliticanCard;
