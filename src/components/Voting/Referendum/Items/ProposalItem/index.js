import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { blake2AsHex } from '@polkadot/util-crypto';
import { hexToU8a, hexToString } from '@polkadot/util';
import Flex from 'antd/es/flex';
import Card from 'antd/es/card';
import classNames from 'classnames';
import Paragraph from 'antd/es/typography/Paragraph';
import { useHistory } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';
import Button from '../../../../Button/Button';
import CopyIconWithAddress from '../../../../CopyIconWithAddress';
import router from '../../../../../router';
import styles from '../../../styles.module.scss';
import Preimage from '../../../../Proposal/Preimage';

const getHashAndLength = (boundedCall) => {
  if (boundedCall.lookup) {
    return [boundedCall.lookup.hash, boundedCall.lookup.len];
  }
  if (boundedCall.legacy) {
    return [boundedCall.legacy.hash, 0];
  }
  return [blake2AsHex(hexToU8a(boundedCall.inline)), 0];
};

function ProposalItem({
  boundedCall,
}) {
  const [hash, len] = useMemo(() => getHashAndLength(boundedCall), [boundedCall]);
  const history = useHistory();
  const [title, setTitle] = useState('Proposal');

  const titleSetter = (paragraphRef) => {
    const firstTitle = paragraphRef?.querySelector('h1,h2,h3,h4,h5');
    const titleContents = firstTitle?.innerText;
    if (titleContents && title !== titleContents) {
      setTitle(titleContents);
    }
    firstTitle?.classList.add('hidden');
  };

  return (
    <Card
      size="small"
      className={styles.proposal}
    >
      <Flex wrap gap="20px" align="center">
        <Card.Meta
          title={(
            <Flex vertical gap="5px">
              {hash && (
                <div className="description">
                  <CopyIconWithAddress address={hash} />
                </div>
              )}
              <strong>
                {title}
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
                      <span ref={titleSetter}>
                        <Markdown>
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
        <Button onClick={() => history.push(router.voting.proposalItem.replace(':id', hash))}>
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
};

export default ProposalItem;
