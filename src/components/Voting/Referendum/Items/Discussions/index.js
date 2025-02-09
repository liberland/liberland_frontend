import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import List from 'antd/es/list';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import uniq from 'lodash/uniq';
import classNames from 'classnames';
import Paragraph from 'antd/es/typography/Paragraph';
import { useDispatch, useSelector } from 'react-redux';
import sanitizeUrlHelper from '../../../../../utils/sanitizeUrlHelper';
import { centralizedDatasType } from '../types';
import Button from '../../../../Button/Button';
import CopyIconWithAddress from '../../../../CopyIconWithAddress';
import { identitySelectors } from '../../../../../redux/selectors';
import { identityActions } from '../../../../../redux/actions';
import ColorAvatar from '../../../../ColorAvatar';
import styles from '../../../styles.module.scss';
import truncate from '../../../../../utils/truncate';

function Discussions({ centralizedDatas }) {
  const dispatch = useDispatch();
  const identities = useSelector(identitySelectors.selectorIdentityMotions);

  useEffect(() => {
    dispatch(
      identityActions.getIdentityMotions.call(uniq(centralizedDatas.map(({ proposerAddress }) => proposerAddress))),
    );
  }, [dispatch, centralizedDatas]);

  return (
    <Card title="Discussions">
      <List
        dataSource={centralizedDatas}
        pagination={{ pageSize: 5 }}
        renderItem={(centralizedData) => {
          const sanitizeUrl = sanitizeUrlHelper(centralizedData.link);
          const identity = identities?.[centralizedData.proposerAddress]?.identity?.legal
            || identities?.[centralizedData.proposerAddress]?.identity?.name
            || 'Unknown';

          return (
            <List.Item
              actions={[
                <Button
                  href={sanitizeUrl}
                  link
                >
                  {centralizedData.name}
                </Button>,
              ]}
            >
              <Flex wrap gap="15px" align="center" className={styles.discussionIdentity}>
                <ColorAvatar name={identity} size={30} />
                <Flex vertical gap="5px">
                  <strong>
                    {truncate(identity, 20)}
                  </strong>
                  <div className="description">
                    <CopyIconWithAddress
                      address={centralizedData.proposerAddress}
                      isTruncate
                    />
                  </div>
                </Flex>
              </Flex>
              <Paragraph className={classNames('description', styles.discussionDescription)}>
                {centralizedData.description}
              </Paragraph>
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
