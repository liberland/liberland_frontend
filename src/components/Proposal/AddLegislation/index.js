import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Collapse from 'antd/es/collapse';
import PropTypes from 'prop-types';
import router from '../../../router';
import styles from '../styles.module.scss';

function AddLegislation({ proposal, isDetailsHidden }) {
  const { args: [tier, { year, index }, sections] } = proposal;
  const [show, setShow] = useState(isDetailsHidden);

  useEffect(() => {
    setShow(!isDetailsHidden);
  }, [isDetailsHidden]);

  return (
    <div>
      <p>
        Add new legislation
        {' '}
        <Link to={`${router.home.legislation}/${tier.toString()}`} className={styles.blue}>
          {tier.toString()}
        </Link>
        {' '}
        -
        {' '}
        {year.toNumber()}
        /
        {index.toNumber()}
        {show ? '.' : '...'}
      </p>
      <Collapse
        onChange={() => setShow(!show)}
        activeKey={show ? ['details'] : []}
        items={[
          {
            label: 'Details',
            key: 'details',
            children: (
              <>
                {sections.map((section, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                  <Fragment key={idx}>
                    <p>
                      Section #
                      {idx}
                    </p>
                    <p className={styles.legislationContent}>{new TextDecoder('utf-8').decode(section)}</p>
                  </Fragment>
                ))}
              </>
            ),
          },
        ]}
      />
    </div>
  );
}

AddLegislation.defaultProps = {
  isDetailsHidden: false,
};

AddLegislation.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  proposal: PropTypes.object,
  isDetailsHidden: PropTypes.bool,
};

export default AddLegislation;
