import { Inter, AR_One_Sans, Lusitana } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const arOneSans = AR_One_Sans({
  subsets: ['latin'],
  variable: '--font-ar-one-sans',
});

export const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ['latin'],
});