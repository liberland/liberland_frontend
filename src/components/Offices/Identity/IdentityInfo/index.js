import React from 'react';
import { useSelector } from 'react-redux';
import Title from 'antd/es/typography/Title';
import { officesSelectors } from '../../../../redux/selectors';
import IdentityTable from '../IdentityTable';
import IdentityAnalysis from '../IdentityAnalysis';
import TokenTable from '../TokenTable';
import SubmitForm from '../SubmitForm';
import styles from '../styles.module.scss';

function IdentityInfo() {
  const identity = useSelector(officesSelectors.selectorIdentity);
  if (identity.onchain === null) return null;
  if (identity.onchain.isNone) {
    return (
      <>
        This wallet has no identity set on the chain. Please contact wallet owner.
      </>
    );
  }

  const onchain = identity.onchain.unwrap();
  const { hash } = onchain.info;

  const backendMerits = identity.backend?.merits ?? 0;
  const backendDollars = identity.backend?.dollars ?? 0;

  const judgements = onchain.judgements
    .filter((i) => i[0].eq(0))
    .map((i) => i[1]);
  const judgement = judgements.length > 0 ? judgements[0].toString() : 'none';

  return (
    <>
      <div className={styles.identityInfo}>
        <Title level={4}>Candidate&apos;s identity:</Title>
        <IdentityTable info={onchain.info} />
        <IdentityAnalysis identity={onchain} />
        <TokenTable
          backendMerits={backendMerits}
          backendDollars={backendDollars}
        />
        <Title level={4}>Current status:</Title>
        <div>
          Current judgement:
          {judgement}
        </div>
      </div>
      <SubmitForm
        backendMerits={backendMerits}
        backendDollars={backendDollars}
        identity={identity}
        hash={hash}
      />
    </>
  );
}

export default IdentityInfo;
