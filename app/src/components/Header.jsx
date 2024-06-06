import { Group, Stack, Text, Title } from "@mantine/core";
import ColorThemeSwitcher from "./ColorThemeSwitcher/ColorThemeSwitcher";

function Header() {
  return (
    <Group justify='space-between'>
      <Stack gap={4}>
        <Title>dTransact</Title>
        <Text c={'dimmed'}>Transact value</Text>
      </Stack>
      {/* <ColorThemeSwitcher /> */}
    </Group>
  )
}

export default Header;