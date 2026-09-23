require("dotenv").config({
    path: require("path").join(__dirname, "..", ".env")
});

const { ethers } = require("ethers");
const contractABI = require("./EmployeeVerificationABI.json");

const provider = new ethers.JsonRpcProvider(
    process.env.BLOCKCHAIN_RPC_URL
);

const wallet = new ethers.Wallet(
    process.env.BLOCKCHAIN_PRIVATE_KEY,
    provider
);

const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    contractABI,
    wallet
);

module.exports = {
    provider,
    wallet,
    contract
};