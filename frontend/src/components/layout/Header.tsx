'use client';

import { FaGear } from 'react-icons/fa6';
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
  items: [{ label: 'Toggle theme', value: 'theme', icon: ColorModeIcon }],
});

/**
 * This component renders the global header which includes settings
 */
export const Header = () => {
  const menu = useDisclosure();

  const { toggleColorMode } = useColorMode();

  // callbacks
  const handleMenuSelect = (value: string) => {
    /** @todo add more menu options */
    switch (value) {
      case 'theme':
        toggleColorMode();
        break;
    }
    menu.onClose();
  };

  return (
    <Container
      as={HStack}
      w="full"
      justifyContent="space-between"
      alignItems="center"
      borderBottom="2px solid"
      borderColor="fg"
      minH={14}
      gap={8}
    >
      {/* left-aligned nav */}
      <HStack align="center" gap={2}>
        <LuGrid3X3 size={24} />
        <Heading size={{ base: 'lg', md: 'xl' }}>sudokuparty</Heading>
      </HStack>

      {/* right-aligned nav */}
      <Menu
        items={MENU_ITEMS}
        open={menu.open}
        positioning={{ placement: 'top-end' }}
        onPointerDownOutside={menu.onClose}
        onMenuSelect={handleMenuSelect}
      >
        <IconButton
          aria-label="menu"
          variant="ghost"
          size="2xs"
          onClick={menu.onOpen}
          asChild
        >
          <FaGear />
        </IconButton>
      </Menu>
    </Container>
  );
};
