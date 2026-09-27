'use client';

import dynamic from 'next/dynamic';

import { ChakraProvider } from '@chakra-ui/react';

import { type ColorModeProviderProps } from './color-mode';
import { system } from '../../utils/theme';

const ColorModeProvider = dynamic(
  () => import('./color-mode').then((m) => m.ColorModeProvider),
  { ssr: false },
);

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
