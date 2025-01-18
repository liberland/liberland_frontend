import React, { useMemo } from 'react';
import Collapse from 'antd/es/collapse';
import Card from 'antd/es/card';
import List from 'antd/es/list';
import Alert from 'antd/es/alert';
import Avatar from 'antd/es/avatar';
import Flex from 'antd/es/flex';
import Divider from 'antd/es/divider';
import Space from 'antd/es/space';
import Title from 'antd/es/typography/Title';
import { useMediaQuery } from 'usehooks-ts';
import { useHistory } from 'react-router-dom';
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import styles from './styles.module.scss';
import { useHideTitle } from '../../Layout/HideTitle';
import CopyInput from '../../CopyInput';
import { useCompanyDataFromUrl } from '../hooks';
import { getAvatarParameters } from '../../../utils/avatar';
import CompanyActions from '../CompanyActions';
import Button from '../../Button/Button';
import router from '../../../router';
import { tryFormatDollars, tryFormatNumber } from '../../../utils/walletHelpers';
import CompanyPersonas from '../CompanyPersonas';

function simplifyList(maybeList) {
  if (Array.isArray(maybeList)) {
    return maybeList.filter(Boolean).join(' ');
  }
  return maybeList;
}

function CompanyDetail() {
  const isLargerThanTable = useMediaQuery('(min-width: 1600px)');
  const { mainDataObject, request } = useCompanyDataFromUrl();
  const details = useMemo(() => mainDataObject?.dynamicFields.map((dynamicField) => {
    switch (dynamicField?.data?.length || 0) {
      case 0:
        return null;
      case 1:
        return {
          name: dynamicField?.name || '',
          display: dynamicField.data[0]?.display
            ? `${
              simplifyList(dynamicField.data[0].display)
            }${dynamicField.data[0]?.isEncrypted ? ' (Encrypted)' : ''}`
            : '',
        };
      default:
        return {
          name: dynamicField?.name || '',
          children: (dynamicField.data || []).map((formObject, index) => ({
            name: dynamicField?.name ? `${dynamicField.name} ${index + 1}` : index + 1,
            display: formObject?.display
              ? `${simplifyList(formObject.display)}${formObject.isEncrypted ? ' (Encrypted)' : ''}`
              : '',
          })),
        };
    }
  }).filter(Boolean).map(
    ({ name, ...rest }) => ({ name: name.replace(' (optional)', ''), ...rest }),
  ), [mainDataObject]);

  useHideTitle();
  const history = useHistory();

  if (!mainDataObject) {
    return <Alert type="error" message="Company data invalid!" />;
  }

  const { color, text } = getAvatarParameters(mainDataObject.name || mainDataObject.id || 'C');
  const fullLink = `${window.location.protocol}//${window.location.host}${router.companies.allCompanies}`;

  return (
    <>
      <Flex className={styles.top} wrap gap="15px" justify="space-between">
        <Button onClick={() => history.push(router.companies.allCompanies)}>
          <ArrowLeftOutlined />
          <Space />
          Back to All Companies
        </Button>
        <CopyInput buttonLabel="Copy link to company" value={fullLink} />
      </Flex>
      <Divider className={styles.divider} />
      <Flex wrap gap="15px" justify="space-between" align="center" className={styles.divider}>
        <Flex wrap gap="15px" align="center">
          {mainDataObject.logoURL ? (
            <Avatar size={70} src={mainDataObject.logoURL} />
          ) : (
            <Avatar size={70} style={{ backgroundColor: color }}>
              {text}
            </Avatar>
          )}

          <Flex vertical gap="15px">
            <Title level={1}>
              {mainDataObject.name}
            </Title>
            <Flex wrap gap="15px">
              <div className="description">
                Company ID:
                {' '}
                {mainDataObject.id || 'Unknown'}
              </div>
              <div className="description">
                Type:
                {' '}
                {mainDataObject.type || 'Liberland'}
              </div>
            </Flex>
          </Flex>
        </Flex>
        <Flex wrap gap="15px">
          <CompanyActions registeredCompany={mainDataObject} type={request ? 'detail-request' : 'detail'} />
        </Flex>
      </Flex>
      <Collapse
        collapsible="icon"
        defaultActiveKey={[
          'basic',
          'contacts',
          'address',
          'owners',
          'shareholders',
          'UBOs',
          'contracts',
          'assets',
          ...details.map(({ name }) => name),
        ]}
        items={[
          {
            key: 'basic',
            label: 'Basic information',
            children: (
              <Flex wrap gap="15px">
                <Card
                  className={styles.purpose}
                  title="Company description"
                  actions={mainDataObject.onlineAddresses?.map(
                    (address, index) => (
                      <Button
                        primary={index === 0}
                        href={address}
                      >
                        {address}
                      </Button>
                    ),
                  )}
                >
                  {mainDataObject.purpose || 'Unknown'}
                </Card>
                <Flex vertical gap="15px">
                  <Card title="Total capital amount">
                    {tryFormatDollars(mainDataObject.totalCapitalAmount)}
                    {' '}
                    {mainDataObject.totalCapitalCurrency}
                  </Card>
                  <Card title="Total number of shares">
                    {tryFormatNumber(mainDataObject.numberOfShares)}
                    <div className="description">
                      Distributed amongst
                      {' '}
                      {mainDataObject.shareholders?.length || 0}
                      {' '}
                      shareholder(s)
                    </div>
                  </Card>
                </Flex>
              </Flex>
            ),
          },
          {
            key: 'contacts',
            label: 'Contact information',
            children: (
              <List
                itemLayout="horizontal"
                grid={{ gutter: 16 }}
                dataSource={mainDataObject.contact}
                size="small"
                renderItem={(contact, index) => (
                  <List.Item className={styles.listItem}>
                    <List.Item.Meta
                      title={(
                        <Flex vertical gap="15px">
                          <div className="description">
                            {contact.includes('@') ? 'Email' : 'Telephone'}
                            {' '}
                            {index + 1}
                          </div>
                          {contact}
                        </Flex>
                      )}
                    />
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: 'address',
            label: 'Physical address(es)',
            children: (
              <List
                itemLayout="horizontal"
                grid={{ gutter: 16 }}
                dataSource={mainDataObject.physicalAddresses}
                size="small"
                renderItem={(address, index) => (
                  <List.Item className={styles.listItem}>
                    <List.Item.Meta
                      title={(
                        <Flex vertical gap="15px">
                          <div className="description">
                            Address
                            {' '}
                            {index + 1}
                            {index === 0 ? ' (primary)' : ''}
                          </div>
                          {address}
                        </Flex>
                      )}
                    />
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: 'owners',
            label: 'Company shareholder(s)',
            children: (
              <CompanyPersonas data={mainDataObject.principals} />
            ),
          },
          {
            key: 'shareholders',
            label: 'Company shareholder(s)',
            children: (
              <CompanyPersonas data={mainDataObject.shareholders} />
            ),
          },
          {
            key: 'UBOs',
            label: 'Ultimate beneficiary(es)',
            children: (
              <CompanyPersonas data={mainDataObject.UBOs} />
            ),
          },
          {
            key: 'contracts',
            label: 'Relevant on-chain contract(s)',
            children: (
              <List
                itemLayout={isLargerThanTable ? 'horizontal' : 'vertical'}
                dataSource={mainDataObject.relevantContracts}
                renderItem={({ contractId }) => {
                  const url = router.contracts.item.replace(':id', contractId);
                  return (
                    <List.Item
                      className={styles.listItem}
                      actions={[
                        <Button
                          link
                          href={url}
                          onClick={() => history.push(url)}
                        >
                          View contract
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        title={`Contract ID: ${contractId}`}
                      />
                    </List.Item>
                  );
                }}
              />
            ),
          },
          {
            key: 'assets',
            label: 'Relevant on-chain asset(s)',
            children: (
              <List
                itemLayout={isLargerThanTable ? 'horizontal' : 'vertical'}
                dataSource={mainDataObject.relevantAssets}
                renderItem={({ assetId }) => (
                  <List.Item className={styles.listItem}>
                    <List.Item.Meta
                      title={`Asset ID: ${assetId}`}
                    />
                  </List.Item>
                )}
              />
            ),
          },
          ...details.map(({ name, display, children }) => ({
            key: name,
            label: name,
            children: (
              children?.length ? (
                <List
                  grid={{ gutter: 16 }}
                  itemLayout={isLargerThanTable ? 'horizontal' : 'vertical'}
                  dataSource={children}
                  className={styles.listItem}
                  renderItem={({ name: subName, display: subDisplay }) => (
                    <List.Item>
                      <List.Item.Meta title={subName} description={subDisplay || 'None'} />
                    </List.Item>
                  )}
                />
              ) : (
                <Card>
                  <Card.Meta description={display || 'None'} />
                </Card>
              )
            ),
          })),
        ]}
      />
    </>
  );
}

export default CompanyDetail;
