import React from 'react';
import PropTypes from 'prop-types';
import List from 'antd/es/list';
import Flex from 'antd/es/flex';
import Collapse from 'antd/es/collapse';
import Divider from 'antd/es/divider';
import Space from 'antd/es/space';
import Card from 'antd/es/card';
import Tag from 'antd/es/tag';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Avatar from 'antd/es/avatar';
import Markdown from 'markdown-to-jsx';
import { useMediaQuery } from 'usehooks-ts';
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CopyIconWithAddress from '../../CopyIconWithAddress';
import { deriveAndHideContractTitle } from '../utils';
import { useContractItem } from '../hooks';
import Button from '../../Button/Button';
import router from '../../../router';
import CopyInput from '../../CopyInput';
import { contractsActions } from '../../../redux/actions';
import { contractsSelectors } from '../../../redux/selectors';
import { useHideTitle } from '../../Layout/HideTitle';
import styles from './styles.module.scss';
import { getAvatarParameters } from '../../../utils/avatar';

function ContractItem({
  contractId,
  creator,
  data,
  parties,
  judgesSignaturesList,
  partiesSignaturesList,
  isMyContracts,
}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    identitiesContracts,
    infoContract,
    isContractSign,
    isMeSigned,
    isMeSignedAsJudge,
    setTitle,
    title,
  } = useContractItem({
    contractId,
    creator,
    judgesSignaturesList,
    parties,
    partiesSignaturesList,
  });
  const isUserJudge = useSelector(contractsSelectors.selectorIsUserJudgde);
  const isLargerThanHdScreen = useMediaQuery('(min-width: 1200px)');

  useHideTitle();

  const navigation = (
    <Flex wrap gap="15px" justify="space-between">
      <Button
        href={router.contracts.overview}
        onClick={() => {
          history.push(router.contracts.overview);
        }}
      >
        <ArrowLeftOutlined />
        <Space />
        Back to Contracts
      </Button>
      <CopyInput
        buttonLabel="Copy link to contract"
        value={`${window.location.protocol}//${window.location.host}${
          router.contracts.item.replace(':id', contractId)}`}
      />
    </Flex>
  );

  const actions = (
    <Flex wrap gap="15px">
      {!isMeSigned && (
        <Button
          primary
          onClick={() => dispatch(contractsActions.signContract.call({ contractId, isMyContracts }))}
        >
          Sign as a party
        </Button>
      )}

      {!isMeSignedAsJudge && isUserJudge && (
        <Button
          primary
          onClick={() => dispatch(
            contractsActions.signContractJudge.call({
              contractId,
              isMyContracts,
            }),
          )}
        >
          Sign as a judge
        </Button>
      )}

      {!isContractSign && (
        <Button
          red
          onClick={() => dispatch(contractsActions.removeContract.call({ contractId, isMyContracts }))}
        >
          Remove
        </Button>
      )}
    </Flex>
  );

  return (
    <Flex vertical className={styles.wrapper}>
      {navigation}
      <Divider className={styles.divider} />
      <Flex wrap gap="15px" className="description">
        <div>
          Contract ID:
          {' '}
          {contractId}
        </div>
        <div>
          Type: Open Contract
        </div>
      </Flex>
      <Flex wrap gap="15px" justify="space-between">
        <Title level={1}>
          {title}
        </Title>
        {actions}
      </Flex>
      <Collapse
        defaultActiveKey={['contract', 'relevant']}
        collapsible="icon"
        className={styles.collapse}
        items={[
          {
            key: 'contract',
            label: 'Contract content',
            children: (
              <Paragraph
                ref={(p) => deriveAndHideContractTitle(p, title, setTitle)}
              >
                <Markdown>{data}</Markdown>
              </Paragraph>
            ),
          },
          {
            key: 'relevant',
            label: 'Relevant parties',
            extra: actions,
            children: (
              <List
                grid={{ gutter: 16, column: isLargerThanHdScreen ? 3 : undefined }}
                dataSource={infoContract.filter(
                  ({ itemsOrItem }) => !Array.isArray(itemsOrItem) || itemsOrItem.length !== 0,
                ).reduce((items, { itemsOrItem, name }) => {
                  if (Array.isArray(itemsOrItem)) {
                    items.push(...itemsOrItem.map((item) => ({
                      name,
                      item,
                    })));
                  } else {
                    items.push({ item: itemsOrItem, name });
                  }
                  return items;
                }, [])}
                renderItem={({ item, name }) => {
                  const identity = identitiesContracts[item];
                  const color = (() => {
                    switch (name) {
                      case 'Creator':
                        return 'success';
                      case 'Judge':
                        return 'warning';
                      default:
                        return 'default';
                    }
                  })();
                  const { color: avatarColor, text } = getAvatarParameters(
                    identity?.identity?.legal || identity?.identity?.name || name,
                  );
                  return (
                    <Card
                      size="small"
                      className={styles.party}
                    >
                      <Card.Meta
                        title={(
                          <Flex wrap gap="15px" justify="space-between">
                            {identity?.identity?.legal || 'Unknown'}
                            <Tag color={color} className={styles.tag}>
                              {name}
                            </Tag>
                          </Flex>
                        )}
                        avatar={(
                          <Avatar style={{ backgroundColor: avatarColor }}>
                            {text}
                          </Avatar>
                        )}
                        description={(
                          <CopyIconWithAddress
                            address={item}
                          />
                        )}
                      />
                    </Card>
                  );
                }}
              />
            ),
          },
        ]}
      />
      {navigation}
    </Flex>
  );
}

ContractItem.defaultProps = {
  isMyContracts: false,
};

ContractItem.propTypes = {
  isMyContracts: PropTypes.bool,
  contractId: PropTypes.string.isRequired,
  creator: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
  parties: PropTypes.arrayOf(PropTypes.string).isRequired,
  judgesSignaturesList: PropTypes.arrayOf(PropTypes.string).isRequired,
  partiesSignaturesList: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ContractItem;
