'use client';

import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import { Inter, Fragment_Mono } from 'next/font/google';

/**
 * fonts
 */
export const inter = Inter({
  display: 'swap',
  subsets: ['latin'],
  weight: '400',
});
const fragmentMono = Fragment_Mono({
  display: 'swap',
  subsets: ['latin'],
  weight: '400',
});

export const theme = defineConfig({
  globalCss: {
    h1: { color: 'fg' },
    h2: { color: 'fg' },
    body: { color: 'fg.muted', fontWeight: 'normal' },
  },
  theme: {
    tokens: {
      fonts: {
        heading: { value: fragmentMono.style.fontFamily },
        body: { value: fragmentMono.style.fontFamily },
        mono: { value: fragmentMono.style.fontFamily },
      },
    },
  },
});

export const system = createSystem(defaultConfig, theme);
