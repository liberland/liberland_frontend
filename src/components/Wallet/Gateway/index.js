import React, { useCallback, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Result from 'antd/es/result';
import Progress from 'antd/es/progress';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
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
  } = useMemo(() => [
    'price',
    'toId',
    'callback',
    'remark',
  ].reduce((keys, urlKey) => {
    keys[urlKey] = decodeURIComponent(new URLSearchParams(search).get(urlKey));
    return keys;
  }, {}), [search]);
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
    if (isStartedCount || seconds === 0) {
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
          <div className={classNames({ hidden: !isClosed || isStartedCount })}>
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
          </div>
        </Flex>
      )}
    />
  );
}
