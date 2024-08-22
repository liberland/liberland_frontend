import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import router from '../../router';
import { blockchainActions, walletActions } from '../../redux/actions';
import { blockchainSelectors, walletSelectors } from '../../redux/selectors';
import { decodeCall } from '../../api/nodeRpcCall';
import styles from './styles.module.scss';
import stylesAnim from '../Voting/Referendum/Items/item.module.scss';
import { formatAssets, formatDollars, formatMerits } from '../../utils/walletHelpers';
import formatDate from '../../utils/formatDate';
/* eslint-disable react/forbid-prop-types */
const ProposalProp = PropTypes.object;

function Raw({ proposal }) {
  return <pre className={styles.legislationContent}>{JSON.stringify(proposal.toHuman(), null, 2)}</pre>;
}

Raw.propTypes = { proposal: ProposalProp.isRequired };

function RepealLegislationSection({ proposal }) {
  const { args: [tier, { year, index }, section] } = proposal;
  return (
    <div>
      Repeal legislation
      {' '}
      <Link to={`${router.home.legislation}/${tier.toString()}`}>
        {tier.toString()}
        {' '}
        -
        {' '}
        {year.toNumber()}
        /
        {index.toNumber()}
        {' '}
        - Section #
        {section.toNumber()}
      </Link>
    </div>
  );
}
RepealLegislationSection.propTypes = { proposal: ProposalProp.isRequired };

function AddLegislation({ proposal, isDetailsHidden }) {
  const { args: [tier, { year, index }, sections] } = proposal;
  return (
    <div className={styles.text}>
      <p>
        Add new legislation
        {' '}
        <Link to={`${router.home.legislation}/${tier.toString()}`} className={styles.blue}>
          {tier.toString()}
        </Link>
        {' '}
        -
        {' '}
        {year.toNumber()}
        /
        {index.toNumber()}
        {!isDetailsHidden ? '.' : '...'}
      </p>
      <div className={cx(stylesAnim.anim, !isDetailsHidden ? stylesAnim.shown : stylesAnim.hidden)}>
        {sections.map((section, idx) => (
        // eslint-disable-next-line react/no-array-index-key
          <Fragment key={idx}>
            <p>
              Section #
              {idx}
            </p>
            <p className={styles.legislationContent}>{new TextDecoder('utf-8').decode(section)}</p>
          </Fragment>
        ))}
      </div>

    </div>
  );
}

AddLegislation.defaultProps = {
  isDetailsHidden: false,
};

AddLegislation.propTypes = {
  proposal: ProposalProp.isRequired,
  isDetailsHidden: PropTypes.bool,
};

function AmendLegislation({ proposal }) {
  const { args: [tier, { year, index }, section, newContent] } = proposal;
  return (
    <div>
      <p>
        Amend or add legislation section
        {' '}
        <Link to={`${router.home.legislation}/${tier.toString()}`}>
          {tier.toString()}
          {' '}
          -
          {' '}
          {year.toNumber()}
          /
          {index.toNumber()}
          {' '}
          - Section #
          {section.toNumber()}
        </Link>
        .
      </p>
      <p>New content:</p>
      <p className={styles.legislationContent}>{newContent.toHuman()}</p>
    </div>
  );
}
AmendLegislation.propTypes = { proposal: ProposalProp.isRequired };

function RepealLegislation({ proposal }) {
  const { args: [tier, { year, index }] } = proposal;
  return (
    <div>
      Repeal legislation
      {' '}
      <Link to={`${router.home.legislation}/${tier.toString()}`}>
        {tier.toString()}
        {' '}
        -
        {' '}
        {year.toNumber()}
        /
        {index.toNumber()}
      </Link>
    </div>
  );
}
RepealLegislation.propTypes = { proposal: ProposalProp.isRequired };

export function Preimage({ hash, len, isDetailsHidden }) {
  const dispatch = useDispatch();
  const [call, setCall] = useState(null);
  const preimages = useSelector(blockchainSelectors.preimages);
  const preimage = preimages[hash.toString()];

  useEffect(() => {
    if (!preimage) {
      dispatch(blockchainActions.fetchPreimage.call({
        hash,
        len,
      }));
    }
  }, [dispatch, preimage, hash, len]);

  useEffect(() => {
    (async () => {
      if (preimage && preimage.isSome && !call) {
        setCall(await decodeCall(preimage.unwrap()));
      }
    })();
  }, [preimage, call, setCall]);

  if (preimage === undefined) return <div>Loading details...</div>;
  if (preimage.isNone) {
    return (
      <div>
        Details not provided on-chain. Hash:
        {hash.toString()}
      </div>
    );
  }
  if (call === null) return <div>Loading details...</div>;

  return <Proposal proposal={call} isDetailsHidden={isDetailsHidden} />;
}

Preimage.propTypes = {
  hash: PropTypes.object.isRequired,
  len: PropTypes.object.isRequired,
  isDetailsHidden: PropTypes.bool.isRequired,
};

function FastTrackedReferendum({ proposal, fastTrack }) {
  const { hash_: hash, len } = proposal.args[0].asLookup;
  const [, votingPeriodInBlocks, enactmentPeriodInBlocks] = fastTrack.args;
  const votingPeriodInDays = (votingPeriodInBlocks.toNumber() * 6) / 3600 / 24;
  const enactmentPeriodInDays = (enactmentPeriodInBlocks.toNumber() * 6) / 3600 / 24;
  return (
    <div>
      Immediately start new referendum with shortened Referendum and/or Enactment Period.
      <ul>
        <li>
          Referendum Period:
          {votingPeriodInDays}
          {' '}
          day(s)
        </li>
        <li>
          Enactment Period:
          {enactmentPeriodInDays}
          {' '}
          day(s)
        </li>
        <li>
          <Preimage {...{ hash, len }} />
        </li>
      </ul>
    </div>
  );
}
FastTrackedReferendum.propTypes = { proposal: ProposalProp.isRequired, fastTrack: ProposalProp.isRequired };

function Referendum({ proposal }) {
  const { hash_: hash, len } = proposal.args[0].asLookup;
  return (
    <div>
      Propose a new referendum with simplified tally rules (simple majority of votes).
      <Preimage {...{ hash, len }} />
    </div>
  );
}
Referendum.propTypes = { proposal: ProposalProp.isRequired };

function BatchAll({ proposal }) {
  function fastTrackMatches(prop, fastTrack) {
    const fastTrackHash = fastTrack.args[0];
    const p = prop.args[0];
    if (p.isLookup) return p.asLookup.hash_.eq(fastTrackHash);

    // our FE only uses Lookup
    return false;
  }

  const { args: [calls] } = proposal;
  if (calls.length === 2
    && calls[0].section === 'democracy'
    && calls[0].method === 'externalPropose'
    && calls[1].section === 'democracy'
    && calls[1].method === 'fastTrack'
    && fastTrackMatches(calls[0], calls[1])) {
    return <FastTrackedReferendum proposal={calls[0]} fastTrack={calls[1]} />;
  }
  return calls.map((call, idx) => (
    // eslint-disable-next-line react/no-array-index-key
    <div key={`proposal ${idx}`}>
      <Proposal proposal={call} />
      <br />
    </div>
  ));
}
BatchAll.propTypes = { proposal: ProposalProp.isRequired };

function Blacklist({ proposal }) {
  const hash = proposal.args[0];
  return (
    <div>
      Blacklist and cancel referendum proposal.
      {' '}
      { proposal.args[1].isSome && `Cancel ongoing referendum #${proposal.args[1].unwrap().toString()}.`}
      <Preimage hash={hash} len={null} />
    </div>
  );
}
Blacklist.propTypes = { proposal: ProposalProp.isRequired };

function CouncilSenateExecute({ proposal }) {
  const { args: [calls] } = proposal;
  return (
    <div>
      Execute using
      {' '}
      {proposal.section === 'councilAccount' ? 'Congress' : 'Senate'}
      {' '}
      Wallet:
      <Proposal proposal={calls} />
    </div>
  );
}
CouncilSenateExecute.propTypes = { proposal: ProposalProp.isRequired };

function Schedule({ proposal }) {
  const { args } = proposal;
  return (
    <div>
      Schedule call to be made on
      {' '}
      {args[0].toString()}
      :
      <Proposal proposal={args[3]} />
    </div>
  );
}
Schedule.propTypes = { proposal: ProposalProp.isRequired };

function TransferLLD({ proposal }) {
  const accountId = proposal.args[0].value.toString();
  const value = proposal.args[1];
  const formattedValue = formatDollars(value);
  return (
    <div>
      {`Transfer ${formattedValue} (LLD) to ${accountId}`}
    </div>
  );
}
TransferLLD.propTypes = { proposal: ProposalProp.isRequired };

function TransferLLM({ proposal }) {
  const accountId = proposal.args[0].toString();
  const value = proposal.args[1];
  const formattedValue = formatMerits(value);
  const symbol = proposal.method === 'sendLlm' ? 'LLM' : 'PolitiPooled LLM';
  return (
    <div>
      {`Transfer ${formattedValue} (${symbol}) to ${accountId}`}
    </div>
  );
}
TransferLLM.propTypes = { proposal: ProposalProp.isRequired };

function TransferAsset({ proposal }) {
  const dispatch = useDispatch();
  const assetId = proposal.args[0];
  const target = proposal.args[1].toString();
  const value = proposal.args[2].toString();

  const additionalAssets = useSelector(walletSelectors.selectorAdditionalAssets);
  const [asset] = additionalAssets.filter((item) => item.index === Number(assetId));
  const formattedValue = asset ? formatAssets(value, asset?.metadata?.decimals) : value;

  useEffect(() => {
    dispatch(walletActions.getAdditionalAssets.call(true));
  }, [dispatch]);

  return (
    <div>
      {`Transfer ${formattedValue} (${asset?.metadata?.symbol || assetId}) to ${target}`}
    </div>
  );
}
TransferAsset.propTypes = { proposal: ProposalProp.isRequired };

function RemarkInfo({ proposal }) {
  const decoder = new TextDecoder();
  const jsonString = decoder.decode(proposal.args[0]);
  let parsedJson;
  try {
    parsedJson = JSON.parse(jsonString);
  } catch (err) {
    return (
      <div>
        {jsonString}
      </div>
    );
  }
  const {
    project,
    description,
    category,
    supplier,
    currency,
    date,
    finalDestination,
    amountInUsd,
  } = parsedJson;
  const dateTime = new Date(date);
  const formatedDate = formatDate(dateTime, false, false);
  return (
    <>
      <div>
        Category:
        {' '}
        {category}
      </div>
      <div>
        Project:
        {' '}
        {project}
      </div>
      <div>
        Supplier:
        {' '}
        {supplier}
      </div>
      <div>
        Desciption:
        {' '}
        {description}
      </div>
      <div>
        Currency:
        {' '}
        {currency}
      </div>
      <div>
        Amount in USD:
        {' '}
        {amountInUsd}
      </div>
      <div>
        Final Destination:
        {' '}
        {finalDestination}
      </div>
      <div>
        Date:
        {' '}
        {formatedDate}
      </div>
    </>
  );
}
RemarkInfo.propTypes = { proposal: ProposalProp.isRequired };

export function Proposal({ proposal, isDetailsHidden }) {
  const proposalMethod = proposal.method;
  const proposalSection = proposal.section;
  if (proposalMethod === 'repealLegislation') {
    return <RepealLegislation {...{ proposal }} />;
  } if (proposalMethod === 'repealLegislationSection') {
    return <RepealLegislationSection {...{ proposal }} />;
  } if (proposalMethod === 'amendLegislation') {
    return <AmendLegislation {...{ proposal }} />;
  } if (proposalMethod === 'addLegislation') {
    return <AddLegislation {...{ proposal }} isDetailsHidden={isDetailsHidden} />;
  } if (proposalMethod === 'batchAll') {
    return <BatchAll {...{ proposal }} />;
  } if (proposalMethod === 'externalProposeMajority') {
    return <Referendum {...{ proposal }} />;
  } if (proposalMethod === 'blacklist' && proposalSection === 'democracy') {
    return <Blacklist {...{ proposal }} />;
  } if (proposalMethod === 'execute' && (proposalSection === 'councilAccount' || proposalSection === 'senateAccount')) {
    return <CouncilSenateExecute {...{ proposal }} />;
  } if (proposalMethod === 'schedule' && proposalSection === 'scheduler') {
    return <Schedule {...{ proposal }} />;
  } if (proposalMethod === 'transfer' && proposalSection === 'balances') {
    return <TransferLLD {...{ proposal }} />;
  } if ((proposalMethod === 'sendLlmToPolitipool' || proposalMethod === 'sendLlm') && proposalSection === 'llm') {
    return <TransferLLM {...{ proposal }} />;
  } if (proposalMethod === 'transfer' && proposalSection === 'assets') {
    return <TransferAsset {...{ proposal }} />;
  } if (proposalMethod === 'remark' && proposalSection === 'llm') {
    return <RemarkInfo {...{ proposal }} />;
  }

  return <Raw {...{ proposal }} />;
}

Proposal.defaultProps = {
  isDetailsHidden: false,
};

Proposal.propTypes = {
  proposal: ProposalProp.isRequired,
  isDetailsHidden: PropTypes.bool,
};
