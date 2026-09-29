import { Header } from '@/components/layout/Header';
import { Page } from '@/components/layout/Page';
import { GamePage } from '@/pages/GamePage';
import { notFound } from 'next/navigation';
import { schema } from './schema';

type PageProps = { searchParams: Promise<{ config?: string }> };

const Game = async ({ searchParams }: PageProps) => {
  const params = await searchParams;

  if (!params) notFound();
  const result = schema.parse(params);

  return (
    <Page.Root>
      <Header />
      <GamePage config={{...result, mode: 'single'}} />
    </Page.Root>
  );
};

export default Game;
