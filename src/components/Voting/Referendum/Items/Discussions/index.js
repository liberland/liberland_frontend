import React from 'react';
import PropTypes from 'prop-types';
import List from 'antd/es/list';
import Card from 'antd/es/card';
import sanitizeUrlHelper from '../../../../../utils/sanitizeUrlHelper';
import { centralizedDatasType } from '../types';
import Button from '../../../../Button/Button';
import CopyIconWithAddress from '../../../../CopyIconWithAddress';

function Discussions({ centralizedDatas }) {
  return (
    <Card title="Discussions">
      <List
        dataSource={centralizedDatas}
        pagination={{ pageSize: 5 }}
        renderItem={(centralizedData) => {
          const sanitizeUrl = sanitizeUrlHelper(centralizedData.link);
          return (
            <List.Item
              actions={[
                <Button
                  href={sanitizeUrl}
                  link
                >
                  {centralizedData.name}
                </Button>,
                <CopyIconWithAddress
                  address={centralizedData.proposerAddress}
                  name="Author address"
                />,
              ]}
            >
              {centralizedData.description}
            </List.Item>
          );
        }}
      />
    </Card>
  );
}

Discussions.propTypes = {
  centralizedDatas: PropTypes.arrayOf(centralizedDatasType).isRequired,
};

export default Discussions;
