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

async function getContract(address, signer) {
    return new ethers.Contract(address, Escrow.abi, signer);
}

async function approveContract(contract) {
    const approveTxn = await contract.approve();
    await approveTxn.wait();
}

async function declineContract(contract) {
    const approveTxn = await contract.decline();
    await approveTxn.wait();
}

export {
    deployContract,
    getContract,
    approveContract,
    declineContract
}