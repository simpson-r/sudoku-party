'use client';

import { usePathname } from 'next/navigation';
import { FaGear } from 'react-icons/fa6';
import { LuGrid3X3 } from 'react-icons/lu';

import {
  createListCollection,
  Heading,
  HStack,
  IconButton,
  Link,
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
  const pathname = usePathname();
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
    <HStack
      w="full"
      justifyContent="space-between"
      alignItems="center"
      borderBottom="0.125rem solid"
      borderColor="fg"
      minH={14}
      gap={8}
      px={6}
    >
      {/* left-aligned nav */}
      <Link href="/" textDecoration="none" cursor="pointer">
        <HStack align="center" gap={2}>
          <LuGrid3X3 size={24} />
          <Heading size={{ base: 'lg', md: 'xl' }}>sudokuparty</Heading>
        </HStack>
      </Link>

      {/* right-aligned nav */}
      {pathname !== '/' && (
        <Menu
          items={MENU_ITEMS}
          open={menu.open}
          positioning={{ placement: 'top-end' }}
          onPointerDownOutside={menu.onClose}
          onMenuSelect={handleMenuSelect}
        >
          <IconButton
            aria-label="menu"
            variant="plain"
            boxSize={4}
            onClick={menu.onOpen}
            asChild
          >
            <FaGear />
          </IconButton>
        </Menu>
      )}
    </HStack>
  );
};
