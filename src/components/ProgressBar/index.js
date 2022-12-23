import React from 'react';

import styles from './styles.module.scss';

// eslint-disable-next-line react/prop-types
function ProgressBar({ percent, maxValue = 0, currentValue = 0 }) {
  if (maxValue > 0 && currentValue >= 0) {
    const fillingPercent = currentValue === 0 ? 0 : ((currentValue * 100) / maxValue);
    return (
      <div className={styles.wrapperDraft}>
        <div className={styles.containerDraft}>
          <div
            className={fillingPercent === 100 ? styles.progressDraftGreen : styles.progressDraft}
            style={{ width: `${fillingPercent}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.progress} style={{ width: `${percent}%` }} />
      </div>
      <p>
        {percent}
        %
      </p>
    </div>
  );
}

export default ProgressBar;
