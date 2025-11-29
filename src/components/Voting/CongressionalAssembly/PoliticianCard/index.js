import React from 'react';
import PropTypes from 'prop-types';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import Divider from 'antd/es/divider';
import { useMediaQuery } from 'usehooks-ts';
import GlobalOutlined from '@ant-design/icons/GlobalOutlined';
import truncate from '../../../../utils/truncate';
import Button from '../../../Button/Button';
import ColorAvatar from '../../../ColorAvatar';
import ColorCover from '../../../ColorCover';
import sanitizeUrlHelper from '../../../../utils/sanitizeUrlHelper';
import styles from '../../styles.module.scss';
import EllipsisModal from '../../../Modals/EllipsisModal';

function PoliticanCard({
  politician,
  actions,
  preActions,
  isSelected,
}) {
  const isBiggerThanMobile = useMediaQuery('(min-width: 576px)');
  const isBigScreen = useMediaQuery('(min-width: 1600px)');
  return isBigScreen && !isSelected ? (
    <Card
      cover={<ColorCover name={politician.name} width={200} height={300} />}
    >
      <Flex align="stretch" vertical gap="16px">
        <Card.Meta
          title={truncate(politician.name, 30)}
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
      cover={<ColorCover name={politician.name} width="100%" height={5} />}
    >
      <Flex vertical gap="15px">
        <Flex wrap gap="15px" align="center">
          <ColorAvatar size={isBiggerThanMobile ? 56 : 24} name={politician.name} />
          <Flex vertical flex={1} gap="5px">
            <strong>
              {truncate(politician.name, 15)}
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
