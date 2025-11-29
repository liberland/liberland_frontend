import React from 'react';
import PropTypes from 'prop-types';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import Divider from 'antd/es/divider';
import Avatar from 'antd/es/avatar';
import Image from 'antd/es/image';
import { useMediaQuery } from 'usehooks-ts';
import GlobalOutlined from '@ant-design/icons/GlobalOutlined';
import truncate from '../../../../utils/truncate';
import Button from '../../../Button/Button';
import ColorAvatar from '../../../ColorAvatar';
import ColorCover from '../../../ColorCover';
import sanitizeUrlHelper from '../../../../utils/sanitizeUrlHelper';
import styles from '../../styles.module.scss';
import EllipsisModal from '../../../Modals/EllipsisModal';
import XProvider from '../../../XProvider';

function PoliticanCard({
  politician,
  actions,
  preActions,
  isSelected,
}) {
  const isBiggerThanMobile = useMediaQuery('(min-width: 576px)');
  const isBigScreen = useMediaQuery('(min-width: 1600px)');
  return (
    <XProvider handle={politician.x}>
      {(data) => {
        const {
          description,
          profile_banner_url,
          profile_image_url,
        } = data || {};

        const cover = profile_banner_url
          ? <Image src={profile_banner_url} width={200} height={300} />
          : <ColorCover name={politician.name} width={200} height={300} />;
        const mobileCover = profile_banner_url
          ? <Image preview={false} height={20} src={profile_banner_url} />
          : <ColorCover name={politician.name} width="100%" height={20} />;

        const pfp = profile_image_url
          ? <Avatar size={56} src={profile_image_url} />
          : <ColorAvatar size={56} name={politician.name} />;
        const pfpMobile = profile_image_url
          ? <Avatar size={isBiggerThanMobile ? 56 : 24} src={profile_image_url} />
          : <ColorAvatar size={isBiggerThanMobile ? 56 : 24} name={politician.name} />;

        return isBigScreen && !isSelected ? (
          <Card
            cover={cover}
          >
            <Flex align="stretch" vertical gap="16px">
              <Card.Meta
                title={(
                  <Flex gap="12px" align="center">
                    {pfp}
                    {truncate(politician.name, 30)}
                  </Flex>
                )}
                description={(
                  <EllipsisModal
                    title={politician.name}
                    paragraph={[politician.description, description].filter(Boolean).join('---')}
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
            cover={mobileCover}
          >
            <Flex vertical gap="15px">
              <Flex wrap gap="15px" align="center">
                {pfpMobile}
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
      }}
    </XProvider>
  );
}

PoliticanCard.propTypes = {
  politician: PropTypes.shape({
    name: PropTypes.string,
    legal: PropTypes.string,
    website: PropTypes.string,
    description: PropTypes.string,
    x: PropTypes.string,
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
