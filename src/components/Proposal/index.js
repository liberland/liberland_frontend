import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import router from '../../router';
import { blockchainActions } from '../../redux/actions';
import { blockchainSelectors } from '../../redux/selectors';
import { decodeCall } from '../../api/nodeRpcCall';
import styles from './styles.module.scss';

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

function AddLegislation({ proposal }) {
  const { args: [tier, { year, index }, sections] } = proposal;
  return (
    <div>
      <p>
        Add new legislation
        {' '}
        <Link to={`${router.home.legislation}/${tier.toString()}`}>
          {tier.toString()}
        </Link>
        {' '}
        -
        {year.toNumber()}
        /
        {index.toNumber()}
        .
      </p>
      {sections.map((section, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={idx}>
          <p>
            Section #
            {idx}
          </p>
          <p className={styles.legislationContent}>{section.toHuman()}</p>
        </Fragment>
      ))}
    </div>
  );
}
AddLegislation.propTypes = { proposal: ProposalProp.isRequired };

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
        {year.toNumber()}
        /
        {index.toNumber()}
      </Link>
    </div>
  );
}
RepealLegislation.propTypes = { proposal: ProposalProp.isRequired };

export function Preimage({ hash, len }) {
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

  return <Proposal proposal={call} />;
}
Preimage.propTypes = {
  hash: PropTypes.object.isRequired,
  len: PropTypes.object.isRequired,
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
  // eslint-disable-next-line react/no-array-index-key
  return calls.map((call, idx) => <Proposal key={idx} proposal={call} />);
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

export function Proposal({ proposal }) {
  if (proposal.method === 'repealLegislation') {
    return <RepealLegislation {...{ proposal }} />;
  } if (proposal.method === 'repealLegislationSection') {
    return <RepealLegislationSection {...{ proposal }} />;
  } if (proposal.method === 'amendLegislation') {
    return <AmendLegislation {...{ proposal }} />;
  } if (proposal.method === 'addLegislation') {
    return <AddLegislation {...{ proposal }} />;
  } if (proposal.method === 'batchAll') {
    return <BatchAll {...{ proposal }} />;
  } if (proposal.method === 'externalProposeMajority') {
    return <Referendum {...{ proposal }} />;
  } if (proposal.method === 'blacklist' && proposal.section === 'democracy') {
    return <Blacklist {...{ proposal }} />;
  }

  return <Raw {...{ proposal }} />;
}
Proposal.propTypes = { proposal: ProposalProp.isRequired };
