import React from 'react';
import PropTypes from 'prop-types';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import Divider from 'antd/es/divider';
import Avatar from 'antd/es/avatar';
import Paragraph from 'antd/es/typography/Paragraph';
import Markdown from 'markdown-to-jsx';
import classNames from 'classnames';
import { useMediaQuery } from 'usehooks-ts';
import GlobalOutlined from '@ant-design/icons/GlobalOutlined';
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

  return isBigScreen && !isSelected ? (
    <Card className={classNames({ [styles.votedFor]: politician.votedFor })}>
      <Flex align="stretch" vertical gap="16px">
        <CandidateModal
          politician={politician}
          actions={actions}
        >
          <Flex gap="16px" vertical>
            <Flex gap="12px" align="center">
              {politician.image ? (
                <Avatar size={64} src={politician.image} />
              ) : (
                <ColorAvatar size={64} name={politician.name} />
              )}
              {truncate(politician.name, 20)}
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
                <GlobalOutlined aria-label="Web" />
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
      <Flex vertical gap="15px">
        <CandidateModal
          politician={politician}
          actions={actions}
        >
          <Flex vertical gap="15px">
            <Flex wrap gap="15px" align="center">
              {politician.image ? (
                <Avatar size={56} src={politician.image} />
              ) : (
                <ColorAvatar size={56} name={politician.name} />
              )}
              <Flex vertical flex={1} gap="5px">
                <strong>
                  {truncate(politician.name, 25)}
                </strong>
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
