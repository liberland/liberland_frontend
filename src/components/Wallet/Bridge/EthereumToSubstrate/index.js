import React from 'react';
import { Instruction } from './Instruction';
import { Transfers } from './Transfers';
import { NewTransfer } from './NewTransfer';
import { useEthBridges } from '../../../../hooks/useEthBridges';

function EthereumToSubstrate() {
  const bridges = useEthBridges();

  if (!bridges) return 'Loading...'; // FIXME proper loader
  return (
    <>
      <Instruction />
      <NewTransfer ethBridges={bridges} />
      <Transfers ethBridges={bridges} />
    </>
  );
}

export default EthereumToSubstrate;
