'use client';
import { useState } from 'react';
import Link from 'next/link';
import { db } from '../../lib/firebase';
import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { softAuditFeedback } from '../../lib/softAudit';

export default function KidDashboard() {
  const [code, setCode] = useState('');
  const [paired, setPaired] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [didAction, setDidAction] = useState<boolean | null>(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handlePair = async () => {
    const codeUpper = code.toUpperCase().trim();
    if (codeUpper.length !== 6) {
      setStatusMsg("Code must be 6 characters.");
      return;
    }
    
    setStatusMsg("Checking code...");
    const docRef = doc(db, "pairings", codeUpper);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      await updateDoc(docRef, { status: "connected" });
      setPaired(true);
      setCode(codeUpper);
      setStatusMsg("");
    } else {
      setStatusMsg("Invalid code. Tell Dad to check again.");
    }
  };

  const sendFeedback = async () => {
    if (rating === 0) {
      setStatusMsg("Please select a star rating first.");
      return;
    }
    
    setIsSending(true);
    setStatusMsg("Analyzing feedback for guidelines...");
    
    // Execute our soft audit logic
    const audit = await softAuditFeedback(feedback);
    
    // Push the comment securely to the Dad's dashboard
    await addDoc(collection(db, `pairings/${code}/feedback`), {
      rating,
      didAction,
      comment: audit.filteredText,
      safe: audit.safe,
      auditReason: audit.reason || "Passed",
      timestamp: new Date().toISOString()
    });

    setStatusMsg("Feedback securely sent to Dad! He will see it instantly.");
    setFeedback('');
    setRating(0);
    setIsSending(false);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '48px', maxWidth: '800px', margin: '0 auto' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '64px', alignItems: 'center' }}>
        <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', fontWeight: 300 }}>
          The <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Kid</span> UI
        </div>
        <Link href="/" style={{ fontFamily: '"DM Mono", monospace', fontSize: '11px', color: 'var(--t2)', textDecoration: 'none' }}>Back to Home</Link>
      </nav>

      {!paired ? (
        <div style={{ background: 'var(--surface)', padding: '48px', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '36px', color: 'var(--t1)', fontWeight: 300, marginBottom: '16px' }}>Link with Dad</h1>
          <p style={{ color: 'var(--t2)', marginBottom: '32px' }}>Enter the 6-digit code from your dad's app.</p>
          <input 
            type="text" 
            value={code} 
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ENTER CODE" 
            maxLength={6}
            style={{ width: '100%', maxWidth: '300px', padding: '16px', background: 'var(--bg)', border: '1px solid var(--border2)', color: 'var(--gold)', fontFamily: '"DM Mono", monospace', fontSize: '18px', textAlign: 'center', letterSpacing: '0.2em', marginBottom: '16px', outline: 'none', textTransform: 'uppercase' }}
          />
          <br/>
          {statusMsg && <p style={{ color: 'var(--gold)', fontSize: '12px', marginBottom: '16px', fontFamily: '"DM Mono", monospace' }}>{statusMsg}</p>}
          <button onClick={handlePair} className="btn-primary">Connect</button>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '48px' }}>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '48px', fontWeight: 300, color: 'var(--t1)', marginBottom: '16px' }}>Dad is on a mission.</h1>
            <p style={{ color: 'var(--t2)', fontSize: '18px' }}>He is actively trying to level up his relationship with you. How did he do this week?</p>
          </div>

          <div style={{ background: 'var(--surface)', padding: '32px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            
            <div style={{ marginBottom: '32px', padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
              <p style={{ color: 'var(--t1)', fontSize: '20px', marginBottom: '16px', fontFamily: '"Cormorant Garamond", serif', fontWeight: 500 }}>
                Dad is actively checking accountability boxes in his portal this week.<br/><br/><strong style={{color: 'var(--gold)'}}>Can you actually feel a concrete difference?</strong>
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                 <button onClick={() => setDidAction(true)} style={{ flex: 1, padding: '16px', background: didAction === true ? 'var(--gold)' : 'transparent', color: didAction === true ? '#000' : 'var(--t1)', border: '1px solid var(--gold)', borderRadius: '24px', fontWeight: 600, transition: 'all 0.2s', cursor: 'pointer' }}>Yes, definitely</button>
                 <button onClick={() => setDidAction(false)} style={{ flex: 1, padding: '16px', background: didAction === false ? '#222' : 'transparent', color: didAction === false ? '#fff' : 'var(--t1)', border: '1px solid var(--border)', borderRadius: '24px', transition: 'all 0.2s', cursor: 'pointer' }}>Not really</button>
              </div>
            </div>

            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', color: 'var(--gold)', fontWeight: 300, marginBottom: '16px' }}>Rate This Week</h2>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star} 
                  onClick={() => setRating(star)}
                  style={{ fontSize: '32px', background: 'none', border: 'none', cursor: 'pointer', color: rating >= star ? 'var(--gold)' : 'var(--border2)', transition: 'color 0.2s' }}
                >
                  ★
                </button>
              ))}
            </div>
            
            <h3 style={{ fontFamily: '"DM Mono", monospace', fontSize: '11px', color: 'var(--t3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Give him an idea for next time</h3>
            <textarea 
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Maybe next time we can go get ice cream..." 
              style={{ width: '100%', height: '120px', padding: '16px', background: 'var(--bg)', border: '1px solid var(--border2)', color: 'var(--t1)', fontFamily: 'Lora, serif', fontSize: '16px', borderRadius: '4px', resize: 'none', marginBottom: '16px', outline: 'none' }}
            />
            {statusMsg && <p style={{ color: 'var(--gold)', fontSize: '12px', marginBottom: '16px', fontFamily: '"DM Mono", monospace' }}>{statusMsg}</p>}
            <button onClick={sendFeedback} disabled={isSending} className="btn-primary" style={{ width: '100%', opacity: isSending ? 0.5 : 1 }}>
              {isSending ? "Processing..." : "Send Feedback to Dad"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
