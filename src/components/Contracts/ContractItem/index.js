import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import List from 'antd/es/list';
import Flex from 'antd/es/flex';
import Collapse from 'antd/es/collapse';
import Divider from 'antd/es/divider';
import Space from 'antd/es/space';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import LeftOutlined from '@ant-design/icons/LeftOutlined';
import Markdown from 'react-markdown';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deriveAndHideContractTitle } from '../utils';
import { useContractItem } from '../hooks';
import Button from '../../Button/Button';
import router from '../../../router';
import CopyInput from '../../CopyInput';
import { contractsActions, identityActions } from '../../../redux/actions';
import { contractsSelectors, identitySelectors } from '../../../redux/selectors';
import { useHideTitle } from '../../Layout/HideTitle';
import styles from './styles.module.scss';
import PersonBox from '../../PersonBox';

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
  const identities = useSelector(identitySelectors.selectorIdentityMotions);
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
  const signatories = useMemo(() => infoContract.filter(
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
  }, []), [infoContract]);
  useEffect(() => {
    dispatch(identityActions.getIdentityMotions.call(signatories.map(({ item }) => item)));
  }, [dispatch, signatories]);

  const isUserJudge = useSelector(contractsSelectors.selectorIsUserJudgde);

  useHideTitle();

  const navigation = (
    <Flex wrap gap="15px" justify="space-between">
      <Button
        href={router.contracts.overview}
        onClick={() => {
          history.goBack();
        }}
      >
        <LeftOutlined />
        <Space />
        Back
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
    <Flex vertical className={styles.wrapper} gap="20px">
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
        <Title level={1} className={styles.title}>
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
                <Markdown skipHtml>{data}</Markdown>
              </Paragraph>
            ),
          },
          {
            key: 'relevant',
            label: 'Relevant parties',
            extra: actions,
            children: (
              <List
                grid={{ gutter: 16, column: 3 }}
                className="threeColumnList"
                dataSource={signatories}
                renderItem={({ item, name }) => {
                  const contractIdentity = identitiesContracts[item];
                  const color = (() => {
                    switch (name) {
                      case 'Creator':
                        return 'success';
                      case 'Judges Signatures':
                        return 'warning';
                      default:
                        return 'default';
                    }
                  })();
                  const displayName = contractIdentity?.identity?.name
                    || contractIdentity?.identity?.legal
                    || identities?.[item]?.identity?.name
                    || identities?.[item]?.identity?.legal
                    || 'Unknown';

                  return (
                    <PersonBox
                      address={item}
                      displayName={displayName}
                      role={{
                        color,
                        name,
                      }}
                    />
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
