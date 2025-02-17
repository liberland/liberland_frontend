import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Divider from 'antd/es/divider';
import Button from '../../Button/Button';

const link = 'https://docs.liberland.org/blockchain/for-citizens/claiming-residency';

function InstructionOnBoard({ setIsClicked }) {
  const onClick = () => {
    sessionStorage.setItem('notResidentAcceptedByUser', true);
    setIsClicked(true);
  };
  return (
    <Flex vertical>
      <Title level={2}>
        You are not yet an e-resident.
      </Title>
      <Paragraph>
        If you want to be a e-resident or citizen, follow next steps:
      </Paragraph>
      <Button
        onClick={() => {
          window.location.href = link;
        }}
        primary
      >
        Claim residency
      </Button>
      <Divider>
        or
      </Divider>
      <Button
        onClick={onClick}
      >
        Skip
      </Button>
    </Flex>
  );
}

InstructionOnBoard.propTypes = {
  setIsClicked: PropTypes.func.isRequired,
};

export default InstructionOnBoard;
