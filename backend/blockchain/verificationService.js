const { contract } = require("./blockchain");

// Store verification on blockchain
const verifyEmployeeOnBlockchain = async (
  verificationId,
  employeeId,
  dataHash
) => {
  const transaction = await contract.verifyEmployee(
    verificationId,
    employeeId,
    dataHash
  );

  const receipt = await transaction.wait();

  return {
    transactionHash: transaction.hash,
    blockNumber: receipt.blockNumber,
  };
};

// Read verification from blockchain
const getBlockchainVerification = async (verificationId) => {
  const verification = await contract.getVerification(
    verificationId
  );

  return {
    verificationId: verification[0],
    employeeId: verification[1],
    dataHash: verification[2],
    verifiedBy: verification[3],
    verifiedAt: verification[4].toString(),
  };
};

module.exports = {
  verifyEmployeeOnBlockchain,
  getBlockchainVerification,
};