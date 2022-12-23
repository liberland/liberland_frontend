import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import PoliticanCard from '../PoliticianCard/Index';
import Card from '../../../Card';

function CurrentAssemble({
  currentCongressMembers,
}) {
  return (
    <div>
      <Card title="">
        <div className={styles.currentAssembleHeader}>
          Acting Congressional Assembly
        </div>
        <div className={styles.congressMembersList}>
          {
            currentCongressMembers?.map(
              (currentCongressMember) => (
                <PoliticanCard
                  politician={currentCongressMember}
                  key={`current-congress-member${currentCongressMember.name}`}
                />
              ),
            )
          }
        </div>
      </Card>
    </div>
  );
}

CurrentAssemble.propTypes = {
  currentCongressMembers: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })).isRequired,
};

export default CurrentAssemble;
