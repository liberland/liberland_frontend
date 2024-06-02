import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import sanitizeUrlHelper from '../../../../../utils/sanitizeUrlHelper';
import styles from '../item.module.scss';
import { centralizedDatasType } from '../types';
import Button from '../../../../Button/Button';
import CopyIconWithAddress from '../../../../CopyIconWithAddress';

function DiscussionList({ centralizedDatas }) {
  return (
    <ol>
      {centralizedDatas.map((centralizedData) => {
        const sanitizeUrl = sanitizeUrlHelper(centralizedData.link);
        return (
          <li
            className={styles.listItem}
            key={centralizedData.id}
          >
            <a
              href={sanitizeUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.blueText}
            >
              {centralizedData.name}
            </a>
            {' - '}
            {centralizedData.description}
            {' '}
            (Discussion added by
            {' '}
            <span className={styles.centerItem}>
              <CopyIconWithAddress
                address={centralizedData.proposerAddress}
              />
            </span>
            )
          </li>
        );
      })}
    </ol>
  );
}

DiscussionList.propTypes = {
  centralizedDatas: PropTypes.arrayOf(centralizedDatasType).isRequired,
};

function Discussions({ centralizedDatas }) {
  const [isDiscussionsHidden, setIsDiscussionsHidden] = useState(true);
  return (
    <div className={styles.greyWrapper}>
      <div className={cx(styles.smallHeader, styles.discussionWrapper)}>
        <h4 className={styles.title}>Discussions</h4>
        <div className={cx(!isDiscussionsHidden && styles.none)}>
          <DiscussionList
            centralizedDatas={[centralizedDatas[0]]}
            isDiscussionsHidden={isDiscussionsHidden}
          />
        </div>
        <div className={cx(isDiscussionsHidden && styles.hidden)}>
          <DiscussionList
            centralizedDatas={centralizedDatas}
            isDiscussionsHidden={isDiscussionsHidden}
          />
        </div>
      </div>
      {
        centralizedDatas.length > 1
        && (
        <Button
          className={styles.button}
          small
          secondary={isDiscussionsHidden}
          grey={!isDiscussionsHidden}
          onClick={() => setIsDiscussionsHidden((prevState) => !prevState)}
        >
          {!isDiscussionsHidden ? 'HIDE' : 'SHOW'}
          {' '}
          DISCUSSIONS
        </Button>
        )
      }
    </div>
  );
}

Discussions.propTypes = {
  centralizedDatas: PropTypes.arrayOf(centralizedDatasType).isRequired,
};

export default Discussions;
