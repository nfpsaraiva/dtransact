import { Group, Stack, Text, Title } from "@mantine/core";

function Header() {
  return (
    <Group justify='space-between'>
      <Stack gap={4}>
        <Title>dTransact</Title>
        <Text c={'dimmed'}>Transact value</Text>
      </Stack>
    </Group>
  )
}

export default Header;