import { Center, Divider, Group, Stack, Title } from '@mantine/core';
import ContractsList from './components/ContractsList';
import NewContract from './components/NewContract';
import Header from './components/Header';
import { approveContract, declineContract } from './utils/ContractUtils';
import { ethers } from 'ethers';

const CONTRACTS_API_URL = 'http://localhost:3001/contracts';

function App() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  return (
    <Center>
      <Stack gap={'xl'}>
        <Header />
        <Stack gap={'xs'}>
          <Group justify='space-between'>
            <Title order={3}>Your Contracts</Title>
            <NewContract provider={provider} contractsApiUrl={CONTRACTS_API_URL} />
          </Group>
          <Divider />
        </Stack>
        <ContractsList
          provider={provider}
          contractsApiUrl={CONTRACTS_API_URL}
          approveContract={approveContract}
          declineContract={declineContract}
        />
      </Stack>
    </Center>
  );
}

export default App;
