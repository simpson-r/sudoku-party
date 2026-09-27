import { Stack } from '@chakra-ui/react';

import { Header } from '../components/layout/Header';
import { LandingPage } from '../pages/LandingPage';

export default function Home() {
  return (
    <Stack w="100vw" h="full" alignItems="center" bg="bg" color="fg">
      <Header />
      <LandingPage />
    </Stack>
  );
}
