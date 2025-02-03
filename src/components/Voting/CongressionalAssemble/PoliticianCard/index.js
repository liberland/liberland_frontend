import React from 'react';
import PropTypes from 'prop-types';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import { useMediaQuery } from 'usehooks-ts';
import GlobalOutlined from '@ant-design/icons/GlobalOutlined';
import CopyIconWithAddress from '../../../CopyIconWithAddress';
import libertarianTorch from '../../../../assets/images/libertariantorch.png';
import truncate from '../../../../utils/truncate';
import Button from '../../../Button/Button';
import ColorAvatar from '../../../ColorAvatar';
import sanitizeUrlHelper from '../../../../utils/sanitizeUrlHelper';
import styles from '../../styles.module.scss';

function PoliticanCard({
  politician,
  actions,
  preActions,
  isElected,
}) {
  const isBigScreen = useMediaQuery('(min-width: 1200px)');
  return (
    <Card
      size="small"
      className={styles.candidate}
    >
      <Flex wrap gap="15px" align="center">
        {isBigScreen && preActions?.length ? (
          <Flex wrap gap="15px">
            {preActions}
          </Flex>
        ) : null}
        <ColorAvatar size={50} name={politician.name} />
        <Flex vertical flex={1} gap="5px">
          <strong>
            {truncate(politician.name, 15)}
          </strong>
          <div className="description">
            <CopyIconWithAddress
              address={politician.rawIdentity}
            />
          </div>
        </Flex>
        <Flex wrap gap="15px" align="center" justify="end">
          {!isBigScreen && preActions?.length ? preActions : null}
          {actions}
          <Button href={sanitizeUrlHelper(politician.website)}>
            <GlobalOutlined aria-label="Web" />
          </Button>
          {isElected && (
            <img src={libertarianTorch} alt="Libertarian torch" className={styles.torch} />
          )}
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
  actions: PropTypes.arrayOf(PropTypes.node).isRequired,
  isElected: PropTypes.bool,
};

export default PoliticanCard;
