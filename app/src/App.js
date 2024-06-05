import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import { Button, Center, Divider, Group, Modal, Stack, Text, TextInput, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';

const provider = new ethers.providers.Web3Provider(window.ethereum);

const CONTRACTS_API_URL = 'http://localhost:3001/contracts';

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  const [arbiter, setArbiter] = useState('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC');
  const [beneficiary, setBeneficiary] = useState('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
  const [value, setValue] = useState(0.001);
  const [newContractOpened, newContractHandle] = useDisclosure(false);


  const getAllContracts = async () => axios.get(CONTRACTS_API_URL);


  useEffect(() => {
    getAllContracts().then(res => {
      setEscrows(res.data)
    });

  }, []);

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);


      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  async function newContract() {
    const wei = Number(ethers.utils.parseEther(value.toString())).toString();

    const escrowContract = await deploy(signer, arbiter, beneficiary, wei);

    const signerAddress = await signer.getAddress();

    const escrow = {
      address: escrowContract.address,
      signer: signerAddress,
      arbiter,
      beneficiary,
      value: wei,
      handleApprove: async () => {
        escrowContract.on('Approved', () => {
          console.log('approved');
        });

        await approve(escrowContract, signer);
      },
    };

    const contracts = await axios.post(CONTRACTS_API_URL, {
      contract: escrow
    });

    console.log(contracts);


    setEscrows([...escrows, escrow]);
    newContractHandle.close();
  }

  return (
    <>
      <Modal title='New Contract' opened={newContractOpened} onClose={newContractHandle.close}>
        <Stack>
          <TextInput label='Arbiter' value={arbiter} onChange={e => setArbiter(e.target.value)} />
          <TextInput label='Beneficiary' value={beneficiary} onChange={e => setBeneficiary(e.target.value)} />
          <TextInput label='ETH' value={value} onChange={e => setValue(e.target.value)} />
          <Button onClick={newContract}>Submit</Button>
        </Stack>
      </Modal>
      <Center>
        <Stack gap={'xl'}>
          <Group justify='space-between'>
            <Stack gap={4}>
              <Title>dTransact</Title>
              <Text c={'dimmed'}>Transact value</Text>
            </Stack>
          </Group>
          <Stack gap={'xs'}>
            <Group justify='space-between'>
              <Title order={3}>Your Contracts</Title>
              <Button onClick={newContractHandle.open}>New Contract</Button>
            </Group>
            <Divider />
          </Stack>
          {
            escrows.map((escrow) => {
              return (
                <Group>
                  <Stack gap={3}>
                    <Text>Arbiter</Text>
                    <Text>{escrow.arbiter}</Text>
                  </Stack>
                  <Stack gap={3}>
                    <Text>Beneficiary</Text>
                    <Text>{escrow.beneficiary}</Text>
                  </Stack>
                  <Stack gap={3}>
                    <Text>ETH</Text>
                    <Text>{escrow.value}</Text>
                  </Stack>
                  <Button>Approve</Button>
                </Group>
              )
              //return <Escrow key={escrow.address} {...escrow} />;
            })
          }
        </Stack>
      </Center>
    </>
  );
}

export default App;
