'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db, auth, googleProvider } from '../../lib/firebase';
import { doc, setDoc, getDoc, updateDoc, onSnapshot, collection, query } from 'firebase/firestore';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import bootcampData from '../../data/bootcamp_30.json';

export default function DadDashboard() {
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [isPaired, setIsPaired] = useState(false);
  const [kidFeedback, setKidFeedback] = useState<any[]>([]);
  
  // AUTH & BILLING STATE
  const [user, setUser] = useState<any>(null);
  const [dadData, setDadData] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [hasPaid, setHasPaid] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  
  // ROUTINE STATE
  const [activeDay, setActiveDay] = useState<number>(1);
  const [checkedTasks, setCheckedTasks] = useState<boolean[]>([]);
  const [savingRoutine, setSavingRoutine] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const urlParams = new URLSearchParams(window.location.search);
        const dadDocRef = doc(db, "dads", currentUser.uid);
        
        let localHasPaid = false;
        let pData = null;

        if (urlParams.get('stripe_success') === 'true') {
          await setDoc(dadDocRef, { hasPaid: true, email: currentUser.email, startDate: new Date().toISOString() }, { merge: true });
          localHasPaid = true;
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          const dadSnap = await getDoc(dadDocRef);
          if (dadSnap.exists()) {
             pData = dadSnap.data();
             if (pData.hasPaid) { localHasPaid = true; }
          }
        }
        
        if (localHasPaid && pData?.startDate) {
           const start = new Date(pData.startDate).getTime();
           const now = new Date().getTime();
           const diffTime = Math.abs(now - start);
           let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
           if (diffDays < 1) diffDays = 1;
           if (diffDays > 30) diffDays = 30;
           setActiveDay(diffDays);
        }
        
        setDadData(pData);
        setHasPaid(localHasPaid);
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

  // 2. GATE: Beta Sprint Access (Bypasses Stripe for Testing)
  if (!hasPaid) {
    return (
      <div style={{ minHeight: '100vh', padding: '48px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <nav style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '64px' }}>
          <button onClick={() => signOut(auth)} style={{ background: 'none', border: 'none', color: 'var(--t2)', cursor: 'pointer', fontFamily: '"DM Mono", monospace' }}>[Logout]</button>
        </nav>
        
        <div style={{ background: 'var(--surface)', border: '1px solid var(--gold)', padding: '64px', borderRadius: '8px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '42px', color: 'var(--t1)', marginBottom: '16px', fontWeight: 300 }}>30-Day Beta Sprint</h1>
          <p style={{ color: 'var(--t2)', fontSize: '18px', marginBottom: '32px', lineHeight: 1.6 }}>
            You have been selected to participate in the exclusive 30-Day Beta Sprint. <br/><br/>
            During this beta testing phase, the $100 "Skin in the game" buy-in requirement has been temporarily waived. Your feedback on these 30 days will shape the future algorithms of the global competition.
          </p>
          <button onClick={async () => {
            setCheckingPayment(true);
            const dadDocRef = doc(db, "dads", user.uid);
            await setDoc(dadDocRef, { hasPaid: true, isBeta: true, email: user.email, startDate: new Date().toISOString() }, { merge: true });
            const s = await getDoc(dadDocRef);
            setDadData(s.data());
            setActiveDay(1);
            setHasPaid(true);
            setCheckingPayment(false);
          }} disabled={checkingPayment} className="btn-primary" style={{ width: '100%', maxWidth: '300px', padding: '20px' }}>
            {checkingPayment ? "Activating pass..." : "Claim Beta Access →"}
          </button>
          <p style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '16px' }}>Stripe requirement deactivated for beta cohort.</p>
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
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '48px', fontWeight: 300, color: 'var(--t1)', marginBottom: '16px' }}>Bootcamp: <br/><em style={{color:'var(--gold)'}}>Day {activeDay} of 30</em></h1>
        <p style={{ color: 'var(--t2)', fontSize: '18px' }}>Your daily routine tasks. Completing these builds the habit.</p>
      </div>

      {bootcampData[activeDay - 1] && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '32px', marginBottom: '32px' }}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>Daily Focus</div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', color: 'var(--t1)', fontWeight: 300, marginBottom: '16px' }}>{bootcampData[activeDay - 1].theme}</h2>
          <p style={{ color: 'var(--t2)', fontSize: '15px', lineHeight: 1.8, marginBottom: '32px' }}>
            {bootcampData[activeDay - 1].description}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            {bootcampData[activeDay - 1].tasks.map((task, idx) => (
              <label key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', padding: '16px', border: '1px solid var(--border2)', borderRadius: '6px', backgroundColor: checkedTasks[idx] ? 'rgba(212, 175, 55, 0.05)' : 'transparent' }}>
                <input 
                  type="checkbox" 
                  checked={!!checkedTasks[idx]}
                  onChange={(e) => {
                    const newChecks = [...checkedTasks];
                    newChecks[idx] = e.target.checked;
                    setCheckedTasks(newChecks);
                  }}
                  style={{ marginTop: '4px', accentColor: 'var(--gold)', width: '18px', height: '18px' }}
                />
                <span style={{ color: checkedTasks[idx] ? 'rgba(255,255,255,0.5)' : 'var(--t1)', fontSize: '15px', lineHeight: 1.5, textDecoration: checkedTasks[idx] ? 'line-through' : 'none' }}>
                  {task}
                </span>
              </label>
            ))}
          </div>

          <button 
            disabled={savingRoutine || !checkedTasks.length || !checkedTasks.every(Boolean)}
            onClick={async () => {
              setSavingRoutine(true);
              await setDoc(doc(db, `dads/${user.uid}/progress`, `day_${activeDay}`), {
                completedAt: new Date().toISOString(),
                day: activeDay
              });
              alert("Daily Routine Locked In! Great work.");
              setSavingRoutine(false);
            }}
            className={(!checkedTasks.length || !checkedTasks.every(Boolean)) ? "btn-outline" : "btn-primary"} 
            style={{ width: '100%', textAlign: 'center' }}>
            {savingRoutine ? "Securing..." : "Lock In Daily Routine"}
          </button>
        </div>
      )}

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
