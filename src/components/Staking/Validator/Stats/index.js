import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
} from 'recharts';
import { validatorSelectors } from '../../../../redux/selectors';
import { validatorActions } from '../../../../redux/actions';
import { grainsInDollar } from '../../../../utils/walletHelpers';

export default function Stats() {
  const dispatch = useDispatch();
  const stakerRewards = useSelector(validatorSelectors.stakerRewards);

  useEffect(() => {
    dispatch(validatorActions.getStakerRewards.call());
  }, [dispatch]);

  if (!stakerRewards?.length) return null;

  const data = stakerRewards.map(({ era, validators }) => ({
    era: `Era ${era.toNumber()}`,
    reward: Object.values(validators)[0].total.div(grainsInDollar).toNumber(),
  }));

  return (
    <div>
      <LineChart
        width={600}
        height={300}
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
    </div>
  );
}
