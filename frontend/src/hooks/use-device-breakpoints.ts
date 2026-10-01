import { useBreakpointValue } from '@chakra-ui/react';

export const useBreakpoints = () => {
  const isMobile = useBreakpointValue(
    {
      base: true,
      md: false,
    },
    { ssr: false },
  );

  const isTablet = useBreakpointValue(
    {
      base: false,
      md: true,
      lg: false,
    },
    { ssr: false },
  );

  return {
    isMobile: isMobile ?? false,
    isTablet: isTablet ?? false,
  };
};
