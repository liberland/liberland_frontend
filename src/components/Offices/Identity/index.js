import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';

import { ethers } from 'ethers';
import PropTypes from 'prop-types';
import { ReactComponent as CancelIcon } from '../../../assets/icons/cancel.svg';
import { ReactComponent as OkIcon } from '../../../assets/icons/green-check.svg';
import { TextInput } from '../../InputComponents';
import Button from '../../Button/Button';
import { officesActions } from '../../../redux/actions';
import {
  officesSelectors,
  blockchainSelectors,
} from '../../../redux/selectors';
import styles from './styles.module.scss';
import Table from '../../Table';
import {parseIdentityData, parseLegal} from '../../../utils/identityParser';
import { isValidSubstrateAddress } from '../../../utils/bridge';
import {fetchPendingIdentities} from "../../../api/nodeRpcCall";
import {parseDollars, parseMerits} from "../../../utils/walletHelpers";

function IdentityForm() {
  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: 'all',
  });

  const [pendingIdentities, setPendingIdentities] = useState([]);

  const doFetchPendingIdentities = async () => {
    const pendingIdentities = await fetchPendingIdentities()
    setPendingIdentities(pendingIdentities)
  }
  const onSubmit = ({ account }) => {
    console.log('submitting')
    dispatch(officesActions.officeGetIdentity.call(account));
  };
  return (
    <div>
      <div>
        {pendingIdentities.map(pendingIdentity => {
          return (<div>{pendingIdentity.address}
            <button onClick={
              () => {
                console.log('fetching')
                dispatch(officesActions.officeGetIdentity.call(pendingIdentity.address))
              }}>fetch</button></div>)
        })}
        <Button primary medium onClick={() => doFetchPendingIdentities()}>
          Fetch pending identities
        </Button>
      </div>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.h3}>Verify citizenship request</div>

        <TextInput
          register={register}
          name="account"
          placeholder="Candidate's wallet address"
          validate={(v) => isValidSubstrateAddress(v) || 'Invalid Address'}
          required
        />
        {errors?.account?.message
        && <div className={styles.error}>{errors.account.message}</div>}

        <div className={styles.buttonWrapper}>
          <Button primary medium type="submit">
            Fetch Identity data
          </Button>
        </div>
      </form>
    </div>

  );
}

function MissingIdentity() {
  return 'This wallet has no identity set on the chain. Please contact wallet owner.';
}

function IdentityFlagAnalysis({ identity, field }) {
  let citizen_value = identity.info.additional.find(([key, _]) => key.eq(field));
  if (!citizen_value) {
    return (
      <div>
        MISSING
        <CancelIcon />
      </div>
    );
  }

  [, citizen_value] = citizen_value;
  if (citizen_value.isRaw && citizen_value.eq('1')) {
    return (
      <div>
        <OkIcon />
      </div>
    );
  }
  return (
    <div>
      INVALID
      <CancelIcon />
    </div>
  );
}

IdentityFlagAnalysis.propTypes = {
  identity: PropTypes.instanceOf(Map).isRequired,
  field: PropTypes.string.isRequired,
};

function parseEligibleOn(eligible_on) {
  const bytes = eligible_on.asRaw; // little-endian
  bytes.reverse(); // big-endian
  const hex = Buffer.from(bytes).toString('hex');
  return parseInt(hex, 16);
}

function EligibleOnAnalysis({ identity }) {
  let eligible_on = identity.info.additional.find(([key, _]) => key.eq('eligible_on'));
  if (!eligible_on) {
    return (
      <div>
        MISSING
        <CancelIcon />
      </div>
    );
  }
  [, eligible_on] = eligible_on;
  if (!eligible_on.isRaw) {
    return (
      <div>
        INVALID
        <CancelIcon />
      </div>
    );
  }

  EligibleOnAnalysis.propTypes = {
    identity: PropTypes.instanceOf(Map).isRequired,
  };

  const blockNumber = useSelector(blockchainSelectors.blockNumber);
  const [now] = useState(new Date());
  const eligibleOnBlockNumber = parseEligibleOn(eligible_on);
  const msFromNow = (eligibleOnBlockNumber - blockNumber) * 6 * 1000;
  const eligibleOnDate = new Date(now.getTime() + msFromNow);

  return (
    <div>
      Candidate claims that they&apos;re 15 or older on date:
      <br />
      {eligibleOnDate.toString()}
    </div>
  );
}

function IdentityAnalysis({ identity }) {
  return (
    <Table
      columns={[
        {
          Header: 'Citizenship eligibility analysis',
          accessor: 'desc',
        },
        {
          Header: '',
          accessor: 'res',
        },
      ]}
      data={[
        {
          desc: 'E-resident identity field',
          res: <IdentityFlagAnalysis identity={identity} field="eresident" />,
        },
        {
          desc: 'Citizen identity field',
          res: <IdentityFlagAnalysis identity={identity} field="citizen" />,
        },
        {
          desc: (
            <>
              Age check
              <span className={styles.monospace}>eligible_on</span>
            </>
          ),
          res: <EligibleOnAnalysis identity={identity} />,
        },
      ]}
    />
  );
}

IdentityAnalysis.propTypes = {
  identity: PropTypes.instanceOf(Map).isRequired,
};

function TokenTable({ backendMerits, backendDollars }) {
  return (
    <Table
      columns={[
        {
          Header: 'User balance in centralized database',
          accessor: 'desc',
        },
        {
          Header: '',
          accessor: 'res',
        },
      ]}
      data={[
        {
          desc: 'LLM ICM balance',
          res: backendMerits ? ethers.utils.formatUnits(backendMerits, 12) : 0,
        },
        {
          desc: 'LLD ICM balance',
          res: backendDollars ? ethers.utils.formatUnits(backendDollars, 12) : 0,
        },
      ]}
    />
  );
}

TokenTable.propTypes = {
  backendMerits: PropTypes.instanceOf(ethers.BigNumber).isRequired,
  backendDollars: PropTypes.instanceOf(ethers.BigNumber).isRequired,
};

function parseData(d) {
  if (d.isNone) return <em>&lt;empty&gt;</em>;
  if (!d.isRaw) return <em>&lt;unsupported type - not None nor Raw&gt;</em>;

  // we can assume it's raw
  const bytes = d.asRaw;
  // and we assume its utf-8
  return new TextDecoder('utf-8').decode(bytes);
}

function IdentityTable({ info }) {
  const columns = [
    {
      Header: 'Field',
      accessor: 'k',
    },
    {
      Header: 'Value',
      accessor: 'v',
    },
  ];

  const extra_additional = info.additional
    .filter(
      (i) => !i[0].eq('citizen')
        && !i[0].eq('eligible_on')
        && !i[0].eq('eresident')
        && !i[0].eq('legal'),
    )
    .map(([k, v]) => [parseData(k), parseData(v)]);

  const data = [
    { k: 'Display name', v: parseData(info.display) },
    { k: 'Legal', v: parseLegal(info) ?? <em>&lt;empty&gt;</em> },
    { k: 'Web', v: parseData(info.web) },
    { k: 'Riot', v: parseData(info.riot) },
    { k: 'Email', v: parseData(info.email) },
    { k: 'PGP', v: parseData(info.pgpFingerprint) },
    { k: 'Image', v: parseData(info.image) },
    { k: 'Twitter', v: parseData(info.twitter) },
    { k: 'Custom fields', v: <pre>{JSON.stringify(extra_additional)}</pre> },
  ];

  return <Table columns={columns} data={data} />;
}

IdentityTable.propTypes = {
  info: PropTypes.instanceOf(Map).isRequired,
};

function IdentityInfo() {
  const identity = useSelector(officesSelectors.selectorIdentity);
  if (identity.onchain === null) return null;
  if (identity.onchain.isNone) return <MissingIdentity />;

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
        <div className={styles.h4}>Candidate&apos;s identity:</div>
        <IdentityTable info={onchain.info} />
        <IdentityAnalysis identity={onchain} />
        <TokenTable {...{ backendMerits, backendDollars }} />
        <div className={styles.h4}>Current status:</div>
        <div>
          Current judgement:
          {judgement}
        </div>
      </div>
     <SubmitForm backendMerits={backendMerits} backendDollars={backendDollars} identity={identity} hash={hash}/>

    </>
  );
}

function SubmitForm({identity, backendMerits, backendDollars, hash}) {
  const dispatch = useDispatch();
  const sender = useSelector(blockchainSelectors.userWalletAddressSelector);
  const defaultValues = {
    amountLLM: ethers.utils.formatUnits(backendMerits, 12),
    amountLLD: ethers.utils.formatUnits(backendDollars, 12),
  };
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    mode: 'all', defaultValues
  });



  const provideJudgementAndSendTokens = (values) => {
    dispatch(
      officesActions.provideJudgementAndAssets.call({
        walletAddress: sender,
        address: identity.address,
        uid: identity.backend?.uid,
        hash,
        merits: parseMerits(values.amountLLM),
        dollars: parseDollars(values.amountLLD),
      }),
    );
  };

  return (
    <form onSubmit={handleSubmit(provideJudgementAndSendTokens)}>
      <TextInput
        register={register}
        name="amountLLM"
        placeholder="Amount LLM"
        required
      />
      <TextInput
        register={register}
        name="amountLLD"
        placeholder="Amount LLD"
        required
      />
      <div className={styles.buttonWrapper}>
        <Button primary medium type="submit">
          Provide KnownGood judgement and transfer LLM and LLD
        </Button>
      </div>
    </form>
  )
}

function Identity() {
  return (
    <>
      <IdentityForm />
      <IdentityInfo />
    </>
  );
}

export default Identity;
