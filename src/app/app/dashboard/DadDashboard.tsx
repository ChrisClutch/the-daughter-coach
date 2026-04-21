'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db, auth, googleProvider } from '../../lib/firebase';
import { doc, setDoc, getDoc, updateDoc, onSnapshot, collection, query } from 'firebase/firestore';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';

export default function DadDashboard() {
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [isPaired, setIsPaired] = useState(false);
  const [kidFeedback, setKidFeedback] = useState<any[]>([]);
  
  // AUTH & BILLING STATE
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [hasPaid, setHasPaid] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Check if they just returned from Stripe successfully
        const urlParams = new URLSearchParams(window.location.search);
        const dadDocRef = doc(db, "dads", currentUser.uid);
        
        if (urlParams.get('stripe_success') === 'true') {
          // Mark them as paid in Firebase!
          await setDoc(dadDocRef, { hasPaid: true, email: currentUser.email }, { merge: true });
          setHasPaid(true);
          // Clean the URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          // Otherwise, check database if they already paid previously
          const dadSnap = await getDoc(dadDocRef);
          if (dadSnap.exists() && dadSnap.data().hasPaid) {
            setHasPaid(true);
          }
        }
      }
      setLoadingAuth(false);
    });
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    try { await signInWithPopup(auth, googleProvider); } 
    catch (e) { console.error("Login failed", e); }
  };

  const handleCheckout = async () => {
    setCheckingPayment(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dadId: user.uid }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
      }
    } catch (e) {
      console.error(e);
      setCheckingPayment(false);
    }
  };

  const generateCode = async () => {
    if (!user) return;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setPairingCode(code);
    
    await setDoc(doc(db, "pairings", code), {
      dadId: user.uid,
      dadName: user.displayName,
      status: "pending",
      createdAt: new Date().toISOString()
    });
  };

  useEffect(() => {
    if (!pairingCode) return;
    const unsub = onSnapshot(doc(db, "pairings", pairingCode), (docSnap) => {
      if (docSnap.exists() && docSnap.data().status === "connected") { setIsPaired(true); }
    });
    return () => unsub();
  }, [pairingCode]);

  useEffect(() => {
    if (!isPaired || !pairingCode) return;
    const q = query(collection(db, `pairings/${pairingCode}/feedback`));
    const unsub = onSnapshot(q, (snapshot) => {
      const fb = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setKidFeedback(fb);
    });
    return () => unsub();
  }, [isPaired, pairingCode]);

  if (loadingAuth) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>Decrypting session...</div>;

  // 1. GATE: Authentication
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '64px', borderRadius: '8px', textAlign: 'center', maxWidth: '400px' }}>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', color: 'var(--t1)', marginBottom: '16px', fontWeight: 300 }}>Encrypted Portal</h1>
          <p style={{ color: 'var(--t2)', fontSize: '15px', marginBottom: '32px' }}>Because you are managing billing and minors, this portal requires biometric or Google verification.</p>
          <button onClick={handleLogin} className="btn-primary" style={{ width: '100%' }}>Verify & Sign In</button>
        </div>
      </div>
    );
  }

  // 2. GATE: Stripe Payment (The $100 Prize Pool)
  if (!hasPaid) {
    return (
      <div style={{ minHeight: '100vh', padding: '48px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <nav style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '64px' }}>
          <button onClick={() => signOut(auth)} style={{ background: 'none', border: 'none', color: 'var(--t2)', cursor: 'pointer', fontFamily: '"DM Mono", monospace' }}>[Logout]</button>
        </nav>
        
        <div style={{ background: 'var(--surface)', border: '1px solid var(--gold)', padding: '64px', borderRadius: '8px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '42px', color: 'var(--t1)', marginBottom: '16px', fontWeight: 300 }}>The Father of the Year Pool</h1>
          <p style={{ color: 'var(--t2)', fontSize: '18px', marginBottom: '32px', lineHeight: 1.6 }}>
            You are entering the ultimate competition. The buy-in is <strong>$100 for the year</strong>. <br/><br/>
            50% of your fee goes directly into the community prize pool. At the end of the year, the top 20% of highest-scoring dads (graded by their kids) win the cash pot. Do the work, win the cash. Fail to show up, and you lose your buy-in.
          </p>
          <button onClick={handleCheckout} disabled={checkingPayment} className="btn-primary" style={{ width: '100%', maxWidth: '300px', padding: '20px' }}>
            {checkingPayment ? "Securing connection..." : "Pay $100 to Buy In →"}
          </button>
          <p style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '16px' }}>Securely processed via Stripe. Real stakes, real rewards.</p>
        </div>
      </div>
    );
  }

  // 3. MAIN DASHBOARD (Only visible if logged in AND paid)
  return (
    <div style={{ minHeight: '100vh', padding: '48px', maxWidth: '800px', margin: '0 auto' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '64px', alignItems: 'center' }}>
        <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', fontWeight: 300 }}>
          The <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Dad</span> UI
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ color: 'var(--t3)', fontSize: '12px', fontFamily: '"DM Mono", monospace' }}>Accountability Active ✓</span>
          <button onClick={() => signOut(auth)} style={{ background: 'none', border: 'none', color: 'var(--t2)', cursor: 'pointer', fontFamily: '"DM Mono", monospace', fontSize: '11px' }}>[Logout]</button>
        </div>
      </nav>

      <div style={{ marginBottom: '48px' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '48px', fontWeight: 300, color: 'var(--t1)', marginBottom: '16px' }}>Current Mission: <br/><em style={{color:'var(--gold)'}}>Week 1</em></h1>
        <p style={{ color: 'var(--t2)', fontSize: '18px' }}>Your current assignment is active. Your kid is watching your progress.</p>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '32px', marginBottom: '32px' }}>
        <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>Principle #01 · Gottman</div>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', color: 'var(--t1)', fontWeight: 300, marginBottom: '16px' }}>No agenda. Just listen.</h2>
        <p style={{ color: 'var(--t2)', fontSize: '15px', lineHeight: 1.8, marginBottom: '24px' }}>
          When they talk to you this week, do not offer solutions. Do not figure out who was wrong. Do not troubleshoot. Just say "that sounds really hard" and stop talking.
        </p>
        <button className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>Mark Encounter Complete (Avoid Fine)</button>
      </div>

      <div style={{ padding: '32px', border: '1px solid var(--border2)', borderRadius: '8px' }}>
        <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', color: 'var(--t1)', fontWeight: 300, marginBottom: '8px' }}>
          {isPaired ? "Connection Established ✓" : "Invite Your Kid"}
        </h3>
        
        {!isPaired && <p style={{ color: 'var(--t2)', fontSize: '14px', marginBottom: '24px' }}>Generate a unique pairing code so they can join your journey and provide feedback.</p>}
        
        {pairingCode && !isPaired ? (
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '24px', color: 'var(--gold)', padding: '16px', background: 'var(--surface)', textAlign: 'center', letterSpacing: '0.2em' }}>
            {pairingCode}
            <div style={{ fontSize: '10px', marginTop: '8px', color: 'var(--t2)' }}>(Waiting for them to connect...)</div>
          </div>
        ) : !isPaired ? (
          <button onClick={generateCode} className="btn-outline">Generate Pairing Code</button>
        ) : null}

        {isPaired && (
          <div style={{ marginTop: '16px' }}>
            <p style={{ color: 'var(--green)', fontFamily: '"DM Mono", monospace', fontSize: '12px' }}>Your kid has joined the session! Waiting for their weekly score...</p>
            
            {kidFeedback.map((fb, i) => (
              <div key={i} style={{ marginTop: '24px', padding: '16px', background: 'var(--bg)', borderLeft: '3px solid var(--gold)' }}>
                <div style={{ fontSize: '18px', color: 'var(--gold)', marginBottom: '8px' }}>{"★".repeat(fb.rating)}</div>
                <p style={{ color: 'var(--t1)', fontStyle: 'italic', fontFamily: 'Lora, serif' }}>"{fb.comment}"</p>
                {!fb.safe && <p style={{ color: 'red', fontSize: '10px', marginTop: '8px' }}>Note: This comment was soft-audited due to potential harshness: {fb.auditReason}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
