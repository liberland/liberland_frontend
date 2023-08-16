import axios from "axios";

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

  return data;
};
