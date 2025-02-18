import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'antd/es/avatar';
import LLD from '../../assets/icons/lld.svg';
import LLM from '../../assets/icons/llm.svg';
import ACA from '../../assets/icons/aca.svg';
import DAI from '../../assets/icons/dai.svg';
import DOT from '../../assets/icons/dot.svg';
import ETH from '../../assets/icons/eth.svg';
import KSM from '../../assets/icons/ksm.svg';
import PSWAP from '../../assets/icons/pswap.svg';
import RENBTC from '../../assets/icons/renbtc.svg';
import USDC from '../../assets/icons/usdc.svg';
import USDT from '../../assets/icons/usdt.svg';
import VAL from '../../assets/icons/val.svg';
import WBTC from '../../assets/icons/wbtc.svg';
import XOR from '../../assets/icons/xor.svg';
import ColorAvatar from '../ColorAvatar';

const defaultIcons = {
  LLD,
  LLM,
  ACA,
  DAI,
  DOT,
  ETH,
  KSM,
  PSWAP,
  RENBTC,
  USDC,
  USDT,
  VAL,
  WBTC,
  XOR,
};

export default function CurrencyIcon({
  symbol,
  size,
  logo,
}) {
  if (logo) {
    return <Avatar size={size} src={logo} alt={symbol} />;
  }
  const icon = defaultIcons[symbol.toUpperCase()];
  if (icon) {
    return <Avatar size={size} src={icon} alt={symbol} />;
  }
  return (
    <ColorAvatar name={symbol} fontSize={12} size={size} />
  );
}

CurrencyIcon.propTypes = {
  size: PropTypes.number.isRequired,
  symbol: PropTypes.string.isRequired,
  logo: PropTypes.string,
};
