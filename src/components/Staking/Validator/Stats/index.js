import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import Result from 'antd/es/result';
import { validatorSelectors } from '../../../../redux/selectors';
import { validatorActions } from '../../../../redux/actions';
import { formatDollars } from '../../../../utils/walletHelpers';
import styles from './styles.module.scss';

export default function Stats() {
  const dispatch = useDispatch();
  const stakerRewards = useSelector(validatorSelectors.stakerRewards);

  useEffect(() => {
    dispatch(validatorActions.getStakerRewards.call());
  }, [dispatch]);

  if (!stakerRewards?.length) {
    return <Result status={404} title="No rewards found" />;
  }
  const data = stakerRewards.map(({ era, validators }) => ({
    era: `Era ${era.toNumber()}`,
    reward: parseFloat(formatDollars(Object.values(validators)[0].total)),
  }));

  return (
    <div className={styles.chart}>
      <ResponsiveContainer height={300} width="100%">
        <LineChart
          data={data}
          margin={{
            top: 5, right: 20, bottom: 5, left: 0,
          }}
        >
          <Line type="monotone" dataKey="reward" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="era" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
