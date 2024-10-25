import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { ethSelectors } from '../../../../redux/selectors';
import Button from '../../../Button/Button';
import { getTokenStakeOperations } from '../../../../api/ethereum';
import styles from './styles.module.scss';

function ClaimReward({
  account,
  erc20Address,
}) {
  const [success, setSuccess] = React.useState();
  const [loading, setLoading] = React.useState();
  const [error, setError] = React.useState();
  const connected = useSelector(ethSelectors.selectorConnected);

  return (
    <div className={styles.rewards}>
      <Button
        primary
        small
        disabled={loading}
        onClick={async () => {
          const signer = await connected.provider.getSigner(account);
          const operations = getTokenStakeOperations(signer, erc20Address);
          setLoading(true);
          setError(undefined);
          setSuccess(undefined);
          try {
            await operations.claimRewards();
            setSuccess('Rewards claimed successfully, click on refresh to see the result.');
          } catch (e) {
            setError('Something went wrong');
            // eslint-disable-next-line no-console
            console.error(e);
          } finally {
            setLoading(false);
          }
        }}
      >
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
  erc20Address: PropTypes.string.isRequired,
};

export default ClaimReward;
