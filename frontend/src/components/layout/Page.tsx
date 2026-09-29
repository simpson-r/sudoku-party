import { Flex } from '@chakra-ui/react';

/**
 * Root layout container for application pages.
 */
const Root = (props: React.ComponentProps<typeof Flex>) => (
  <Flex
    direction="column"
    w="100vw"
    minH="100vh"
    bg="bg"
    color="fg"
    {...props}
  />
);

export const Page = {
  Root,
};
