'use client';

import { FaGear } from "react-icons/fa6";
import { LuGrid3X3 } from 'react-icons/lu';

import {
  Container,
  createListCollection,
  Heading,
  HStack,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';

import { ColorModeIcon, useColorMode } from '@/components/ui/color-mode';
import { Menu } from '@/components/ui/menu';

const MENU_ITEMS = createListCollection({
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
      minH={14}
      gap={8}
    >
      {/* left-aligned nav */}
      <HStack align="center" gap={2}>
        <LuGrid3X3 size={24}/>
        <Heading size={{ base: 'lg', md: 'xl' }}>
          sudokuparty
        </Heading>
      </HStack>

      {/* right-aligned nav */}
      <Menu
        items={MENU_ITEMS}
        open={isMenuOpen}
        positioning={{ placement: 'top-end' }}
        onPointerDownOutside={onMenuClose}
        onMenuSelect={handleMenuSelect}
      >
        <IconButton
          aria-label="menu"
          variant="ghost"
          size='2xs'
          onClick={onMenuOpen}
          asChild
        >
          <FaGear />
        </IconButton>
      </Menu>
    </Container>
  );
};
