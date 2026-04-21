'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [copyText, setCopyText] = useState('⎘ Copy link');

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
        }
      });
    }, { threshold: 0.08 });
    
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    
    return () => obs.disconnect();
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopyText('✓ Copied!');
      setTimeout(() => setCopyText('⎘ Copy link'), 2000);
    });
  };

  return (
    <>
      <nav>
        <Link href="#" className="nav-logo">The <span>Daughter</span> Coach</Link>
        <div className="nav-right">
          <Link href="#story" className="nav-link">The story</Link>
          <Link href="#botw" className="nav-link">Best of week</Link>
          <Link href="#research" className="nav-link">Research</Link>
          <Link href="/app/dashboard" className="nav-btn">Start free →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-eyebrow">For dads who don't need the credit</div>
        <h1>
          She's the <em>hero.</em>
          <span className="line2">You're the force behind her.</span>
        </h1>
        <div className="hero-divider"></div>
        <p className="hero-sub">
          The best dads are like Yoda — <strong>strong, silent, shows up, doesn't need credit.</strong> They do the work nobody sees. And one day their daughter walks into her life fully formed, and she knows exactly where that came from.
        </p>
        <div className="hero-actions">
          <Link href="/app/dashboard" className="btn-primary">Start my first session →</Link>
          <Link href="#story" className="btn-outline">Read the story</Link>
        </div>
        <div className="hero-stats">
          <div><div className="stat-num">35+</div><div className="stat-label">Years of research</div></div>
          <div><div className="stat-num">3</div><div className="stat-label">World-class researchers</div></div>
          <div><div className="stat-num">1</div><div className="stat-label">Assignment per week</div></div>
          <div><div className="stat-num">20%</div><div className="stat-label">Win the cash pot</div></div>
        </div>
      </section>

      {/* BRAND STORY — YODA */}
      <section className="brand-story" id="story">
        <div className="brand-inner">
          <div className="brand-label">The framework</div>
          <div className="yoda-grid">
            <div className="yoda-left">
              <h2 className="yoda-headline reveal">You are <em>not</em> the hero<br/>of this story.</h2>
              <div className="yoda-body">
                <p>Luke needed Yoda. Not because Yoda had all the answers — but because Yoda <strong>showed up consistently, asked the right questions, and never made it about himself.</strong></p>
                <p>Your daughter is on a journey. She's figuring out who she is, whether she's worth loving, how to trust people, what she's capable of. She doesn't need you to solve it.</p>
                <p>She needs you to be the <strong>constant, quiet force</strong> that makes her journey possible. The one who's already there when she turns around. The one who never needed credit for it.</p>
                <p style={{color: 'var(--t1)', fontStyle: 'italic'}}>That's the job. That's the whole job.</p>
              </div>
            </div>
            <div className="yoda-right reveal">
              <div className="yoda-traits">
                <div className="yoda-trait">
                  <div className="trait-word">Strong.</div>
                  <div className="trait-desc">Emotionally steady when she's not. The rock she pushes off of.</div>
                </div>
                <div className="yoda-trait">
                  <div className="trait-word">Silent.</div>
                  <div className="trait-desc">Listens more than he talks. Doesn't fill every silence with advice.</div>
                </div>
                <div className="yoda-trait">
                  <div className="trait-word">Shows up.</div>
                  <div className="trait-desc">For the recital he doesn't understand. The game he can't follow. The Tuesday that matters.</div>
                </div>
                <div className="yoda-trait">
                  <div className="trait-word">No credit needed.</div>
                  <div className="trait-desc">Does the work in the dark. Doesn't keep score. Doesn't need to be thanked.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE REAL STAKES */}
      <section className="stakes">
        <div className="stakes-inner">
          <div className="stakes-quote reveal">
            "Fathers have measurable, long-term impact on their daughters' romantic relationships, career success, mental health, and self-worth — often more than any other single factor."
          </div>
          <div className="stakes-attribution">— Dr. Linda Nielsen, Wake Forest University · 35 years of research on father-daughter relationships</div>
          <div className="stakes-grid">
            <div className="stakes-card reveal">
              <div className="stakes-icon">♡</div>
              <div className="stakes-title">Who she loves</div>
              <div className="stakes-text">Nielsen's data is clear: the dad-daughter relationship sets the template for every romantic relationship she'll ever have. You are teaching her what she deserves.</div>
            </div>
            <div className="stakes-card reveal">
              <div className="stakes-icon">◈</div>
              <div className="stakes-title">How she sees herself</div>
              <div className="stakes-text">Siegel's neuroscience shows that secure attachment physically builds the prefrontal cortex — the part of the brain responsible for confidence, self-regulation, and resilience.</div>
            </div>
            <div className="stakes-card reveal">
              <div className="stakes-icon">→</div>
              <div className="stakes-title">What she becomes</div>
              <div className="stakes-text">Gottman's 40 years of research links emotional coaching from fathers directly to career achievement, emotional intelligence, and the ability to form deep relationships.</div>
            </div>
          </div>
        </div>
      </section>

      {/* BEST OF THE WEEK */}
      <section className="botw" id="botw">
        <div className="botw-inner">
          <div className="botw-header">
            <h2 className="botw-title">Best of<br/>the Week.</h2>
            <p className="botw-sub">Real dads.<br/>Real moments.<br/>Submitted anonymously.</p>
          </div>

          <div className="botw-featured reveal">
            <div className="botw-week">↳ This week's story · Week of Apr 5</div>
            <div className="botw-story">
              "She had a bad day at school. I could feel myself starting to troubleshoot — figuring out who was wrong, what the fix was. I remembered the assignment. I just said 'that sounds really hard' and shut up. We sat in the car in the driveway for 22 minutes. She talked the whole time. She got out, said 'thanks Dad,' and went inside. I don't think she even realized what happened. I did."
            </div>
            <div className="botw-principle">↳ Principle #8 — Listen without solving · Gottman</div>
          </div>

          <div className="botw-grid">
            <div className="botw-card reveal">
              <div className="botw-card-week">Week of Mar 29</div>
              <div className="botw-card-story">"Took her to the pottery class she'd been asking about for 6 months. I made something terrible. She laughed so hard she cried. I took a photo."</div>
              <div className="botw-card-tag">Principle #6 — Show up for what she loves</div>
            </div>
            <div className="botw-card reveal">
              <div className="botw-card-week">Week of Mar 22</div>
              <div className="botw-card-story">"I told her I was wrong about something I'd been wrong about for 2 years. She got very quiet. Then she said 'I know.' That was it. It was everything."</div>
              <div className="botw-card-tag">Principle #3 — Let her see you be human</div>
            </div>
            <div className="botw-card reveal">
              <div className="botw-card-week">Week of Mar 15</div>
              <div className="botw-card-story">"Saturday pancakes. Third week in a row. She brought a friend this time without asking. I think that means something."</div>
              <div className="botw-card-tag">Principle #4 — Build reliable traditions</div>
            </div>
          </div>
        </div>
      </section>

      {/* THE 10 PRINCIPLES */}
      <section className="principles" id="principles">
        <div className="principles-inner">
          <div className="principles-intro">
            <h2 className="reveal">Ten principles.<br/><em>All research-backed.</em><br/>One at a time.</h2>
            <p className="reveal">The coach never gives you all ten at once. <strong>One or two at a time, compounding over months.</strong> That's how behavior actually changes. That's what the research says.</p>
          </div>
          <div className="p-grid">
            <div className="p-item reveal"><div className="p-num">#01 · GOTTMAN</div><div className="p-text">No agenda. Just listen.</div><div className="p-source">Emotion coaching — no redirecting</div></div>
            <div className="p-item reveal"><div className="p-num">#02 · GOTTMAN</div><div className="p-text">Ask about her world, not her performance.</div><div className="p-source">Open-ended questions build deep trust</div></div>
            <div className="p-item reveal"><div className="p-num">#03 · SIEGEL</div><div className="p-text">Let her see you be human.</div><div className="p-source">Rupture & repair — the repair is everything</div></div>
            <div className="p-item reveal"><div className="p-num">#04 · NIELSEN</div><div className="p-text">Build traditions she can count on.</div><div className="p-source">Consistency is the #1 father-daughter variable</div></div>
            <div className="p-item reveal"><div className="p-num">#05 · NIELSEN</div><div className="p-text">"You're beautiful, period."</div><div className="p-source">You set the template for every man after you</div></div>
            <div className="p-item reveal"><div className="p-num">#06 · GOTTMAN</div><div className="p-text">Show up for what she loves — even when you don't get it.</div><div className="p-source">Turning toward vs. turning away</div></div>
            <div className="p-item reveal"><div className="p-num">#07 · SIEGEL</div><div className="p-text">Photos on the messy days.</div><div className="p-source">Presence over performance — always</div></div>
            <div className="p-item reveal"><div className="p-num">#08 · GOTTMAN</div><div className="p-text">Listen without solving.</div><div className="p-source">Validate before you advise — every time</div></div>
            <div className="p-item reveal"><div className="p-num">#09 · NIELSEN</div><div className="p-text">Speak to who she is, not what she does.</div><div className="p-source">Character naming is armor she carries forever</div></div>
            <div className="p-item reveal"><div className="p-num">#10 · SIEGEL</div><div className="p-text">Be proud of her heart, not her grades.</div><div className="p-source">The 4 S's — Safe, Seen, Soothed, Secure</div></div>
          </div>
        </div>
      </section>

      {/* RESEARCH */}
      <section className="research" id="research">
        <div className="research-inner">
          <div className="research-label">The research team</div>
          <div className="research-grid">
            <div className="r-card reveal">
              <div className="r-initial">N</div>
              <div className="r-name">Dr. Linda Nielsen</div>
              <div className="r-inst">Wake Forest University<br/>35+ years · Father-Daughter Specialist</div>
              <div className="r-finding">The foremost researcher in the world specifically studying father-daughter relationships. Her data spans mental health, self-confidence, career success, romantic relationships, and financial outcomes — all tied to the father's consistency and presence.</div>
              <div className="r-book">Father-Daughter Relationships: Contemporary Research and Issues · 2nd Ed.</div>
            </div>
            <div className="r-card reveal">
              <div className="r-initial">G</div>
              <div className="r-name">Dr. John Gottman</div>
              <div className="r-inst">The Gottman Institute<br/>40 years · 200+ published papers</div>
              <div className="r-finding">Gold standard in relationship science. His emotion coaching framework — awareness, validation, guidance — predicts a child's emotional intelligence and resilience across their lifetime. "Turning toward" in small moments determines everything.</div>
              <div className="r-book">Raising an Emotionally Intelligent Child · The Gottman Institute</div>
            </div>
            <div className="r-card reveal">
              <div className="r-initial">S</div>
              <div className="r-name">Dr. Dan Siegel</div>
              <div className="r-inst">UCLA · Mindsight Institute<br/>Harvard MD · Attachment Neuroscience</div>
              <div className="r-finding">His 4 S's — Safe, Seen, Soothed, Secure — define what children need from fathers. Secure attachment physically strengthens the prefrontal cortex. The rupture is inevitable. The repair is what's essential.</div>
              <div className="r-book">The Power of Showing Up · Mindsight Institute</div>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="manifesto">
        <div className="manifesto-inner">
          <div className="manifesto-label">The dad we're building toward</div>
          <h2 className="reveal">"The best dads make themselves<br/>quietly irreplaceable."</h2>
          <ul className="manifesto-lines">
            <li className="reveal">He doesn't need to be the <span>loudest</span> in the room.</li>
            <li className="reveal">He needs to be the most <span>consistent</span>.</li>
            <li className="reveal">He doesn't need her to say <span>thank you</span>.</li>
            <li className="reveal">He needs to <span>show up</span> anyway.</li>
            <li className="reveal">He doesn't need to fix <span>everything</span>.</li>
            <li className="reveal">He needs to be there for <span>anything</span>.</li>
            <li className="reveal">He does the work in the <span>dark.</span></li>
            <li className="reveal">And one day, in a quiet moment,<br/>she'll know <span>exactly</span> where she got it from.</li>
          </ul>
          <p className="manifesto-cta reveal">That's the dad this tool is building. One weekly assignment at a time.</p>
          <Link href="/app/dashboard" className="btn-primary reveal">I want to be that dad →</Link>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta" id="app">
        <div className="final-inner">
          <h2>We will pay you to be<br/>a <em>better father.</em></h2>
          <p>A $100 annual buy-in. Do the weekly assignments. Get voted into the top 20% by your kids. Get paid out from the collective pot of the dads who didn't show up.</p>
          <Link href="/app/dashboard" className="btn-primary">Buy Into The Pool →</Link>
          <div className="final-free">Secure Google Auth · Processed via Stripe · 50% community payout</div>
        </div>
      </section>

      {/* SHARE */}
      <section className="share-bar">
        <p>Send this to a dad who needs it</p>
        <p className="share-bar-sub">The best marketing for this is a dad texting another dad.</p>
        <div className="share-btns">
          <a className="share-btn gold" href="#" target="_blank">𝕏 Post on X</a>
          <a className="share-btn" href="#" target="_blank">✉ Text a dad</a>
          <button className="share-btn" onClick={copyLink}>{copyText}</button>
          <a className="share-btn" href="#" target="_blank">in LinkedIn</a>
          <a className="share-btn" href="#" target="_blank">⬡ Facebook</a>
        </div>
      </section>

      <footer>
        <div className="footer-logo">The <span>Daughter</span> Coach</div>
        <div className="footer-right">
          Research: Dr. Linda Nielsen · Wake Forest University<br/>
          Dr. John Gottman · The Gottman Institute<br/>
          Dr. Dan Siegel · UCLA Mindsight Institute<br/>
          <span style={{color: '#444', marginTop: '6px', display: 'block'}}>Built by a dad who got the question right.</span>
        </div>
      </footer>
    </>
  );
}
