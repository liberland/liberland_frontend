import React from 'react';
import PropTypes from 'prop-types';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import liberlandEmblemImage from '../../../../assets/images/liberlandEmblem.svg';
import libertarianTorch from '../../../../assets/images/libertariantorch.png';
import CopyIconWithAddress from '../../../CopyIconWithAddress';
import styles from './styles.module.scss';
import truncate from '../../../../utils/truncate';
import Button from '../../../Button/Button';
import sanitizeUrlHelper from '../../../../utils/sanitizeUrlHelper';

function PoliticanCard({
  politician,
  actions,
}) {
  return (
    <Card
      size="small"
      title={(
        <Flex gap="4px">
          <img src={liberlandEmblemImage} alt="Liberland emblem" className={styles.icon} />
          {truncate(politician.name, 15)}
        </Flex>
      )}
      extra={(
        <Button link href={sanitizeUrlHelper(politician.website)}>
          Web
        </Button>
      )}
      cover={(
        <img src={libertarianTorch} alt="Libertarian torch" className={styles.torch} />
      )}
      actions={actions}
    >
      <Card.Meta
        description={(
          <CopyIconWithAddress
            isTruncate={!politician.name}
            name={politician.name}
            legal={politician.legal}
            address={politician.rawIdentity}
          />
        )}
      />
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
  actions: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default PoliticanCard;
