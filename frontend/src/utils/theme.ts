'use client';

import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import { Geist, Inter } from 'next/font/google';

/**
 * fonts
 */
export const geistSans = Geist({ subsets: ['latin'] });
export const inter = Inter({ display: 'swap', subsets: ['latin'] });

export const theme = defineConfig({
  globalCss: {
    h1: { color: 'fg' },
    h2: { color: 'fg' },
    body: { color: 'fg.muted', fontWeight: 'normal' },
  },
  theme: {
    tokens: {
      fonts: {
        heading: { value: geistSans.style.fontFamily },
        body: { value: inter.style.fontFamily },
      },
    },
  },
});

export const system = createSystem(defaultConfig, theme);
