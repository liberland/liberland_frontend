import React from 'react';
import PropTypes from 'prop-types';
import Table from '../../../Table';
import { parseLegal } from '../../../../utils/identityParser';

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

export default IdentityTable;
