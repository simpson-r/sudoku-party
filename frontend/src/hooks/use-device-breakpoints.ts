import { useBreakpointValue } from '@chakra-ui/react';

export const useBreakpoints = () => {
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  const isTablet = useBreakpointValue({
    base: false,
    md: true,
    lg: false,
  });

  const isNarrowLayout = useBreakpointValue({
    base: true,
    sm: false,
  });

  return {
    isMobile: isMobile ?? false,
    isTablet: isTablet ?? false,
    isCompactLayout: isTablet || isMobile,
    isNarrowLayout,
  };
};
