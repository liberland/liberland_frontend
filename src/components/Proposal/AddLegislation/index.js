import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Collapse from 'antd/es/collapse';
import List from 'antd/es/list';
import Card from 'antd/es/card';
import Markdown from 'markdown-to-jsx';
import Paragraph from 'antd/es/typography/Paragraph';
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
      <Paragraph>
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
      </Paragraph>
      <Collapse
        collapsible="icon"
        onChange={() => setShow(!show)}
        activeKey={show ? ['details'] : []}
        items={[
          {
            label: 'Details',
            key: 'details',
            children: (
              <List
                dataSource={sections}
                renderItem={(section) => (
                  <List.Item>
                    <Card className={styles.section}>
                      <div className={styles.legislationContent}>
                        <Markdown>
                          {new TextDecoder('utf-8').decode(section)}
                        </Markdown>
                      </div>
                    </Card>
                  </List.Item>
                )}
              />
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
