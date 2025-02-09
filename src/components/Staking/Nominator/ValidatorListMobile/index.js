import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import List from 'antd/es/list';
import Card from 'antd/es/card';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import { useSelector } from 'react-redux';
import { getValidatorDisplay } from '../ValidatorList/utils';
import NominatorUpdateActions from '../NominatorUpdateActions';
import styles from './styles.module.scss';
import { identitySelectors } from '../../../../redux/selectors';

function ValidatorListMobile({
  validators,
  selectedValidatorsAsTargets,
  selectingValidatorsDisabled,
  toggleSelectedValidator,
  updateNominations,
  goToAdvancedPage,
}) {
  const identities = useSelector(identitySelectors.selectorIdentityMotions);
  return (
    <Flex vertical gap="20px">
      <Flex wrap gap="15px" justify="start">
        <NominatorUpdateActions
          goToAdvancedPage={goToAdvancedPage}
          selectedValidatorsAsTargets={selectedValidatorsAsTargets}
          updateNominations={updateNominations}
        />
      </Flex>
      <List
        size="small"
        bordered={false}
        dataSource={getValidatorDisplay({
          selectedValidatorsAsTargets,
          selectingValidatorsDisabled,
          toggleSelectedValidator,
          validators,
          identities,
        })}
        pagination={{ pageSize: 20 }}
        renderItem={({
          name,
          total,
          own,
          other,
          commission,
          allowed,
          profit,
          nominated,
        }) => (
          <Card
            className={styles.card}
            classNames={{
              header: styles.header,
            }}
            extra={nominated}
            title={name}
            size="small"
          >
            <Row gutter={16}>
              <Col span={11}>
                <Flex vertical gap="5px">
                  <div className="description">
                    Total stake
                  </div>
                  {total}
                </Flex>
              </Col>
              <Col span={11}>
                <Flex vertical gap="5px">
                  <div className="description">
                    Own stake
                  </div>
                  {own}
                </Flex>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={11} className="description">
                <Flex vertical gap="5px">
                  <div className="description">
                    Other stake
                  </div>
                  {other}
                </Flex>
              </Col>
              <Col span={11}>
                <Flex vertical gap="5px">
                  <div className="description">
                    Commission
                  </div>
                  {commission}
                </Flex>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={11}>
                <Flex vertical gap="5px">
                  <div className="description">
                    Allowed
                  </div>
                  {allowed}
                </Flex>
              </Col>
              <Col span={11}>
                <Flex vertical gap="5px">
                  <div className="description">
                    Return
                  </div>
                  {profit}
                </Flex>
              </Col>
            </Row>
          </Card>
        )}
      />
    </Flex>
  );
}

ValidatorListMobile.propTypes = {
  validators: PropTypes.arrayOf(PropTypes.shape({
    displayName: PropTypes.string,
    address: PropTypes.string,
    commission: PropTypes.string,
    blocked: PropTypes.bool,
  })).isRequired,
  selectedValidatorsAsTargets: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectingValidatorsDisabled: PropTypes.bool.isRequired,
  toggleSelectedValidator: PropTypes.func.isRequired,
  updateNominations: PropTypes.func.isRequired,
  goToAdvancedPage: PropTypes.func.isRequired,
};

export default ValidatorListMobile;
