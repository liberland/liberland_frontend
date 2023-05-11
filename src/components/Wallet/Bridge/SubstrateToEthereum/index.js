import React from 'react';
import { Instruction } from './Instruction';
import { NewTransfer } from './NewTransfer';
import { Transfers } from './Transfers';

function SubstrateToEthereum() {
  return (
    <>
      <Instruction />
      <NewTransfer />
      <Transfers />
    </>
  );
}

export default SubstrateToEthereum;
