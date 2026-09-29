import { Box, Flex, VStack } from '@chakra-ui/react';

/**
 * Root layout container for the game view.
 * Provides the shared spacing and alignment for game content.
 */
const Root = (props: React.ComponentProps<typeof VStack>) => (
  <VStack w="full" justify="center" px={8} py={10} {...props} />
);

/**
 * Arranges the game board and its surrounding side content.
 */
const Content = (props: React.ComponentProps<typeof Flex>) => (
  <Flex
    direction={{ base: 'column', lg: 'row' }}
    w="full"
    align={{ base: 'center', lg: 'flex-start' }}
    justify={{ base: 'flex-start', lg: 'center' }}
    gap={6}
    {...props}
  />
);

/**
 * Flexible side region used for game controls, player information, or spacing that keeps the board centered.
 */
const Side = (props: React.ComponentProps<typeof Box>) => (
  <Box flex="1" {...props} />
);

/**
 * Displays game status above the board while preserving its layout space to prevent the board from shifting between game states.
 */
const Status = (props: React.ComponentProps<typeof Box>) => (
  <Box minH={6} {...props} />
);

export const Game = {
  Root,
  Content,
  Side,
  Status,
};
