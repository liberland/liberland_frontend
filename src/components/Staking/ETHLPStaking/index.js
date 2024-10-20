import React, {useEffect, useState} from 'react';
import {getLPStakeInfo, getTokenAddress} from "../../../api/ethereum";
import {registriesActions} from "../../../redux/actions";

export default function ETHLPStaking () {

  const [tokenAddress, setTokenAddress] = useState('loading');
  const [userStakeInfo, setUserStakeInfo] = useState([0,0]);

  useEffect(() => {
    getTokenAddress().then(r => {setTokenAddress(r)})
    getLPStakeInfo('0xE953932C07e69b835a2bF55730f157a824f16E76')
      .then(r => {setUserStakeInfo(r);
        console.log(r)
        console.log(r[0])
      })
  }, []);

  console.log((150).toString(16))
  return (
    <div>
      I m eth lp staking for {tokenAddress}

      i have {userStakeInfo[0]} staked and rewards {userStakeInfo[1]}
    </div>
  )
}
