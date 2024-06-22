import { Box, Card, Center, Group, Stack, Text, Title } from '@mantine/core';
import ContractsList from './components/ContractsList';
import NewContract from './components/NewContract';
import ColorThemeSwitcher from "./components/ColorThemeSwitcher/ColorThemeSwitcher";
import { ethers } from 'ethers';

const CONTRACTS_API_URL = process.env.REACT_APP_API_URL;

console.log(CONTRACTS_API_URL);

function App() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  return (
    <Center my={"xl"} mx={"sm"}>
      <Card radius={"lg"} shadow='lg' padding={"lg"} withBorder>
        <Card.Section py={"md"} inheritPadding withBorder>
          <Stack gap={"lg"}>
            <Stack gap={4}>
              <Title order={2}>dTransact</Title>
              <Text c={"dimmed"} size='sm'>Ethereum network</Text>
            </Stack>
            <Group justify='space-between'>
              <NewContract provider={provider} contractsApiUrl={CONTRACTS_API_URL} />
              <ColorThemeSwitcher />
            </Group>
          </Stack>
        </Card.Section>
        <Box my={"md"}>
          <ContractsList
            provider={provider}
            contractsApiUrl={CONTRACTS_API_URL}
          />
        </Box>
      </Card>
    </Center>
  );
}

export default App;
