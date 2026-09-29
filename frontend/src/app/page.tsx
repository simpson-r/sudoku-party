import { Flex, Stack } from '@chakra-ui/react';

import { Header } from '../components/layout/Header';
import { LandingPage } from '../pages/LandingPage';

export default function Home() {
  return (
    <Flex direction="column" w="100vw" minH="100vh" bg="bg" color="fg">
      <Header />
      <LandingPage />
    </Flex>
  );
}
