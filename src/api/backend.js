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
    },
  });

  if (data.length > 1) throw new Error(`Address belongs to ${data.length} users`);

  return ethers.utils.parseUnits(data[0].merits.toFixed(12), 12);
};
