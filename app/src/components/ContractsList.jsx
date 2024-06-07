import { Accordion, ActionIcon, Button, Card, Group, Menu, Stack, Text } from "@mantine/core";
import axios from "axios";
import { ethers } from "ethers";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { approveContract, declineContract, getContract } from "../utils/ContractUtils";
import { IconDots, IconTrash } from '@tabler/icons-react';

function ContractsList({ provider, contractsApiUrl }) {
  const signer = provider.getSigner();

  const queryClient = useQueryClient();
  
  const { data: escrows, isLoading } = useQuery({
    queryKey: ["contracts"],
    queryFn: async () => {
      const signerAddress = await signer.getAddress();
      const contracts = await axios.get(contractsApiUrl + '/signer/' + signerAddress);
      
      return contracts.data;
    },
  });
  
  const approveMutation = useMutation({
    mutationFn: escrow => axios.put(contractsApiUrl + '/approve/' + escrow.address),
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ['contracts']
    })
  });

  const declineMutation = useMutation({
    mutationFn: escrow => axios.put(contractsApiUrl + '/decline/' + escrow.address),
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ['contracts']
    })
  });

  const deleteMutation = useMutation({
    mutationFn: escrow => axios.delete(contractsApiUrl + '/' + escrow.address),
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ['contracts']
    })
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
        <Accordion variant="separated" disableChevronRotation chevron={<></>}>
          {
            escrows.map(escrow => {
              const date = new Date(escrow.date);

              return (
                <Accordion.Item pr={0} value={escrow.address} key={escrow.address}>
                  <Accordion.Control pr={0}>
                    <Group justify="space-between" gap={"xl"}>
                      <Group>
                        <Stack gap={2}>
                          <Group>
                            <Text>
                              {escrow.name}
                            </Text>
                          </Group>
                        </Stack>
                      </Group>
                      <Menu>
                        <Menu.Target>
                          <ActionIcon component="a" variant="transparent" onClick={e => e.stopPropagation()}>
                            <IconDots />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<IconTrash size={18} />}
                            color="red"
                            onClick={() => deleteMutation.mutate(escrow)}
                          >
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap={"xs"}>
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
                        </Stack>
                      </Card>
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
                  </Accordion.Panel>
                </Accordion.Item>
              )
            })
          }
        </Accordion >
      }
    </>
  )
}

export default ContractsList;