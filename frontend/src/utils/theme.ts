'use client';

import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import { Geist, Geist_Mono, Space_Mono } from 'next/font/google';

/**
 * fonts
 */
export const spaceMono = Space_Mono({
  weight: '700',
  display: 'swap',
  subsets: ['latin'],
});
export const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
export const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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
        heading: { value: spaceMono.style.fontFamily },
        body: { value: geistSans.style.fontFamily },
        mono: { value: geistMono.style.fontFamily },
      },
    },
  },
});

export const system = createSystem(defaultConfig, theme);
