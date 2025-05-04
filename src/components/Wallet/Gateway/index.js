import React, { useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Result from 'antd/es/result';
import Spin from 'antd/es/spin';
import Progress from 'antd/es/progress';
import Flex from 'antd/es/flex';
import Paragraph from 'antd/es/typography/Paragraph';
import { useInterval } from 'usehooks-ts';
import { useDispatch, useSelector } from 'react-redux';
import { useHideTitle } from '../../Layout/HideTitle';
import { walletSelectors } from '../../../redux/selectors';
import { walletActions } from '../../../redux/actions';
import CurrencyIcon from '../../CurrencyIcon';
import SendLLDModal from '../../Modals/SendLLDModal';
import CopyIconWithAddress from '../../CopyIconWithAddress';
import styles from './styles.module.scss';

const intervalInSeconds = 10;
const percentagePerSecond = 100 / intervalInSeconds;

export default function Gateway() {
  const { orderId } = useParams();
  const { search } = useLocation();
  const dispatch = useDispatch();
  const callback = useMemo(() => decodeURIComponent(new URLSearchParams(search).get('callback')), [search]);
  const amount = useMemo(() => new URLSearchParams(search).get('amount'), [search]);
  const remark = useMemo(() => decodeURIComponent(new URLSearchParams(search).get('remark')), [search]);
  const paymentCreated = useSelector(walletSelectors.selectorPaymentCreated);
  const paymentSuccessful = useSelector(walletSelectors.selectorPaymentSuccess);
  const [seconds, setSeconds] = useState(intervalInSeconds);
  useHideTitle();
  useInterval(() => {
    setSeconds(seconds === 0 ? intervalInSeconds : seconds - 1);
  }, 1000);

  React.useEffect(() => {
    if (orderId && callback && amount) {
      dispatch(walletActions.createPayment.call({ orderId, amount, callback }));
    }
  }, [amount, callback, dispatch, orderId]);

  React.useEffect(() => {
    if (paymentSuccessful) {
      window.location.href = callback;
    }
  }, [paymentSuccessful, callback]);

  if (!callback || !amount || !orderId) {
    return (
      <Result status="error" title="Malformed URL, contact admin" />
    );
  }

  if (!paymentCreated) {
    return (
      <Result status="info" icon={<Spin />} title="Generating payment gateway" />
    );
  }

  if (paymentSuccessful) {
    return (
      <Result status="success" title="Payment processed, redirecting..." />
    );
  }

  const formRemark = remark || `Order ID: ${orderId}`;

  return (
    <Result
      status="info"
      icon={<CurrencyIcon size={200} symbol="LLD" />}
      title={`Please pay ${amount} LLD`}
      className={styles.gateway}
      subTitle={(
        <>
          <Paragraph>
            {formRemark}
          </Paragraph>
          <Paragraph>
            <CopyIconWithAddress
              address={paymentCreated.payment_account}
            />
          </Paragraph>
        </>
      )}
      extra={(
        <Flex vertical gap="20px" justify="center" align="center">
          <Progress
            percent={100 - seconds * percentagePerSecond}
            format={(percent) => (percent === 100 ? 'Checking...' : `Checking payment in ${seconds}s`)}
          />
          <div>
            <SendLLDModal
              text="Pay now!"
              primary
              initialValues={{
                recipient: paymentCreated.payment_account,
                amount,
                remark: true,
                id: orderId,
                description: formRemark,
              }}
            />
          </div>
        </Flex>
      )}
    />
  );
}
