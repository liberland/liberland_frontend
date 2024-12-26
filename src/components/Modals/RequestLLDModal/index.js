import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from 'usehooks-ts';
import QRCode from 'antd/es/qr-code';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import List from 'antd/es/list';
import InputNumber from 'antd/es/input-number';
import TextArea from 'antd/es/input/TextArea';
import PropTypes from 'prop-types';
import ModalRoot from '../ModalRoot';
import Button from '../../Button/Button';
import { identitySelectors } from '../../../redux/selectors';
import { identityActions } from '../../../redux/actions';
import { formatDollars, parseDollars } from '../../../utils/walletHelpers';
import Table from '../../Table';
import ButtonArrowIcon from '../../../assets/icons/button-arrow.svg';
import router from '../../../router';
import styles from './styles.module.scss';
import CopyLink from './CopyLink';

function RequestLLDModal({
  onClose,
  walletAddress,
}) {
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const identity = useSelector(identitySelectors.selectorIdentity);
  const identityIsLoading = useSelector(identitySelectors.selectorIsLoading);
  const [linkData, setLinkData] = useState();

  useEffect(() => {
    if (walletAddress) {
      dispatch(identityActions.getIdentity.call(walletAddress));
    }
  }, [dispatch, walletAddress]);

  const onSubmit = async ({ amount, note }) => {
    try {
      const realAmount = parseDollars(amount).toString();
      const data = window.btoa(JSON.stringify({
        amount: realAmount,
        note,
        recipient: walletAddress,
      }));
      const link = `${window.location.protocol}//${window.location.host}${router.wallet.payMe}?data=${data}`;
      const subwalletLink = `https://mobile.subwallet.app/browser?url=${window.encodeURIComponent(link)}`;
      const edgeLink = `https://deep.edge.app/pay/liberland/${walletAddress}?amount=${realAmount}`;
      setLinkData({
        amount: realAmount,
        note,
        link,
        subwalletLink,
        edgeLink,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const isLargerThanTable = useMediaQuery('(min-width: 768px)');

  if (identityIsLoading) {
    return <div className={styles.form}>Loading...</div>;
  }

  const { info } = identity?.unwrap() || {};
  const displayName = info?.display?.toHuman()?.Raw || walletAddress || 'No name';
  const submitText = linkData ? 'Update payment link' : 'Create payment link';

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      className={styles.form}
    >
      {linkData && (
        <div>
          {isLargerThanTable ? (
            <div className={styles.tableContainer}>
              <Table
                columns={[
                  {
                    Header: 'Link',
                    accessor: 'name',
                  },
                  {
                    Header: '',
                    accessor: 'value',
                  },
                  {
                    Header: 'QR code',
                    accessor: 'qr',
                  },
                ]}
                data={[
                  {
                    name: 'Direct link',
                    value: <CopyLink link={linkData.link} />,
                    qr: <QRCode value={linkData.link} />,
                  },
                  {
                    name: 'Subwallet link',
                    value: <CopyLink link={linkData.subwalletLink} />,
                    qr: <QRCode value={linkData.subwalletLink} />,
                  },
                  {
                    name: 'Edge link',
                    value: <CopyLink link={linkData.edgeLink} />,
                    qr: <QRCode value={linkData.edgeLink} />,
                  },
                ]}
              />
            </div>
          ) : (
            <div className={styles.listContainer}>
              <List
                itemLayout="vertical"
                size="large"
                header="Payment links"
                dataSource={[
                  {
                    title: 'Direct',
                    content: (
                      <CopyLink link={linkData.link} />
                    ),
                  },
                  {
                    title: 'Subwallet',
                    content: (
                      <CopyLink link={linkData.subwalletLink} />
                    ),
                  },
                  {
                    title: 'Edge',
                    content: (
                      <CopyLink link={linkData.edgeLink} />
                    ),
                  },
                ]}
                renderItem={({ title, content }) => (
                  <List.Item>
                    <List.Item.Meta title={title} />
                    {content}
                  </List.Item>
                )}
              />
              <List
                header="Payment QR codes"
                dataSource={[
                  {
                    title: 'Direct',
                    extra: <QRCode value={linkData.link} />,
                  },
                  {
                    title: 'Subwallet',
                    extra: <QRCode value={linkData.subwalletLink} />,
                  },
                  {
                    title: 'Edge',
                    extra: <QRCode value={linkData.edgeLink} />,
                  },
                ]}
                renderItem={({ title, extra }) => (
                  <List.Item extra={extra}>
                    <List.Item.Meta title={title} />
                  </List.Item>
                )}
              />
            </div>
          )}
          <div className={styles.tableContainer}>
            <Table
              columns={[
                {
                  Header: 'Payment information',
                  accessor: 'name',
                },
                {
                  Header: '',
                  accessor: 'value',
                },
              ]}
              data={[
                {
                  name: 'Recipient',
                  value: displayName,
                },
                {
                  name: 'Amount',
                  value: `${formatDollars(linkData.amount, true)} LLD`,
                },
              ].concat(linkData.note ? [{
                name: 'Note',
                value: linkData.note,
              }] : [])}
            />
          </div>
        </div>
      )}
      <Form.Item
        label="Requested payment amount in LLD"
        name="amount"
        rules={[
          { required: true },
          { pattern: /^\d*\.?\d+$/, message: 'Must be a number' },
        ]}
      >
        <InputNumber placeholder="LLD" stringMode controls={false} />
      </Form.Item>
      <Form.Item
        label="Note"
        name="note"
        extra="Optional"
      >
        <TextArea className={styles.textarea} />
      </Form.Item>
      <Flex wrap gap="15px">
        <Button medium onClick={onClose}>
          Close
        </Button>
        <Button
          primary
          medium
          type="submit"
        >
          {submitText}
        </Button>
      </Flex>
    </Form>
  );
}

RequestLLDModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  walletAddress: PropTypes.string.isRequired,
};

function RequestLLDModalWrapper(props) {
  const [show, setShow] = useState();
  return (
    <>
      <Button className={styles.button} onClick={() => setShow(true)}>
        Request LLD
        <img src={ButtonArrowIcon} className={styles.arrowIcon} alt="button icon" />
      </Button>
      {show && (
        <ModalRoot>
          <RequestLLDModal {...props} onClose={() => setShow(false)} />
        </ModalRoot>
      )}
    </>
  );
}

export default RequestLLDModalWrapper;
