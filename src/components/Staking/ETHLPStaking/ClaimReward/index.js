import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../../Button/Button';
import { getTokenStakeOperations } from '../../../../api/ethereum';
import styles from './styles.module.scss';

function ClaimReward({
    account
}) {
  const [success, setSuccess] = React.useState();
  const [loading, setLoading] = React.useState();
  const [error, setError] = React.useState();

  return (
    <div className={styles.rewards}>
      <Button primary small disabled={loading} onClick={async () => {
          const operations = getTokenStakeOperations(account);
          setLoading(true);
          setError(undefined);
          setSuccess(undefined);
          try {
            await operations.claimRewards();
            setSuccess('Rewards claimed successfully, click on refresh to see the result.');
          } catch (e) {
            setError('Something went wrong');
            console.error(e);
          } finally {
            setLoading(false);
          }
        }
      }>
          {loading ? 'Loading...' : 'Claim reward!'}
      </Button>
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
      {success && (
        <div className={styles.success}>
          {success}
        </div>
      )}
    </div>
  );
}

ClaimReward.propTypes = {
  account: PropTypes.string.isRequired,
};

export default ClaimReward;