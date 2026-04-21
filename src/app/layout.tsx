import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "The Daughter Coach — She's the Hero. You're the Force Behind Her.",
  description: "The best dads don't need credit. They show up, do the work, and watch their daughters become everything. Free AI coaching built on 35 years of research.",
  openGraph: {
    title: "She's the Hero. You're the Force Behind Her.",
    description: "Free AI coaching for dads. Built on real research. One weekly assignment. Be the Yoda your daughter needs.",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400;500&family=Lora:ital,wght@0,400;1,400&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
