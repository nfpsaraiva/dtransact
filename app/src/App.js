import { Center, Divider, Group, Stack, Title } from '@mantine/core';
import ContractsList from './components/ContractsList';
import NewContract from './components/NewContract';
import Header from './components/Header';
import { approveContract, declineContract } from './utils/ContractUtils';

const CONTRACTS_API_URL = 'http://localhost:3001/contracts';

function App() {
  return (
    <Center>
      <Stack gap={'xl'}>
        <Header />
        <Stack gap={'xs'}>
          <Group justify='space-between'>
            <Title order={3}>Your Contracts</Title>
            <NewContract contractsApiUrl={CONTRACTS_API_URL} />
          </Group>
          <Divider />
        </Stack>
        <ContractsList
          contractsApiUrl={CONTRACTS_API_URL}
          approve={approveContract}
          decline={declineContract}
        />
      </Stack>
    </Center>
  );
}

export default App;
