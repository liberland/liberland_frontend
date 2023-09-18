import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';

import { ReactComponent as CancelIcon } from '../../../assets/icons/cancel.svg';
import { ReactComponent as OkIcon } from '../../../assets/icons/green-check.svg';
import { TextInput } from '../../InputComponents';
import Button from '../../Button/Button';
import { officesActions, blockchainActions } from '../../../redux/actions';
import { officesSelectors, blockchainSelectors } from '../../../redux/selectors';
import styles from './styles.module.scss';
import Table from "../../Table";
import { ethers } from 'ethers';

function IdentityForm() {
  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
  } = useForm();

  const onSubmit = ({ account }) => {
    dispatch(officesActions.officeGetIdentity.call(account));
  };
  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.h3}>Verify citizenship request</div>

      <TextInput
        register={register}
        name="account"
        placeholder="Candidate's wallet address"
        required
      />

      <div className={styles.buttonWrapper}>
        <Button
          primary
          medium
          type="submit"
        >
          Fetch Identity data
        </Button>
      </div>
    </form>
  );
}

function MissingIdentity() {
  return 'This wallet has no identity set on the chain. Please contact wallet owner.';
}

function IdentityFlagAnalysis({ identity, field }) {
  let citizen_value = identity.info.additional.find(([key, _]) => key.eq(field));
  if (!citizen_value) return <div>MISSING <CancelIcon/></div>;

  [, citizen_value] = citizen_value;
  if (citizen_value.isRaw && citizen_value.eq('1')) {
    return <div><OkIcon /></div>;
  }
  return <div>INVALID <CancelIcon /></div>;
}

function parseEligibleOn(eligible_on) {
  const bytes = eligible_on.asRaw; // little-endian
  bytes.reverse(); // big-endian
  const hex = Buffer.from(bytes).toString('hex');
  return parseInt(hex, 16);
}

function EligibleOnAnalysis({ identity }) {
  let eligible_on = identity.info.additional.find(([key, _]) => key.eq('eligible_on'));
  if (!eligible_on) return <div>MISSING <CancelIcon /></div>;
  [, eligible_on] = eligible_on;
  if (!eligible_on.isRaw) return <div>INVALID <CancelIcon /></div>;

  const blockNumber = useSelector(blockchainSelectors.blockNumber);
  const [now,] = useState(new Date());
  const eligibleOnBlockNumber = parseEligibleOn(eligible_on);
  const msFromNow = (eligibleOnBlockNumber - blockNumber) * 6 * 1000;
  const eligibleOnDate = new Date(now.getTime() + msFromNow);

  return (
    <div>
      Candidate claims that they&apos;re 15 or older on date:<br />
      {eligibleOnDate.toString()}
    </div>
  );
}

function IdentityAnalysis({ identity }) {
  return (
    <Table
      columns={[
        {
          Header: "Citizenship eligibility analysis",
          accessor: "desc",
        },
        {
          Header: "",
          accessor: "res"
        }
      ]}
      data={[
        {
          "desc": "E-resident identity field",
          "res": <IdentityFlagAnalysis identity={identity} field={'eresident'}/>,
        },
        {
          "desc": "Citizen identity field",
          "res": <IdentityFlagAnalysis identity={identity} field={'citizen'}/>,
        },
        {
          "desc": <>Age check (<span className={styles.monospace}>eligible_on</span>)</>,
          "res": <EligibleOnAnalysis identity={identity} />,
        },
      ]}
    />
  );
}

function TokenTable({ backendMerits, backendDollars }) {
  return (
    <Table
      columns={[
        {
          Header: "User balance in centralized database",
          accessor: "desc",
        },
        {
          Header: "",
          accessor: "res"
        }
      ]}
      data={[
        {
          "desc": "LLM balance",
          "res": backendMerits ? ethers.utils.formatUnits(backendMerits, 12) : 0,
        },
        {
          "desc": "LLD balance",
          "res": backendDollars ? ethers.utils.formatUnits(backendDollars, 12) : 0,
        },
      ]}
    />
  );
}

function parseData(d) {
  if (d.isNone) return <em>&lt;empty&gt;</em>;
  if (!d.isRaw) return <em>&lt;unsupported type - not None nor Raw&gt;</em>;

  // we can assume it's raw
  const bytes = d.asRaw;
  // and we assume its utf-8
  return new TextDecoder("utf-8").decode(bytes);
}

function IdentityTable({ info }) {
  const columns = [
    {
      Header: "Field",
      accessor: "k"
    },
    {
      Header: "Value",
      accessor: "v"
    },
  ];

  const extra_additional = info.additional
    .filter((i) => {
      return !i[0].eq("citizen") && !i[0].eq("eligible_on") && !i[0].eq("eresident")
    })
    .map(([k, v]) => [parseData(k), parseData(v)]);

  const data = [
    { k: "Display name",  v: parseData(info.display) },
    { k: "Legal",         v: parseData(info.legal) },
    { k: "Web",           v: parseData(info.web) },
    { k: "Riot",          v: parseData(info.riot) },
    { k: "Email",         v: parseData(info.email) },
    { k: "PGP",           v: parseData(info.pgpFingerprint) },
    { k: "Image",         v: parseData(info.image) },
    { k: "Twitter",       v: parseData(info.twitter) },
    { k: "Custom fields", v: <pre>{JSON.stringify(extra_additional)}</pre> },
  ]

  return <Table columns={columns} data={data} />;
}

function IdentityInfo() {
  const dispatch = useDispatch();
  let { address, onchain, backend } = useSelector(officesSelectors.selectorIdentity);
  const sender = useSelector(blockchainSelectors.userWalletAddressSelector);

  if (onchain === null) return null;
  if (onchain.isNone) return <MissingIdentity />;

  onchain = onchain.unwrap();
  const { hash } = onchain.info;

  const backendMerits = backend?.merits ?? 0
  const backendDollars = backendMerits?.div(10);

  const onClick = () => {
    dispatch(officesActions.provideJudgementAndAssets.call({
      walletAddress: sender,
      address,
      uid: backend?.uid,
      hash,
      merits: backendMerits,
      dollars: backendDollars,
    }));
  };

  const judgements = onchain.judgements.filter((i) => i[0].eq(0)).map((i) => i[1]);
  const judgement = judgements.length > 0 ? judgements[0].toString() : "none";

  return (
    <>
      <div className={styles.identityInfo}>
        <div className={styles.h4}>Candidate's identity:</div>
        <IdentityTable info={onchain.info} />
        <IdentityAnalysis identity={onchain} />
        <TokenTable {...{ backendMerits, backendDollars }} />
        <div className={styles.h4}>Current status:</div>
        <div>
          Current judgement: {judgement}
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <Button
          primary
          medium
          onClick={onClick}
        >
          Provide KnownGood judgement and transfer LLM and LLD
        </Button>
      </div>
    </>
  );
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
