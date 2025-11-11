import React from 'react';
import PropTypes from 'prop-types';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import Divider from 'antd/es/divider';
import Badge from 'antd/es/badge';
import { useMediaQuery } from 'usehooks-ts';
import GlobalOutlined from '@ant-design/icons/GlobalOutlined';
import CopyIconWithAddress from '../../../CopyIconWithAddress';
import libertarianTorch from '../../../../assets/images/libertariantorch.png';
import truncate from '../../../../utils/truncate';
import Button from '../../../Button/Button';
import ColorAvatar from '../../../ColorAvatar';
import ColorCover from '../../../ColorCover';
import sanitizeUrlHelper from '../../../../utils/sanitizeUrlHelper';
import styles from '../../styles.module.scss';

function PoliticanCard({
  politician,
  actions,
  preActions,
  isElected,
}) {
  const isBiggerThanMobile = useMediaQuery('(min-width: 576px)');
  const isBigScreen = useMediaQuery('(min-width: 1600px)');
  return (
    <Badge.Ribbon
      rootClassName={styles.ribbon}
      text={(
        <Flex gap="8px" align="center">
          <img
            src={libertarianTorch}
            alt="Libertarian torch"
            className={styles.torch}
          />
          {isElected ? 'Elected' : 'Candidate'}
        </Flex>
      )}
      color="#1677ff"
    >
      {isBigScreen ? (
        <Card
          cover={<ColorCover name={politician.name} width={200} height={300} />}
        >
          <Flex align="stretch" vertical gap="16px">
            <Card.Meta
              title={truncate(politician.name, 30)}
              description={(
                <CopyIconWithAddress
                  address={politician.rawIdentity}
                />
              )}
            />
            <Divider />
            <Flex wrap gap="16px" align="center">
              {preActions}
              {politician.website ? (
                <Button primary href={sanitizeUrlHelper(politician.website)} newTab>
                  <Flex gap="15px" align="center">
                    <GlobalOutlined aria-label="Web" />
                    Learn more
                  </Flex>
                </Button>
              ) : <div />}
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
              {isBiggerThanMobile && (
                <ColorAvatar size={50} name={politician.name} />
              )}
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
              <img src={libertarianTorch} alt="Libertarian torch" className={styles.torch} />
            </Flex>
            <Flex wrap gap="15px" align="center">
              {politician.website && (
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
      )}
    </Badge.Ribbon>
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
