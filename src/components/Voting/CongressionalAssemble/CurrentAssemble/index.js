import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import PoliticanCard from '../PoliticianCard/Index';
import Card from '../../../Card';
import stylesPage from '../../../../utils/pagesBase.module.scss';
import styles from './styles.module.scss';

function CurrentAssemble({
  currentCongressMembers,
}) {
  return (
    <Card className={stylesPage.overviewWrapper} title="Acting Congressional Assembly">

      <div className={stylesPage.transactionHistoryCard}>

        {
            currentCongressMembers?.map((currentCongressMember) => (
              <div
                className={cx(stylesPage.transactionHistoryCardMain, styles.gridList)}
                key={`current-congress-member${currentCongressMember.name}`}
              >
                <PoliticanCard
                  politician={currentCongressMember}
                />
              </div>
            ))
          }

      </div>
    </Card>
  );
}

CurrentAssemble.propTypes = {
  currentCongressMembers: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })).isRequired,
};
export default CurrentAssemble;
