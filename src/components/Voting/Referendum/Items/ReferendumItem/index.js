import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import Card from 'antd/es/card';
import Progress from 'antd/es/progress';
import { useMediaQuery } from 'usehooks-ts';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import Paragraph from 'antd/es/typography/Paragraph';
import { hexToString } from '@polkadot/util';
import Markdown from 'markdown-to-jsx';
import Alert from 'antd/es/alert';
import CopyIconWithAddress from '../../../../CopyIconWithAddress';
import { useTitleFromMarkdown } from '../hooks';
import styles from '../../../styles.module.scss';
import router from '../../../../../router';
import truncate from '../../../../../utils/truncate';
import Button from '../../../../Button/Button';

function ReferendumItem({
  voted,
  hash,
  proposal,
}) {
  const { yayVotes, nayVotes } = voted;
  const history = useHistory();
  const { title, setTitleFromRef } = useTitleFromMarkdown(true, 'Referendum');
  const linkTo = router.voting.referendumItem.replace(':referendumHash', hash);
  const isBigScreen = useMediaQuery('(min-width: 1200px)');
  const { args } = proposal.toJSON() || {};
  const { sections } = args || {};
  const [firstSection] = sections || [];

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
            <Alert.ErrorBoundary>
              <span ref={setTitleFromRef}>
                <Markdown>
                  {hexToString(firstSection) || ''}
                </Markdown>
              </span>
            </Alert.ErrorBoundary>
          </Paragraph>
        </Flex>
        <Flex vertical gap="5px">
          <Progress
            percent={100}
            success={{ percent: Math.round((100 * yayVotes) / (yayVotes + nayVotes)), strokeColor: '#7DC035' }}
            strokeColor="#FF0000"
          />
          <Flex gap="5px" wrap>
            <Flex wrap gap="5px">
              <strong className={styles.for}>For:</strong>
              <strong>
                {yayVotes}
                {' '}
                votes
              </strong>
            </Flex>
            <Flex wrap gap="5px">
              <strong className={styles.against}>Against:</strong>
              <strong>
                {nayVotes}
                {' '}
                votes
              </strong>
            </Flex>
          </Flex>
        </Flex>
        <Button href={linkTo} onClick={() => history.push(linkTo)}>
          Show more
        </Button>
      </Flex>
    </Card>
  );
}

const votesTypes = {
  yayVotes: PropTypes.number.isRequired,
  nayVotes: PropTypes.number.isRequired,
  votedTotal: PropTypes.number.isRequired,
};

ReferendumItem.propTypes = {
  voted: votesTypes.isRequired,
  hash: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  proposal: PropTypes.object.isRequired,
};

export default ReferendumItem;
