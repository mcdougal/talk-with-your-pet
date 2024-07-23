import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import './globals.css';

// eslint-disable-next-line @typescript-eslint/quotes
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: `Talk With Your Pet`,
  description: `What are they thinking??? 🐱💬 🐶💬`,
  openGraph: {
    title: `Talk With Your Pet`,
    description: `What are they thinking??? 🐱💬 🐶💬`,
    images: [
      {
        url: `https://res.cloudinary.com/cedricmcdougal/image/upload/v1711649509/talk-with-your-pet/cover-image.webp`,
        width: 1024,
        height: 1024,
      },
    ],
  },
};

type Props = Readonly<{
  children: React.ReactNode;
}>;

const RootLayout = ({ children }: Props): React.ReactElement => {
  return (
    <html lang="en">
      <head>
        <script async src="https://cdn.roboflow.com/0.2.26/roboflow.js" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
