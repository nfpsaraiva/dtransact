import { Button, Card, Group, Stack, Text } from "@mantine/core";
import axios from "axios";
import { ethers } from "ethers";
import { useMutation, useQuery } from '@tanstack/react-query';
import { approveContract, declineContract, getContract } from "../utils/ContractUtils";

function ContractsList({ provider, contractsApiUrl }) {
  const signer = provider.getSigner();

  const { data: escrows, isLoading } = useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      const contracts = await axios.get(contractsApiUrl);

      return contracts.data;
    }
  });

  const approveMutation = useMutation({
    mutationFn: escrow => axios.put(contractsApiUrl + '/approve/' + escrow.address)
  });

  const declineMutation = useMutation({
    mutationFn: escrow => axios.put(contractsApiUrl + '/decline/' + escrow.address)
  });

  const approve = async escrow => {
    const contract = await getContract(escrow.address, signer);

    contract.on('Approved', () => approveMutation.mutate(escrow));

    approveContract(contract);
  }

  const decline = async escrow => {
    const contract = await getContract(escrow.address, signer);

    contract.on('Declined', () => declineMutation.mutate(escrow));

    declineContract(contract);
  }

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
        escrows.map(escrow => {
          const date = new Date(escrow.date);

          return (
            <Card key={escrow.address} withBorder={1} shadow="md">
              <Group gap={"xl"}>
                <Stack gap={3}>
                  <Text fw={600}>Date</Text>
                  <Text>{date.toLocaleDateString() + " " + date.toLocaleTimeString()}</Text>
                </Stack>
                <Stack gap={3}>
                  <Text fw={600}>Address</Text>
                  <Text>{formatAddress(escrow.address)}</Text>
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
                      <Group>
                        <Button onClick={() => approve(escrow)}>Approve</Button>
                        <Button onClick={() => decline(escrow)} color="red">Decline</Button>
                      </Group>
                      : (
                        escrow.status === 'Approved'
                          ? <Text fw={600} c={'teal'}>Approved</Text>
                          : <Text fw={600} c={'red'}>Declined</Text>
                      )
                  }
                </Stack>
              </Group>
            </Card>
          )
        })
      }
    </>
  )
}

export default ContractsList;