import type { Metadata, Viewport } from 'next';
import React from 'react';
import '../src/index.css';

export const viewport: Viewport = {
  themeColor: '#0F172A',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'TechJobs.3D | Interactive 3D Animated Tech Jobs Board',
  description:
    'Explore high-impact software engineering, AI, Web3, and 3D graphics jobs worldwide on an interactive React Three Fiber 3D globe.',
  keywords: [
    'Tech Jobs',
    '3D Web Development',
    'React Three Fiber',
    'Spring Boot',
    'Software Engineering',
    'Remote Developer Jobs',
    'Three.js',
  ],
  authors: [{ name: 'TechJobs.3D Team' }],
  openGraph: {
    title: 'TechJobs.3D | Interactive 3D Animated Tech Jobs Board',
    description:
      'Discover top software engineering roles with real-time 3D interactive visualizations, Framer Motion animations, and instant filters.',
    url: 'https://techjobs-3d.vercel.app',
    siteName: 'TechJobs.3D',
    images: [
      {
        url: 'https://techjobs-3d.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TechJobs 3D Hero Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TechJobs.3D | Interactive 3D Animated Tech Jobs Board',
    description: 'Interactive 3D Tech Jobs Board built with React Three Fiber, Framer Motion, and Java Spring Boot.',
    images: ['https://techjobs-3d.vercel.app/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
