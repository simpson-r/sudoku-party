import { LandingPage } from '@/pages/LandingPage';
import { Container, Stack } from '@chakra-ui/react';

export default function Home() {
  return (
    <Container
      as={Stack}
      w="full"
      h="full"
      alignItems="center"
      bg="bg.panel"
      color="fg"
    >
      <LandingPage />
    </Container>
  );
}
