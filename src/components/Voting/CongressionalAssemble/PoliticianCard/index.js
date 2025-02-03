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
      title={(
        <Flex wrap gap="15px" align="center">
          {isBigScreen && preActions?.length ? (
            <Flex wrap gap="15px">
              {preActions}
            </Flex>
          ) : null}
          <ColorAvatar size={32} name={politician.name} />
          <Flex vertical gap="15px">
            {truncate(politician.name, 15)}
            <CopyIconWithAddress
              address={politician.rawIdentity}
            />
          </Flex>
        </Flex>
      )}
      extra={(
        <Button href={sanitizeUrlHelper(politician.website)}>
          <GlobalOutlined aria-label="Web" />
          {isElected && (
            <img src={libertarianTorch} alt="Libertarian torch" className={styles.torch} />
          )}
        </Button>
      )}
      actions={[...(!isBigScreen && preActions?.length ? preActions : []), ...actions]}
    />
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
