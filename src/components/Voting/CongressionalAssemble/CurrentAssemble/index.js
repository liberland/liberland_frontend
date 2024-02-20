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
        <div className={cx(
          stylesPage.transactionHistoryCardHeaderDesktop,
          stylesPage.transactionHistoryCardHeader,
          styles.gridList,
        )}
        >
          <span>NAME</span>
          <span>DELEGATE MY VOTE</span>
          <span>VOTING POWER</span>
        </div>
        <div className={cx(stylesPage.transactionHistoryCardHeaderMobile, stylesPage.transactionHistoryCardHeader)}>
          <span>NAME / VOTING POWER</span>
          <span>DELEGATE MY VOTE</span>
        </div>

        {
            currentCongressMembers?.map((currentCongressMember) => (
              <div className={cx(stylesPage.transactionHistoryCardMain, styles.gridList)}>
                <PoliticanCard
                  politician={currentCongressMember}
                  key={`current-congress-member${currentCongressMember.name}`}
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
