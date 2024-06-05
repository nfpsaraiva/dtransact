import { Button, Card, Group, Stack, Text } from "@mantine/core";
import axios from "axios";
import { ethers } from "ethers";
import { useQuery } from '@tanstack/react-query';

function ContractsList({ contractsApiUrl, approve, decline }) {
  const { data: escrows, isLoading } = useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      const contracts = await axios.get(contractsApiUrl);

      return contracts.data;
    }
  })

  const formatAddress = (address, size = 5) => {
    const start = address.substring(0, size);
    const end = address.substring(address.length - size, address.length);

    return start + '...' + end;
  }

  return (
    <>
      {
        isLoading && <Text>Loading...</Text>
      }
      {
        escrows &&
        escrows.map((escrow) => {
          return (
            <Card>
              <Stack gap={3}>
                <Text fw={600}>Date</Text>
                <Text>{escrow.date}</Text>
              </Stack>
              <Stack gap={3}>
                <Text fw={600}>Signer</Text>
                <Text>{formatAddress(escrow.signer)}</Text>
              </Stack>
              <Stack gap={3}>
                <Text fw={600}>Arbiter</Text>
                <Text>{formatAddress(escrow.arbiter)}</Text>
              </Stack>
              <Stack gap={3}>
                <Text fw={600}>Beneficiary</Text>
                <Text>{formatAddress(escrow.beneficiary)}</Text>
              </Stack>
              <Stack gap={3}>
                <Text fw={600}>ETH</Text>
                <Text>{Number(ethers.utils.formatEther(escrow.value))}</Text>
              </Stack>
              <Stack gap={3}>
                <Text fw={600}>Status</Text>
                {
                  escrow.status === 'Pending'
                    ? 
                    <Stack>
                      <Button onClick={approve}>Approve</Button>
                      <Button color="red" onClick={decline}>Decline</Button>
                    </Stack>
                    : <Text fw={600} c={'teal'}>Approved</Text>
                }
              </Stack>
            </Card>
          )
        })
      }
    </>
  )
}

export default ContractsList;