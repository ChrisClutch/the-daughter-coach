'use client';
import dynamic from 'next/dynamic';

const KidDashboard = dynamic(() => import('./KidDashboard'), { 
  ssr: false,
  loading: () => <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontFamily: '"DM Mono", monospace' }}>Loading Secure Portal...</div>
});

export default function Page() {
  return <KidDashboard />;
}
