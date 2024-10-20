import { createThirdwebClient, getContract, readContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";

let thirdWebContractCache = null
const getThirdWebContract = () => {
  if (thirdWebContractCache === null) {
    // create the client with your clientId, or secretKey if in a server environment
    const client = createThirdwebClient({
      clientId: "eaa651485162e88db620fcb0ac25cbbb"
    });
    // connect to your contract
    const contract = getContract({
      client,
      chain: defineChain(1),
      address: "0x286477f868Aa66C534254a16a7D532C7615Ac332"
    });
    thirdWebContractCache = contract
    return contract
  } else {
    return thirdWebContractCache
  }
}

const getTokenAddress = async () => {
  const contract = getThirdWebContract()
  return readContract({
    contract,
    method: "function rewardToken() view returns (address)",
    params: []
  })
}

const getLPStakeInfo = async (userEthAddress) => {
  const contract = getThirdWebContract()
  return readContract({
    contract,
    method: "function getStakeInfo(address userEthAddress) view returns (uint256 _tokensStaked, uint256 _rewards)",
    params: [userEthAddress]
  })

}

export {
  getTokenAddress,
  getLPStakeInfo
}
