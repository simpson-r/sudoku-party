import { Header } from '../components/layout/Header';
import { LandingPage } from '../pages/LandingPage';
import { Page } from '@/components/layout/Page';

export default function Home() {
  return (
    <Page.Root>
      <Header />
      <LandingPage />
    </Page.Root>
  );
}
