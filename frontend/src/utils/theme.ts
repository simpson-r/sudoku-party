'use client';

import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
} from '@chakra-ui/react';
import { Inter, Fragment_Mono } from 'next/font/google';

/**
 * fonts
 */
const inter = Inter({
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
    h1: { color: 'fg', textTransform: 'lowercase' },
    h2: { color: 'fg', textTransform: 'lowercase' },
    body: {
      color: 'fg.muted',
      fontWeight: 'normal',
      textTransform: 'lowercase',
    },
  },
  theme: {
    recipes: {
      button: defineRecipe({ base: { borderRadius: 'none' } }),
    },
    tokens: {
      fonts: {
        heading: { value: fragmentMono.style.fontFamily },
        body: { value: 'Helvetica Neue, Helvetica, Arial, sans-serif' },
        mono: { value: inter.style.fontFamily },
      },
    },
  },
});

export const system = createSystem(defaultConfig, theme);
