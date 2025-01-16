import React from 'react';
import PropTypes from 'prop-types';
import List from 'antd/es/list';
import Flex from 'antd/es/flex';
import Title from 'antd/es/typography/Title';
import cx from 'classnames';
import Paragraph from 'antd/es/typography/Paragraph';
import { useHistory } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';
import { useDispatch } from 'react-redux';
import { useMediaQuery } from 'usehooks-ts';
import { deriveAndHideContractTitle } from '../utils';
import { useContractItem } from '../hooks';
import Button from '../../Button/Button';
import { contractsActions } from '../../../redux/actions';
import styles from './styles.module.scss';

function ContractItem({
  contractId,
  creator,
  data,
  parties,
  isOneItem,
  judgesSignaturesList,
  partiesSignaturesList,
  isMyContracts,
}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    isMeSigned,
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
  const isLargerThanTable = useMediaQuery('(min-width: 1600px)');
  const buttons = [
    <Button
      primary
      disabled={isMeSigned}
      key="party"
      onClick={() => dispatch(contractsActions.signContract.call({ contractId, isMyContracts }))}
    >
      Sign as a party
    </Button>,
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
      actions={isLargerThanTable ? buttons : [
        <Flex wrap gap="15px" className={styles.action}>
          {buttons}
        </Flex>,
      ]}
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
            <Title level={3} className={styles.title}>
              {title}
            </Title>
          </Flex>
        )}
      />
      <div className={styles.noHeading}>
        <Paragraph
          ref={(p) => deriveAndHideContractTitle(p, title, setTitle)}
          ellipsis={isOneItem ? undefined : {
            rows: 2,
          }}
          className={cx('description', styles.preview)}
        >
          <Markdown>
            {data}
          </Markdown>
        </Paragraph>
      </div>
    </List.Item>
  );
}

ContractItem.defaultProps = {
  isOneItem: false,
  isMyContracts: false,
};

ContractItem.propTypes = {
  isMyContracts: PropTypes.bool,
  contractId: PropTypes.string.isRequired,
  creator: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
  parties: PropTypes.arrayOf(PropTypes.string).isRequired,
  isOneItem: PropTypes.bool,
  judgesSignaturesList: PropTypes.arrayOf(PropTypes.string).isRequired,
  partiesSignaturesList: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ContractItem;
