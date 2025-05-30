import React, { useCallback, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Result from 'antd/es/result';
import Progress from 'antd/es/progress';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import Spin from 'antd/es/spin';
import { useInterval } from 'usehooks-ts';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useHideTitle } from '../../Layout/HideTitle';
import { walletSelectors } from '../../../redux/selectors';
import { walletActions } from '../../../redux/actions';
import CurrencyIcon from '../../CurrencyIcon';
import SendLLDModal from '../../Modals/SendLLDModal';
import CopyIconWithAddress from '../../CopyIconWithAddress';
import styles from './styles.module.scss';
import { parseDollars } from '../../../utils/walletHelpers';
import Button from '../../Button/Button';

const intervalInSeconds = 10;
const percentagePerSecond = 100 / intervalInSeconds;

export default function Gateway() {
  const { orderId } = useParams();
  const { search } = useLocation();
  const dispatch = useDispatch();
  const {
    price,
    toId,
    remark,
    callback,
    failure,
  } = useMemo(() => [
    'price',
    'toId',
    'callback',
    'remark',
    'failure',
  ].reduce((keys, urlKey) => {
    const value = new URLSearchParams(search).get(urlKey);
    if (value) {
      keys[urlKey] = decodeURIComponent(value);
    }
    return keys;
  }, {}), [search]);
  const paymentCreated = useSelector(walletSelectors.selectorPaymentCreated);
  const paymentSuccessful = useSelector(walletSelectors.selectorPaymentSuccess);
  const [seconds, setSeconds] = useState(intervalInSeconds);
  const [isStartedCount, setIsStartCount] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const startCount = useCallback(() => setIsStartCount(true), []);
  const setClosed = useCallback(() => setIsClosed(true), []);
  useHideTitle();
  useInterval(() => {
    setSeconds(seconds === 0 ? intervalInSeconds : seconds - 1);
  }, 1000);

  React.useEffect(() => {
    dispatch(walletActions.createPayment.call({
      orderId,
      price: parseDollars(price).toString(),
      toId,
      callback: process.env.REACT_APP_PAYMENT_CALLBACK,
    }));
  }, [callback, dispatch, orderId, price, toId]);

  React.useEffect(() => {
    if (isStartedCount && seconds === 0) {
      dispatch(
        walletActions.checkPayment.call({
          orderId,
          price: parseDollars(price).toString(),
          toId,
        }),
      );
    }
  }, [
    seconds,
    dispatch,
    orderId,
    price,
    toId,
    isStartedCount,
  ]);

  React.useEffect(() => {
    if (paymentSuccessful) {
      window.location.href = callback;
    }
  }, [paymentSuccessful, callback]);

  if (!callback || !price || !orderId || !toId) {
    return (
      <Result status="error" title="Malformed URL, contact admin" />
    );
  }

  const formRemark = remark || `Order ID: ${orderId}`;

  if (!paymentCreated) {
    return <Spin />;
  }

  if (paymentSuccessful) {
    return (
      <Result status="success" title="Payment processed, redirecting..." />
    );
  }

  return (
    <Result
      status="info"
      icon={<CurrencyIcon size={200} symbol="LLD" />}
      title={isStartedCount ? 'Processing payment' : `Please pay ${price} LLD`}
      className={styles.gateway}
      subTitle={(
        <>
          <Paragraph>
            {formRemark}
          </Paragraph>
          <Paragraph>
            <CopyIconWithAddress
              address={toId}
            />
          </Paragraph>
        </>
      )}
      extra={(
        <Flex vertical gap="20px">
          {isStartedCount && (
            <Progress
              percent={100 - seconds * percentagePerSecond}
              format={(percent) => (percent === 100 ? 'Checking...' : `Checking payment in ${seconds}s`)}
            />
          )}
          <Flex
            wrap
            justify="center"
            align="center"
            gap="15px"
            className={classNames({ hidden: !isClosed || isStartedCount })}
          >
            {failure && (
              <div>
                <Button red href={failure}>
                  Cancel payment
                </Button>
              </div>
            )}
            <SendLLDModal
              text="Send payment"
              primary
              initialValues={{
                recipient: toId,
                amount: price,
                remark: true,
                id: orderId,
                description: formRemark,
              }}
              isOpenOnRender
              onSuccess={startCount}
              onClose={setClosed}
            />
          </Flex>
        </Flex>
      )}
    />
  );
}
