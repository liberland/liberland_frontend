import React, { useState } from 'react';
import cx from 'classnames';

import Card from '../Card';
import Status from '../Status';
import { ReactComponent as FeedIcon } from '../../assets/icons/feed.svg';
import { ReactComponent as FeedIconActive } from '../../assets/icons/active-feed.svg';
import { ReactComponent as ListIcon } from '../../assets/icons/list-view.svg';
import { ReactComponent as ListIconActive } from '../../assets/icons/list-view-active.svg';
import { ReactComponent as StarIcon } from '../../assets/icons/star.svg';
import { ReactComponent as DotsIcon } from '../../assets/icons/three-dots.svg';
import styles from './styles.module.scss';

const Feed = () => {
  const [view, setView] = useState('tile');
  const news = [{
    title: 'The most important Liberland update',
    date: 'Apr 11, 2021',
    author: 'Liberland',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse facilisi sed tincidunt pulvinar maecenas eu. In rutrum neque, lectus sit semper orci ornare consectetur arcu. At vel feugiat nisi eget blandit proin. Diam ut tellus posuere tincidunt eu aliquam mauris pellentesque.',
    hashtags: ['#Constitution', '#Hashtag', '#Hashtag'],
    type: 'liberland',
  },
  {
    title: 'Update that use for faster and easier election system in Liberland. The most important update',
    date: 'Apr 11, 2021',
    author: 'Mr. President',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse facilisi sed tincidunt pulvinar maecenas eu. In rutrum neque, lectus sit semper orci ornare consectetur arcu. At vel feugiat nisi eget blandit proin. Diam ut tellus posuere tincidunt eu aliquam mauris pellentesque.',
    hashtags: ['Mr. President', '#Hashtag', '#Hashtag'],
    type: 'president',
  },
  {
    title: 'Less important Liberland update',
    date: 'Apr 11, 2021',
    author: 'Liberland',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse facilisi sed tincidunt pulvinar maecenas eu. In rutrum neque, lectus sit semper orci ornare consectetur arcu. At vel feugiat nisi eget blandit proin. Diam ut tellus posuere tincidunt eu aliquam mauris pellentesque.',
    hashtags: ['#Constitution', '#Hashtag', '#Hashtag'],
    type: 'liberland',
  },
  {
    title: 'I Got Rejected by Liberland… So I Redesigned It',
    date: 'Apr 11, 2021',
    author: 'Liberland',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse facilisi sed tincidunt pulvinar maecenas eu. In rutrum neque, lectus sit semper orci ornare consectetur arcu. At vel feugiat nisi eget blandit proin. Diam ut tellus posuere tincidunt eu aliquam mauris pellentesque.',
    hashtags: ['#Constitution', '#Hashtag', '#Hashtag'],
    type: 'liberland',
  }];

  const handleChangeView = (type) => setView(type);

  return (
    <div className={styles.feedWrapper}>
      <div className={styles.feedHeader}>
        <h3 className={styles.feedHeaderText}>Recent updates</h3>
        <div className={styles.viewButtons}>
          {view === 'tile' ? <FeedIconActive /> : <FeedIcon onClick={() => handleChangeView('tile')} />}
          {view === 'list' ? <ListIconActive /> : <ListIcon onClick={() => handleChangeView('list')} /> }
        </div>
      </div>
      <div className={styles.cardWrapper}>
        {
          news.map((newsItem) => (
            <Card className={cx({ [styles.tile]: view === 'tile', [styles.list]: view === 'list' })}>
              <h3 className={styles.cardTitle}>{newsItem.title}</h3>
              <p className={styles.cardInfo}>
                {newsItem.date}
                {' '}
                •
                {' '}
                <span className={cx(styles.author, { [styles.green]: newsItem.type === 'president', [styles.yellow]: newsItem.type === 'liberland' })}>{newsItem.author}</span>
              </p>
              <p className={cx(styles.cardInfo, styles.withMargin)}>{newsItem.text}</p>
              <div className={styles.cardFooter}>
                <div>
                  {newsItem.hashtags.map((hashtag, index) => (
                    <Status
                      className={cx({
                        [styles.greenStatus]: !index && newsItem.type === 'president',
                        [styles.yellowStatus]: !index && newsItem.type === 'liberland',
                      })}
                      completed={newsItem.type === 'president'}
                      status={hashtag}
                      pending={newsItem.type === 'liberland'}
                    />
                  ))}
                </div>
                <div>
                  <StarIcon />
                  <DotsIcon />
                </div>
              </div>
            </Card>
          ))
        }
      </div>
    </div>
  );
};

export default Feed;
