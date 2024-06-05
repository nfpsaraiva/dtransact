import { Button, Modal, Stack, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { approveContract, declineContract, deployContract } from "../utils/ContractUtils";
import axios from "axios";

function NewContract({contractsApiUrl}) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [signerAddress, setSignerAddress] = useState();
  const [arbiter, setArbiter] = useState('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC');
  const [beneficiary, setBeneficiary] = useState('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
  const [value, setValue] = useState(0.001);
  const [newContractOpened, {open, close}] = useDisclosure(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);
      const signerAddress = await provider.getSigner().getAddress();

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
      setSignerAddress(signerAddress);
    }

    getAccounts();
  }, [account]);

  const createContract = async () => {
    const wei = Number(ethers.utils.parseEther(value.toString())).toString();

    const escrowContract = await deployContract(signer, arbiter, beneficiary, wei);

    const escrow = {
      date: Date.now(),
      address: escrowContract.address,
      status: 'Pending',
      signer: signerAddress,
      arbiter,
      beneficiary,
      value: wei,
      handleApprove: async () => {
        escrowContract.on('Approved', () => {
          console.log('approved');
        });

        await approveContract(escrowContract, signer);
      },
      handleDecline: async () => {
        escrowContract.on('Declined', () => {
          console.log('declined');
        });

        await declineContract(escrowContract, signer);
      }
    };

    await axios.post(contractsApiUrl, {
      contract: escrow
    })

    queryClient.invalidateQueries({ queryKey: ['contracts'] });

    close();
  }

  return (
    <>
      <Modal title='New Contract' opened={newContractOpened} onClose={close}>
        <Stack>
          <TextInput label='Arbiter' value={arbiter} onChange={e => setArbiter(e.target.value)} />
          <TextInput label='Beneficiary' value={beneficiary} onChange={e => setBeneficiary(e.target.value)} />
          <TextInput label='ETH' value={value} onChange={e => setValue(e.target.value)} />
          <Button onClick={createContract}>Submit</Button>
        </Stack>
      </Modal>
      <Button onClick={open}>New Contract</Button>
    </>
  )
}

export default NewContract;