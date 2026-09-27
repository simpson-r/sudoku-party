'use client';

import {
  Container,
  createListCollection,
  Heading,
  HStack,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { LuCog } from 'react-icons/lu';
import { ColorModeIcon, useColorMode } from '../ui/color-mode';
import { Menu } from '../ui/menu';

const PROFILE_MENU_ITEMS = createListCollection({
  items: [
    {
      label: 'Toggle theme',
      value: 'theme',
      icon: ColorModeIcon,
      divider: true,
    },
  ],
});

/** This component renders the global header which includes settings */
export const Header = () => {
  const {
    open: isMenuOpen,
    onClose: onMenuClose,
    onOpen: onMenuOpen,
  } = useDisclosure();

  const { toggleColorMode } = useColorMode();

  /** callbacks */
  const handleMenuSelect = (value: string) => {
    switch (value) {
      case 'theme':
        toggleColorMode();
        break;
    }

    onMenuClose();
  };

  return (
    <Container
      as={HStack}
      w="full"
      justifyContent="space-between"
      alignItems="center"
      borderBottom="1px solid"
      borderColor="border"
      minH="12"
      gap={8}
    >
      {/* left-aligned nav */}
      <Heading size={{ base: 'xl', md: '2xl' }} cursor="pointer">
        sudoku.party
      </Heading>

      {/* right-aligned nav */}
      <Menu
        items={PROFILE_MENU_ITEMS}
        open={isMenuOpen}
        positioning={{ placement: 'top-end' }}
        onPointerDownOutside={onMenuClose}
        onMenuSelect={handleMenuSelect}
      >
        <IconButton
          aria-label="menu"
          variant="ghost"
          boxSize={5}
          onClick={onMenuOpen}
          asChild
        >
          <LuCog />
        </IconButton>
      </Menu>
    </Container>
  );
};
