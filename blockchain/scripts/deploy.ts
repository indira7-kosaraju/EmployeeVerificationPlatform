import { network } from "hardhat";

const { viem } = await network.connect();

const employeeVerification = await viem.deployContract(
  "EmployeeVerification"
);

console.log(
  "EmployeeVerification deployed to:",
  employeeVerification.address
);