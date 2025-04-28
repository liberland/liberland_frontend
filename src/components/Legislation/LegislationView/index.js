import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Result from 'antd/es/result';
import Spin from 'antd/es/spin';
import Flex from 'antd/es/flex';
import List from 'antd/es/list';
import { congressActions, legislationActions } from '../../../redux/actions';
import {
  legislationSelectors,
} from '../../../redux/selectors';
import LegislationItem from './LegislationItem';

function LegislationView() {
  const { tier } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(legislationActions.getLegislation.call({ tier }));
    dispatch(legislationActions.getCitizenCount.call());
    // required by RepealLegislationButton && CitizenProposeRepealLegislationButton
    dispatch(congressActions.getMembers.call());
  }, [dispatch, tier]);

  const legislation = useSelector(legislationSelectors.legislation);
  const repealed = useMemo(
    () => Object.entries(legislation[tier] || {})
      .flatMap(([year, legislations]) => Object.entries(legislations)
        .filter(([, { sections }]) => sections.every(({ content }) => !content.isSome || !content.toJSON()))
        .reduce((repeals, [index]) => {
          repeals[`${year}/${index}`] = true;
          return repeals;
        }, {})).reduce((acc, repeals) => ({ ...acc, ...repeals }), {}),
    [legislation, tier],
  );

  const items = useMemo(() => Object.entries(legislation[tier] || {}).flatMap(([year, legislations]) => (
    Object.entries(legislations).filter(([index]) => !repealed[`${year}/${index}`]).map(([index, {
      id,
      sections,
    }]) => (
      <LegislationItem
        year={year}
        index={index}
        tier={tier}
        id={id}
        sections={sections}
        key={`${year}-${index}`}
      />
    )))), [legislation, tier, repealed]);

  if (!legislation[tier]) {
    return <Spin />;
  }

  if (!items.length) {
    return <Result status={404} title="No legislation found" />;
  }

  const repealList = Object.keys(repealed);

  return (
    <Flex vertical gap="20px">
      {items}
      {repealList.length > 0 && (
        <List
          header="Repealed legislation"
          dataSource={repealList}
          renderItem={(item) => (
            <List.Item>
              {item}
            </List.Item>
          )}
        />
      )}
    </Flex>
  );
}

export default LegislationView;
