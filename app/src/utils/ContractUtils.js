import { ethers } from 'ethers';
import Escrow from './../artifacts/contracts/Escrow.sol/Escrow';

async function deployContract(signer, arbiter, beneficiary, value) {
    const factory = new ethers.ContractFactory(
        Escrow.abi,
        Escrow.bytecode,
        signer
    );

    return factory.deploy(arbiter, beneficiary, { value });
}

async function approveContract(escrowContract, signer) {
    const approveTxn = await escrowContract.connect(signer).approve();
    await approveTxn.wait();
}

async function declineContract(escrowContract, signer) {
    const approveTxn = await escrowContract.connect(signer).decline();
    await approveTxn.wait();
}

export {
    deployContract,
    approveContract,
    declineContract
}