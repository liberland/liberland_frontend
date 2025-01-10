import React, { useState } from 'react';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import Input from 'antd/es/input';
import { useDispatch, useSelector } from 'react-redux';
import { officesSelectors } from '../../../../redux/selectors';
import { fetchPendingIdentities } from '../../../../api/nodeRpcCall';
import { officesActions } from '../../../../redux/actions';
import FetchedItem from '../FetchedItem';
import styles from '../styles.module.scss';
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
    <div>
      <div>
        {pendingIdentities.map((pendingIdentity) => (
          <FetchedItem key={pendingIdentity.address} address={pendingIdentity.address} />
        ))}
        <Button className={styles.button} primary onClick={() => doFetchPendingIdentities()}>
          Fetch pending identities
        </Button>
        {pendingAdditionalMerits.map((pendingAdditionalMerit) => (
          <FetchedItem key={pendingAdditionalMerit.address} address={pendingAdditionalMerit.blockchainAddress} />
        ))}
        <Button
          className={styles.button}
          primary
          onClick={() => fetchPendingAdditionalMerits()}
        >
          Fetch pending additional merits
        </Button>
      </div>

      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="account"
          label="Verify citizenship request"
          rules={[
            { required: true },
            {
              validator: (v) => (
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
    </div>
  );
}
