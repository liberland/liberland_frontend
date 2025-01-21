import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import List from 'antd/es/list';
import Card from 'antd/es/card';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import { getValidatorDisplay } from '../ValidatorList/utils';
import Actions from '../Actions';

function ValidatorListMobile({
  validators,
  selectedValidatorsAsTargets,
  selectingValidatorsDisabled,
  toggleSelectedValidator,
  updateNominations,
  goToAdvancedPage,
}) {
  return (
    <Flex vertical gap="20px">
      <Actions
        goToAdvancedPage={goToAdvancedPage}
        selectedValidatorsAsTargets={selectedValidatorsAsTargets}
        updateNominations={updateNominations}
      />
      <List
        size="small"
        dataSource={getValidatorDisplay({
          selectedValidatorsAsTargets,
          selectingValidatorsDisabled,
          toggleSelectedValidator,
          validators,
        })}
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
          <List.Item>
            <Card
              extra={nominated}
              title={name}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Flex wrap gap="5px">
                    <div className="description">
                      Total stake
                    </div>
                    {total}
                  </Flex>
                </Col>
                <Col span={12}>
                  <Flex wrap gap="5px">
                    <div className="description">
                      Own stake
                    </div>
                    {own}
                  </Flex>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12} className="description">
                  <Flex wrap gap="5px">
                    <div className="description">
                      Other stake
                    </div>
                    {other}
                  </Flex>
                </Col>
                <Col span={12}>
                  <Flex wrap gap="5px">
                    <div className="description">
                      Commission
                    </div>
                    {commission}
                  </Flex>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Flex wrap gap="5px">
                    <div className="description">
                      Allowed
                    </div>
                    {allowed}
                  </Flex>
                </Col>
                <Col span={12}>
                  <Flex wrap gap="5px">
                    <div className="description">
                      Return
                    </div>
                    {profit}
                  </Flex>
                </Col>
              </Row>
            </Card>
          </List.Item>
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
