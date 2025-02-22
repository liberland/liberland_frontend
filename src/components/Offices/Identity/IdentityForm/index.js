import React, { useState } from 'react';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import Input from 'antd/es/input';
import List from 'antd/es/list';
import Card from 'antd/es/card';
import Divider from 'antd/es/divider';
import { useDispatch, useSelector } from 'react-redux';
import { officesSelectors } from '../../../../redux/selectors';
import { fetchPendingIdentities } from '../../../../api/nodeRpcCall';
import { officesActions } from '../../../../redux/actions';
import Button from '../../../Button/Button';
import { isValidSubstrateAddress } from '../../../../utils/walletHelpers';

export default function IdentityForm() {
  const pendingAdditionalMerits = useSelector(officesSelectors.selectorPendingAdditionalMerits);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [pendingIdentities, setPendingIdentities] = useState([]);

  const doFetchPendingIdentities = async () => {
    const fetchedPendingIdentities = await fetchPendingIdentities();
    setPendingIdentities(fetchedPendingIdentities);
  };
  const onSubmit = ({ account }) => {
    dispatch(officesActions.officeGetIdentity.call(account));
  };

  const fetchPendingAdditionalMerits = () => {
    dispatch(officesActions.getPendingAdditionalMerits.call());
  };

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      <Card
        title="Pending identities"
        actions={[
          <Button primary onClick={() => doFetchPendingIdentities()}>
            Fetch pending identities
          </Button>,
        ]}
      >
        <List
          dataSource={pendingIdentities}
          locale={{ emptyText: 'Click on pending identities to refresh list' }}
          renderItem={(pendingIdentity) => (
            <List.Item
              actions={[
                <Button onClick={() => dispatch(officesActions.officeGetIdentity.call(pendingIdentity.address))}>
                  Fetch
                </Button>,
              ]}
            >
              <List.Item.Meta title={pendingIdentity.address} />
            </List.Item>
          )}
        />
      </Card>
      <Divider />
      <Card
        title="Pending additional merits"
        actions={[
          <Button primary onClick={() => fetchPendingAdditionalMerits()}>
            Fetch additional merits
          </Button>,
        ]}
      >
        <List
          dataSource={pendingAdditionalMerits}
          locale={{ emptyText: 'Click on pending merits to refresh list' }}
          renderItem={(pedingAdditionalMerit) => (
            <List.Item
              actions={[
                <Button
                  onClick={() => dispatch(
                    officesActions.officeGetIdentity.call(pedingAdditionalMerit.blockchainAddress),
                  )}
                >
                  Fetch
                </Button>,
              ]}
            >
              <List.Item.Meta title={pedingAdditionalMerit.blockchainAddress} />
            </List.Item>
          )}
        />
      </Card>
      <Divider />
      <Form.Item
        name="account"
        label="Verify citizenship request"
        rules={[
          { required: true },
          {
            validator: (_, v) => (
              isValidSubstrateAddress(v) ? Promise.resolve : Promise.reject('Invalid Address')
            ),
          },
        ]}
      >
        <Input placeholder="Candidate's wallet address" />
      </Form.Item>
      <Flex wrap gap="15px">
        <Button link href={`${process.env.REACT_APP_SSO_API_ADMIN_LINK}`}>admin login</Button>
        <Button primary type="submit">
          Fetch Identity data
        </Button>
      </Flex>
    </Form>
  );
}
