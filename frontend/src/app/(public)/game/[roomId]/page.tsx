import { notFound } from 'next/navigation';

import { Header } from '@/components/layout/Header';
import { Page } from '@/components/layout/Page';
import { GamePage } from '@/pages/GamePage';
import { parseDifficulty } from '@shared/helpers';


type PageProps = { params: Promise<{ roomId: string }> };

const Game = async ({ params }: PageProps) => {
  const { roomId } = await params;
  const difficulty = parseDifficulty(roomId);

  if (!difficulty) notFound();

  return (
    <Page.Root>
      <Header />
      <GamePage config={{ roomId, difficulty, mode: 'multi' }} />
    </Page.Root>
  );
};

export default Game;
