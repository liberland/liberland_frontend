import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { hexToString } from '@polkadot/util';
import Flex from 'antd/es/flex';
import Card from 'antd/es/card';
import { useMediaQuery } from 'usehooks-ts';
import classNames from 'classnames';
import Paragraph from 'antd/es/typography/Paragraph';
import { useHistory } from 'react-router-dom';
import Markdown from 'react-markdown';
import Button from '../../../../Button/Button';
import CopyIconWithAddress from '../../../../CopyIconWithAddress';
import router from '../../../../../router';
import styles from '../../../styles.module.scss';
import Preimage from '../../../../Proposal/Preimage';
import { getHashAndLength } from '../ProposalPage/utils';
import { useTitleFromMarkdown } from '../hooks';
import truncate from '../../../../../utils/truncate';

function ProposalItem({
  boundedCall,
  id,
}) {
  const [hash, len] = useMemo(() => getHashAndLength(boundedCall), [boundedCall]);
  const history = useHistory();
  const { title, setTitleFromRef } = useTitleFromMarkdown(true, 'Proposal');
  const linkTo = router.voting.proposalItem.replace(':id', id);
  const isBigScreen = useMediaQuery('(min-width: 1200px)');

  return (
    <Card
      size="small"
      className={styles.proposal}
    >
      <Flex vertical={!isBigScreen} wrap gap="20px" align={isBigScreen ? 'center' : undefined}>
        <Card.Meta
          className={styles.cardTitle}
          title={(
            <Flex vertical gap="5px">
              {hash && (
                <div className="description">
                  <CopyIconWithAddress address={hash} />
                </div>
              )}
              <strong>
                {truncate(title, 30)}
              </strong>
            </Flex>
          )}
        />
        <Flex flex={1}>
          <Paragraph ellipsis={{ rows: 2 }} className={classNames('description', styles.intro)}>
            {hash && len ? (
              <Preimage hash={hash} len={len}>
                {(proposal) => {
                  const { args } = proposal.toJSON() || {};
                  const { sections } = args || {};
                  const [firstSection] = sections || [];
                  try {
                    return (
                      <span ref={setTitleFromRef}>
                        <Markdown skipHtml>
                          {hexToString(firstSection) || ''}
                        </Markdown>
                      </span>
                    );
                  } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error(e);
                  }
                  return null;
                }}
              </Preimage>
            ) : null}
          </Paragraph>
        </Flex>
        <Button href={linkTo} onClick={() => history.push(linkTo)}>
          Show more
        </Button>
      </Flex>
    </Card>
  );
}

const call = PropTypes.oneOfType([
  PropTypes.shape({
    legacy: PropTypes.shape({
      hash: PropTypes.string.isRequired,
    }).isRequired,
  }),
  PropTypes.shape({
    lookup: PropTypes.shape({
      hash: PropTypes.string.isRequired,
      len: PropTypes.number.isRequired,
    }).isRequired,
  }),
  PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    inline: PropTypes.any.isRequired,
  }),
]);

ProposalItem.propTypes = {
  boundedCall: call.isRequired,
  id: PropTypes.number.isRequired,
};

export default ProposalItem;
