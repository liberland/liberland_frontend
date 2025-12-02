/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import Flex from 'antd/es/flex';
import Card from 'antd/es/card';
import Space from 'antd/es/space';
import Title from 'antd/es/typography/Title';
import { useDispatch, useSelector } from 'react-redux';
import GlobalOutlined from '@ant-design/icons/GlobalOutlined';
import UserAddOutlined from '@ant-design/icons/UserAddOutlined';
import BarChartOutlined from '@ant-design/icons/BarChartOutlined';
import { useMediaQuery } from 'usehooks-ts';
import Button from '../../Button/Button';
import styles from '../styles.module.scss';
import CongressionalCountdown from './CongressionalCountdown';
import { democracyActions } from '../../../redux/actions';
import { democracySelectors } from '../../../redux/selectors';

function CongressionalAssemble() {
  const isBiggerThanSmallScreen = useMediaQuery('(min-width: 1600px)');
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(democracyActions.getDemocracy.call());
  }, [dispatch]);
  const democracy = useSelector(democracySelectors.selectorDemocracyInfo);
  const termDuration = democracy?.democracy?.electionsInfo?.termDuration;

  return (
    <Flex vertical gap="16px">
      <Title level={2}>
        Election details
      </Title>
      {termDuration && (
        <CongressionalCountdown termDuration={termDuration.toNumber()} />
      )}
      <Flex
        wrap
        gap="15px"
        justify="center"
        align="center"
        vertical={!isBiggerThanSmallScreen}
        className="twoSplitter"
      >
        <Card
          title={(
            <Title level={4}>
              Shape Liberland’s Future
            </Title>
          )}
          extra={<UserAddOutlined className={styles.userMark} />}
          actions={[
            <Button
              onClick={() => {
                window.location.href = 'https://docs.liberland.org/primers/congress';
              }}
            >
              Apply to congress
              <Space />
              <GlobalOutlined />
            </Button>,
          ]}
        >
          <Card.Meta
            // eslint-disable-next-line max-len
            description="Unhappy with the way Liberland is run? Help lead the way by registering your candidacy for a seat in Liberland Congress."
          />
        </Card>
        <Card
          title={(
            <Title level={4}>
              Liberland Election Explorer
            </Title>
          )}
          extra={<BarChartOutlined className={styles.graphMark} />}
          actions={[
            <Button
              onClick={() => {
                window.location.href = 'https://election-details.liberland.org/council/elections/latest';
              }}
            >
              View Election Results
              <Space />
              <GlobalOutlined />
            </Button>,
          ]}
        >
          <Card.Meta
            // eslint-disable-next-line max-len
            description="View the results of Liberland’s upcoming election. This explorer shows candidate scores, rankings, and detailed statistics such as voting stake versus performance — all secured and verified on-chain."
          />
        </Card>
      </Flex>
    </Flex>
  );
}

export default CongressionalAssemble;
