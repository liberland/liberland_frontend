import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Dropdown from 'antd/es/dropdown';
import Space from 'antd/es/space';
import DownOutlined from '@ant-design/icons/DownOutlined';
import Button from '../../../Button/Button';
import router from '../../../../router';

function ExistingMotionsAndReferendums({ motion, referendum, proposal }) {
  const history = useHistory();

  const items = [
    motion && (
      <Button onClick={() => history.push(`${router.congress.motions}#${motion}`)}>
        Repeal motion
      </Button>
    ),
    referendum && (
      <Button onClick={() => history.push(`${router.voting.referendum}#${referendum}`)}>
        Repeal referendum
      </Button>
    ),
    proposal && (
      <Button onClick={() => history.push(`${router.voting.referendum}#${proposal}`)}>
        Repeal proposal
      </Button>
    ),
  ].filter(Boolean).map((label, key) => ({
    label,
    key,
  }));

  return (
    <Dropdown
      menu={{
        items,
      }}
      disabled={!items.length}
      trigger={['click']}
    >
      <Button primary disabled={!items.length}>
        Repeal
        <Space />
        <DownOutlined />
      </Button>
    </Dropdown>
  );
}

ExistingMotionsAndReferendums.propTypes = {
  motion: PropTypes.string,
  referendum: PropTypes.string,
  proposal: PropTypes.string,
};

export default ExistingMotionsAndReferendums;
