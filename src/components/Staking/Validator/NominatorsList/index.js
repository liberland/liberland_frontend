import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { validatorSelectors } from '../../../../redux/selectors';
import { validatorActions } from '../../../../redux/actions';
import { parseLegal, parseIdentityData } from '../../../../utils/identityParser';
import truncate from '../../../../utils/truncate';

function formatNominator({ address, identity }) {
  const display = parseIdentityData(identity?.display);
  if (display) return `${truncate(address, 13)} (${display})`;
  const legal = parseLegal(identity);
  if (legal) return `${truncate(address, 13)} (${legal})`;
  return truncate(address, 13);
}

export default function NominatorsList() {
  const dispatch = useDispatch();
  const nominators = useSelector(validatorSelectors.nominators);

  useEffect(() => {
    dispatch(validatorActions.getNominators.call());
  }, [dispatch]);

  return (
    <div>
      Nominated by:
      { nominators?.length > 0
        ? (
          <ul>
            {nominators.map((nominator) => <li key={nominator.address}>{formatNominator(nominator)}</li>)}
          </ul>
        )
        : ' Nobody'}
    </div>
  );
}
