import axios from "axios";
import { ethers } from "ethers";

const getApi = () => {
  const ssoAccessTokenHash = sessionStorage.getItem("ssoAccessTokenHash");

  const api = axios.create({
    baseURL: process.env.REACT_APP_API2,
    withCredentials: true,
  });
  api.defaults.headers.common["X-Token"] = ssoAccessTokenHash;

  return api;
};

export const getAddressLLM = async (walletAddress) => {
  const api = getApi();

  const { data } = await api.get("/users", {
    params: {
      blockchainAddress: walletAddress,
      limit: 1,
    },
  });

  return ethers.utils.parseUnits(data[0].merits.toFixed(12), 12);
};
