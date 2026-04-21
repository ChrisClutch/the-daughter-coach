'use client';
import dynamic from 'next/dynamic';

const DadDashboard = dynamic(() => import('./DadDashboard'), { 
  ssr: false,
  loading: () => <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontFamily: '"DM Mono", monospace' }}>Loading Encrypted Connection...</div>
});

export default function Page() {
  return <DadDashboard />;
}
