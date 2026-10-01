import { Box, Flex, VStack } from '@chakra-ui/react';

/**
 * Root layout container for the game view.
 * Provides shared spacing and alignment for game content.
 */
const Root = (props: React.ComponentProps<typeof VStack>) => (
  <VStack w="full" px={8} py={8} {...props} />
);

/**
 * Arranges the game board and sidebar.
 * Stacks game content vertically on smaller screens.
 */
const Content = (props: React.ComponentProps<typeof Flex>) => (
  <Flex
    direction={{ base: 'column', md: 'row' }}
    w="full"
    justify="center"
    align={{ base: 'center', md: 'flex-start' }}
    gap={{ base: 4, md: 8 }}
    {...props}
  />
);

/**
 * Contains the board and its game status.
 */
const Main = (props: React.ComponentProps<typeof VStack>) => (
  <VStack flexShrink={0} gap={3} {...props} />
);

/**
 * Contains secondary game information and controls.
 */
const Sidebar = (props: React.ComponentProps<typeof VStack>) => (
  <VStack
    w="full"
    maxW={{ base: 'md', md: '2xs' }}
    align="stretch"
    gap={4}
    {...props}
  />
);

/**
 * Displays game status while preserving its layout space
 * to prevent the board from shifting between game states.
 */
const Status = (props: React.ComponentProps<typeof Box>) => (
  <Box w="full" minH={6} mb={-2} {...props} />
);

export const Game = {
  Root,
  Content,
  Main,
  Sidebar,
  Status,
};
