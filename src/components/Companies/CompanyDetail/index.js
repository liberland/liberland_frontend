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
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
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

function simplifyCompanyObject(company) {
  const copy = JSON.parse(JSON.stringify(company), (_, value) => {
    if (typeof value === 'object' && value?.value) {
      return value?.value;
    }
    return value;
  });
  return copy;
}

function CompanyDetail() {
  const { mainDataObject: complexDataObject, request } = useCompanyDataFromUrl();
  const mainDataObject = useMemo(() => simplifyCompanyObject(complexDataObject || {}), [complexDataObject]);

  useHideTitle();
  const history = useHistory();

  if (!mainDataObject) {
    return <Alert type="error" message="Company data invalid!" />;
  }

  const { color, text } = getAvatarParameters(mainDataObject.name || mainDataObject.id || 'C');
  const fullLink = `${window.location.protocol}//${window.location.host}${router.companies.allCompanies}`;

  return (
    <div className={styles.container}>
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

          <Flex vertical gap="5px">
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
            <Title level={1} className={styles.title}>
              {mainDataObject.name}
            </Title>
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
                  actions={[
                    <Flex className={styles.online} wrap gap="15px" justify="start">
                      {mainDataObject.onlineAddresses?.map(
                        ({ description, url }, index) => (
                          <Button
                            primary={index === 0}
                            key={url}
                            onClick={() => {
                              window.location.href = url;
                            }}
                          >
                            {description}
                          </Button>
                        ),
                      )}
                    </Flex>,
                  ]}
                >
                  <div className={styles.purposeText}>
                    {mainDataObject.purpose || 'Unknown'}
                  </div>
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
                grid={{ gutter: 16, column: 3 }}
                className="threeColumnList"
                dataSource={mainDataObject.contact}
                size="small"
                renderItem={({ contact }, index) => (
                  <List.Item>
                    <Card
                      size="small"
                      classNames={{
                        header: styles.header,
                      }}
                      title={(
                        <div className="description">
                          {contact.includes('@') ? 'Email' : 'Telephone'}
                          {' '}
                          {index + 1}
                        </div>
                      )}
                    >
                      <strong>
                        {contact}
                      </strong>
                    </Card>
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
                grid={{ gutter: 16, column: 3 }}
                className="threeColumnList"
                dataSource={mainDataObject.physicalAddresses}
                size="small"
                renderItem={({
                  description,
                  street,
                  city,
                  subdivision,
                  postalCode,
                  country,
                }, index) => (
                  <List.Item>
                    <Card
                      size="small"
                      classNames={{
                        header: styles.header,
                      }}
                      title={(
                        <div className="description">
                          Address
                          {' '}
                          {index + 1}
                          {index === 0 ? ' (primary)' : ''}
                        </div>
                      )}
                    >
                      <Flex vertical gap="5px">
                        <strong>
                          {street}
                          {subdivision ? `, ${subdivision}` : ''}
                        </strong>
                        <strong>
                          {city}
                          {', '}
                          {postalCode}
                        </strong>
                        <strong>
                          {country || ''}
                        </strong>
                        <strong>
                          {description || ''}
                        </strong>
                      </Flex>
                    </Card>
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
                itemLayout="horizontal"
                grid={{ gutter: 16, column: 3 }}
                className="threeColumnList"
                dataSource={mainDataObject.relevantContracts}
                size="small"
                renderItem={({ contractId }) => {
                  const url = router.contracts.item.replace(':id', contractId);
                  return (
                    <List.Item>
                      <Card
                        size="small"
                        classNames={{
                          header: classNames(styles.header, styles.view),
                          body: styles.noLine,
                        }}
                        extra={(
                          <Button
                            href={url}
                            onClick={() => history.push(url)}
                          >
                            View contract
                          </Button>
                        )}
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
                itemLayout="horizontal"
                grid={{ gutter: 16, column: 3 }}
                className="threeColumnList"
                dataSource={mainDataObject.relevantAssets}
                size="small"
                renderItem={({ assetId }) => (
                  <List.Item>
                    <Card
                      size="small"
                      classNames={{
                        header: classNames(styles.header, styles.view),
                        body: styles.noLine,
                      }}
                      title={`Asset ID: ${assetId}`}
                    />
                  </List.Item>
                )}
              />
            ),
          },
        ]}
      />
    </div>
  );
}

export default CompanyDetail;
