// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EmployeeVerification {

    struct Verification {
        string verificationId;
        string employeeId;
        string dataHash;
        address verifiedBy;
        uint256 verifiedAt;
        bool exists;
    }

    mapping(string => Verification) private verifications;

    event EmployeeVerified(
        string verificationId,
        string employeeId,
        string dataHash,
        address verifiedBy,
        uint256 verifiedAt
    );

    function verifyEmployee(
        string memory _verificationId,
        string memory _employeeId,
        string memory _dataHash
    ) public {

        require(
            !verifications[_verificationId].exists,
            "Verification already exists"
        );

        verifications[_verificationId] = Verification({
            verificationId: _verificationId,
            employeeId: _employeeId,
            dataHash: _dataHash,
            verifiedBy: msg.sender,
            verifiedAt: block.timestamp,
            exists: true
        });

        emit EmployeeVerified(
            _verificationId,
            _employeeId,
            _dataHash,
            msg.sender,
            block.timestamp
        );
    }

    function getVerification(
        string memory _verificationId
    )
        public
        view
        returns (
            string memory verificationId,
            string memory employeeId,
            string memory dataHash,
            address verifiedBy,
            uint256 verifiedAt
        )
    {
        require(
            verifications[_verificationId].exists,
            "Verification not found"
        );

        Verification memory verification =
            verifications[_verificationId];

        return (
            verification.verificationId,
            verification.employeeId,
            verification.dataHash,
            verification.verifiedBy,
            verification.verifiedAt
        );
    }
}