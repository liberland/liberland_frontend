import React from 'react';
import PropTypes from 'prop-types';
import List from 'antd/es/list';
import Flex from 'antd/es/flex';
import cx from 'classnames';
import Paragraph from 'antd/es/typography/Paragraph';
import { useHistory } from 'react-router-dom';
import Markdown from 'react-markdown';
import { useMediaQuery } from 'usehooks-ts';
import { deriveAndHideContractTitle } from '../utils';
import { useContractItem } from '../hooks';
import Button from '../../Button/Button';
import styles from './styles.module.scss';

function ContractListItem({
  contractId,
  creator,
  data,
  parties,
  judgesSignaturesList,
  partiesSignaturesList,
}) {
  const history = useHistory();
  const {
    routerLink,
    setTitle,
    title,
  } = useContractItem({
    contractId,
    creator,
    judgesSignaturesList,
    parties,
    partiesSignaturesList,
  });
  const isLargerThanHdScreen = useMediaQuery('(min-width: 1600px)');
  const buttons = [
    <Button
      href={routerLink}
      onClick={() => {
        history.push(routerLink);
      }}
      key="more"
    >
      Show more
    </Button>,
  ];

  return (
    <List.Item
      actions={isLargerThanHdScreen ? buttons : undefined}
      className={styles.listItem}
    >
      <List.Item.Meta
        title={(
          <Flex vertical gap="5px">
            <div className="description">
              Contract ID:
              {' '}
              {contractId}
            </div>
            {title && (
              <strong className={styles.title}>
                {title}
              </strong>
            )}
          </Flex>
        )}
      />
      <Flex vertical gap="20px" className={styles.noHeading}>
        <Paragraph
          ref={(p) => deriveAndHideContractTitle(p, title, setTitle)}
          ellipsis={{
            rows: 2,
          }}
          className={cx('description', styles.preview)}
        >
          <Markdown skipHtml>
            {data}
          </Markdown>
        </Paragraph>
        {!isLargerThanHdScreen && (
          <Flex wrap gap="15px" className={styles.action}>
            {buttons}
          </Flex>
        )}
      </Flex>
    </List.Item>
  );
}

ContractListItem.propTypes = {
  contractId: PropTypes.string.isRequired,
  creator: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
  parties: PropTypes.arrayOf(PropTypes.string).isRequired,
  judgesSignaturesList: PropTypes.arrayOf(PropTypes.string).isRequired,
  partiesSignaturesList: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ContractListItem;
