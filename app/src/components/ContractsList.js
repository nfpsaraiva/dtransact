import { Accordion, Badge, Button, Card, Group, Stack, Text } from "@mantine/core";
import axios from "axios";
import { ethers } from "ethers";
import { useMutation, useQuery } from '@tanstack/react-query';
import { approveContract, declineContract, getContract } from "../utils/ContractUtils";

function ContractsList({ provider, contractsApiUrl }) {
  const signer = provider.getSigner();

  const { data: escrows, isLoading } = useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      const address = await signer.getAddress();
      const contracts = await axios.get(contractsApiUrl + '/signer/' + address);

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
        escrows && escrows.length === 0 && <Text>No contracts</Text>
      }
      {
        escrows &&
        <Accordion variant="separated">
          {
            escrows.map(escrow => {
              const date = new Date(escrow.date);

              return (
                <Accordion.Item value={escrow.address} key={escrow.address}>
                  <Accordion.Control>
                    <Group px={"md"}>
                      {escrow.status === 'Pending' && <Badge color="yellow">{escrow.status}</Badge>}
                      {escrow.status === 'Approved' && <Badge color="green">{escrow.status}</Badge>}
                      {escrow.status === 'Declined' && <Badge color="red">{escrow.status}</Badge>}

                      <Stack gap={2}>
                        <Text size="xs" c={"dimmed"}>
                          {date.toLocaleDateString() + " " + date.toLocaleTimeString()}
                        </Text>
                        <Group>
                          <Text size="sm">{Number(ethers.utils.formatEther(escrow.value))} ETH</Text>
                          <Text size="sm">to</Text>
                          <Text size="sm">{formatAddress(escrow.beneficiary)}</Text>
                        </Group>
                      </Stack>

                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Card>

                      <Stack gap={"xs"}>
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
                        {
                          escrow.status === 'Pending'
                            ?
                            <Stack gap={"xs"}>
                              <Button fullWidth onClick={() => approve(escrow)}>Approve</Button>
                              <Button fullWidth onClick={() => decline(escrow)} color="red">Decline</Button>
                            </Stack>
                            : (
                              escrow.status === 'Approved'
                                ? <Stack gap={3}>
                                  <Text fw={600}>Status</Text>
                                  <Text fw={600} c={'teal'}>The arbiter approved this contract</Text>
                                </Stack>
                                : <Stack gap={3}>
                                  <Text fw={600}>Status</Text>
                                  <Text fw={600} c={'red'}>The arbiter declined this contract</Text>
                                </Stack>
                            )
                        }
                      </Stack>
                    </Card>
                  </Accordion.Panel>
                </Accordion.Item>

              )
            })
          }
        </Accordion>
      }
    </>
  )
}

export default ContractsList;