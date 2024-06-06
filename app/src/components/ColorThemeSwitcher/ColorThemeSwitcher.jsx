import { ActionIcon, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import cx from 'clsx';
import classes from './ColorThemeSwitcher.module.css';
import { IconMoon, IconSun } from '@tabler/icons-react';

function ColorThemeSwitcher() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <ActionIcon
      onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
      variant="subtle"
      size="lg"
      aria-label="Toggle color scheme"
    >
      {
        computedColorScheme === 'light' && <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
      }
      {
        computedColorScheme === 'dark' && <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
      }
    </ActionIcon>
  );
}

export default ColorThemeSwitcher;