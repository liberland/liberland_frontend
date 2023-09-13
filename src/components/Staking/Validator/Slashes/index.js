import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { formatDollars } from '../../../../utils/walletHelpers';
import { validatorSelectors } from '../../../../redux/selectors';
import { validatorActions } from '../../../../redux/actions';
import Table from '../../../Table';
import slashesIcon from '../../../../assets/icons/slashes.svg';
import styles from './styles.module.scss';

function SlashTable({ slashes }) {
  return (
    <Table
      columns={[
        {
          Header: 'Slash apply era',
          accessor: 'era',
        },
        {
          Header: 'Your slash amount (as validator)',
          accessor: 'validatorSlash',
        },
        {
          Header: 'Your slash amount (as nominator)',
          accessor: 'nominatorSlash',
        },
      ]}
      data={slashes.map(({ era, validatorSlash, nominatorSlash }) => ({
        era,
        validatorSlash: `${formatDollars(validatorSlash ?? 0)} LLD`,
        nominatorSlash: `${formatDollars(nominatorSlash ?? 0)} LLD`,
      }))}
    />
  );
}

SlashTable.propTypes = {
  slashes: PropTypes.arrayOf(
    PropTypes.shape({
      // eslint-disable-next-line react/forbid-prop-types
      era: PropTypes.any.isRequired,
      // eslint-disable-next-line react/forbid-prop-types
      validatorSlash: PropTypes.any.isRequired,
      // eslint-disable-next-line react/forbid-prop-types
      nominatorSlash: PropTypes.any.isRequired,
    }),
  ).isRequired,
};

export default function Slashes() {
  const dispatch = useDispatch();
  const appliedSlashes = useSelector(validatorSelectors.appliedSlashes);
  const unappliedSlashes = useSelector(validatorSelectors.unappliedSlashes);

  useEffect(() => {
    dispatch(validatorActions.getSlashes.call());
  }, [dispatch]);

  return (
    <>
      {(appliedSlashes?.length > 0 || unappliedSlashes?.length > 0) && (
        <div className={styles.headerWithIcon}>
          <img
            className={styles.slashesIcon}
            src={slashesIcon}
            width="16"
            alt=""
          />
          {' '}
          <h3>Slashes</h3>
        </div>
      )}
      <div className={styles.internalWrapper}>
        {appliedSlashes?.length > 0 && (
          <div>
            <h4>Applied slashes:</h4>
            <SlashTable slashes={appliedSlashes} />
          </div>
        )}
        {unappliedSlashes?.length > 0 && (
          <div>
            <h4>Unapplied slashes:</h4>
            <SlashTable slashes={unappliedSlashes} />
          </div>
        )}
      </div>
    </>
  );
}
