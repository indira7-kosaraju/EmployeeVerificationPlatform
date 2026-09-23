const { ethers } = require("ethers");
const contractABI = require("./EmployeeVerificationABI.json");

const RPC_URL = "http://127.0.0.1:8545";

const CONTRACT_ADDRESS =
  "0x5fbdb2315678afecb367f032d93f642f64180aa3";

const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY;

const provider = new ethers.JsonRpcProvider(RPC_URL);

const wallet = new ethers.Wallet(
  PRIVATE_KEY,
  provider
);

const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  contractABI.abi,
  wallet
);

module.exports = {
  provider,
  wallet,
  contract,
};