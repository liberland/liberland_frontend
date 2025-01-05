import React from 'react';
import PropTypes from 'prop-types';
import List from 'antd/es/list';
import PoliticanCard from '../PoliticianCard/Index';

function CurrentAssemble({
  currentCongressMembers,
}) {
  return (
    <List
      header="Acting Congressional Assembly"
      data={currentCongressMembers || []}
      renderItem={(currentCongressMember) => (
        <PoliticanCard
          politician={currentCongressMember}
        />
      )}
    />
  );
}

CurrentAssemble.propTypes = {
  currentCongressMembers: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })).isRequired,
};

export default CurrentAssemble;
