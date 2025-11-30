import React from 'react';
import PropTypes from 'prop-types';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import Divider from 'antd/es/divider';
import Avatar from 'antd/es/avatar';
import { useMediaQuery } from 'usehooks-ts';
import GlobalOutlined from '@ant-design/icons/GlobalOutlined';
import truncate from '../../../../utils/truncate';
import Button from '../../../Button/Button';
import ColorAvatar from '../../../ColorAvatar';
import sanitizeUrlHelper from '../../../../utils/sanitizeUrlHelper';
import styles from '../../styles.module.scss';
import EllipsisModal from '../../../Modals/EllipsisModal';

function PoliticanCard({
  politician,
  actions,
  preActions,
  isSelected,
}) {
  const isBigScreen = useMediaQuery('(min-width: 1600px)');
  return isBigScreen && !isSelected ? (
    <Card>
      <Flex align="stretch" vertical gap="16px">
        <Card.Meta
          title={(
            <Flex gap="12px" align="center">
              {politician.image ? (
                <Avatar size={64} src={politician.image} />
              ) : (
                <ColorAvatar size={64} name={politician.name} />
              )}
              {truncate(politician.name, 20)}
            </Flex>
          )}
          description={(
            <EllipsisModal
              title={politician.name}
              paragraph={politician.description}
            />
          )}
        />
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
      className={styles.candidate}
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
          description={(
            <EllipsisModal
              title={politician.name}
              paragraph={politician.description}
            />
          )}
        />
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
