import { useLayoutEffect } from 'react';
import { Scroll } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../StoreContext';

const TOTAL_SECTIONS = 7;

const hotspotCopy: Record<string, { title: string; body: string }> = {
  energy: {
    title: 'Energy Potential',
    body: 'When matter meets antimatter, nearly 100% of mass converts into energy. In principle, one gram can release energy comparable to a large conventional explosive.',
  },
  science: {
    title: 'Scientific Experiments',
    body: 'CERN studies anti-hydrogen to compare with hydrogen. Even tiny symmetry differences could reshape what we know about the origin of the universe.',
  },
  applications: {
    title: 'Real-world Applications',
    body: 'Positrons already power PET scans. Future uses could include precision propulsion and compact high-density energy systems if production scales.',
  },
};

export default function UIContainer() {
  const { isAntimatter, toggleAntimatter, soundEnabled, toggleSound, activeSection, selectedHotspot, foundEasterEgg } = useStore();

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const sections = gsap.utils.toArray<HTMLElement>('.story-section');
    sections.forEach((section) => {
      const panel = section.querySelector('.glass-panel');
      if (!panel) return;

      gsap.fromTo(
        panel,
        { y: 70, opacity: 0.45 },
        {
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'bottom 25%',
            scrub: 1.1,
          },
        },
      );

      const detailLines = section.querySelectorAll<HTMLElement>('.deep-note, .parallax-chip');
      if (detailLines.length > 0) {
        gsap.fromTo(
          detailLines,
          { y: 80, opacity: 0 },
          {
            y: -40,
            opacity: 1,
            ease: 'none',
            stagger: 0.08,
            scrollTrigger: {
              trigger: section,
              start: 'top 90%',
              end: 'bottom 15%',
              scrub: 0.85,
            },
          },
        );
      }

      const splitWords = section.querySelectorAll<HTMLElement>('.split-word');
      if (splitWords.length > 0) {
        gsap.fromTo(
          splitWords,
          { yPercent: 120, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.02,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 78%',
              end: 'top 40%',
              scrub: 0.5,
            },
          },
        );
      }
    });

    ['.section-interlude-a', '.section-interlude-b'].forEach((selector) => {
      ScrollTrigger.create({
        trigger: selector,
        start: 'top top',
        end: '+=65%',
        pin: true,
        scrub: 1,
      });
    });

    gsap.to('.chapter-rail span', {
      boxShadow: '0 0 22px rgba(117, 226, 255, 0.95)',
      repeat: -1,
      yoyo: true,
      duration: 1.8,
      ease: 'sine.inOut',
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.killTweensOf('.chapter-rail span');
    };
  }, []);

  useLayoutEffect(() => {
    const section = document.querySelector(`[data-section='${activeSection}']`);
    if (!section) return;

    const revealEls = section.querySelectorAll<HTMLElement>('[data-reveal]');

    gsap.fromTo(
      revealEls,
      { y: 32, opacity: 0, filter: 'blur(8px)' },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        overwrite: 'auto',
      },
    );
  }, [activeSection]);

  const activeCard = hotspotCopy[selectedHotspot ?? 'energy'];
  const progress = ((activeSection + 1) / TOTAL_SECTIONS) * 100;

  return (
    <Scroll html style={{ width: '100vw' }}>
      <header className="site-header">
        <div className="brand-mark" data-reveal>
          <span className="brand-eyebrow">Interactive Story</span>
          <h1>ANTIMATTER</h1>
          <p>The Invisible Opposite</p>
        </div>

        <button
          type="button"
          onClick={toggleAntimatter}
          className={`toggle-switch ${isAntimatter ? 'toggle-switch-active' : ''}`}
          aria-label="Toggle matter and antimatter color mode"
        >
          <span>Matter</span>
          <span className="toggle-thumb" />
          <span>Antimatter</span>
        </button>

        <button
          type="button"
          onClick={toggleSound}
          className={`toggle-switch ${soundEnabled ? 'toggle-switch-active' : ''}`}
          aria-label="Toggle ambient sci-fi sound"
        >
          <span>Audio</span>
          <span className="toggle-thumb" />
          <span>{soundEnabled ? 'On' : 'Off'}</span>
        </button>
      </header>

      <aside className="chapter-rail" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </aside>

      <div className="story-shell">
        <section className="story-section section-hero" data-section="0">
          <div className="glass-panel hero-panel" data-reveal>
            <span className="section-index">01</span>
            <h2>The Unknown Begins</h2>
            <p>
              <SplitRevealLine text="What if everything had an opposite... including you?" />
            </p>
            <small>Scroll to move deeper into a mirrored cosmos.</small>
          </div>
          <div className="parallax-chip" data-reveal>Void Signal 01: Tracking invisible parity signatures.</div>
          <p className="deep-note">An ocean of particles drifts beyond sight. Every shimmer might be a clue.</p>
        </section>

        <section className="story-section section-intro" data-section="1">
          <div className="intro-grid">
            <article className="glass-panel intro-side" data-reveal>
              <span className="section-index">02</span>
              <h2>What is Antimatter?</h2>
              <p>
                Every known particle has a partner with opposite charge. When they meet,
                both disappear in a bright conversion of mass into pure energy.
              </p>
            </article>

            <article className="glass-panel mirror-panel" data-reveal>
              <div className="mirror-col">
                <h3>Matter</h3>
                <ul>
                  <li>Electron carries negative charge</li>
                  <li>Proton is positively charged</li>
                  <li>Builds stars, planets, and us</li>
                </ul>
              </div>
              <div className="mirror-divider" />
              <div className="mirror-col antimatter-col">
                <h3>Antimatter</h3>
                <ul>
                  <li>Positron mirrors the electron</li>
                  <li>Antiproton mirrors the proton</li>
                  <li>Annihilates with matter on contact</li>
                </ul>
              </div>
            </article>
          </div>
          <p className="deep-note">Matter and antimatter are mathematically elegant twins, but physically explosive rivals.</p>
        </section>

        <section className="story-section section-interlude-a" data-section="2">
          <div className="glass-panel interlude-panel" data-reveal>
            <span className="section-index">Interlude A</span>
            <h3><SplitRevealLine text="Signal Drift: Crossing the Symmetry Threshold" /></h3>
            <p className="interlude-copy">
              For a brief moment, the universe pauses. Numbers align. Charges invert. Space itself seems to hold its breath.
            </p>
          </div>
        </section>

        <section className="story-section section-explore" data-section="3">
          <div className="glass-panel explore-panel" data-reveal>
            <span className="section-index">03</span>
            <h2>A Mirror Universe</h2>
            <p>
              The camera drifts through a tunnel where structures fold into their inverse.
              Matter patterns dissolve, antimatter waves emerge, and distance bends with depth.
            </p>
          </div>
          <div className="parallax-chip">Tunnel Drift: Quantum Layer 03</div>
          <p className="deep-note">Field oscillations increase as the camera nears a transition corridor.</p>
        </section>

        <section className="story-section section-insight" data-section="4">
          <div className="insight-grid">
            <article className="glass-panel insight-panel" data-reveal>
              <span className="section-index">04</span>
              <h2>Power and Danger</h2>
              <p>
                Select a glowing node in the 3D scene to inspect one dimension of antimatter.
              </p>

              <div className="hotspot-tags">
                <span className={selectedHotspot === 'energy' ? 'tag-active' : ''}>Energy</span>
                <span className={selectedHotspot === 'science' ? 'tag-active' : ''}>Experiments</span>
                <span className={selectedHotspot === 'applications' ? 'tag-active' : ''}>Applications</span>
              </div>
            </article>

            <article className="glass-panel hotspot-card" data-reveal>
              <h3>{activeCard.title}</h3>
              <p>{activeCard.body}</p>
              <div className="energy-burst" aria-hidden="true" />
            </article>
          </div>
          <p className="deep-note">The promise is limitless efficiency. The warning is total annihilation.</p>
        </section>

        <section className="story-section section-interlude-b" data-section="5">
          <div className="glass-panel interlude-panel" data-reveal>
            <span className="section-index">Interlude B</span>
            <h3><SplitRevealLine text="Annihilation Echo: Silence After Light" /></h3>
            <p className="interlude-copy">
              Matter and antimatter collide. A flash. Then almost nothing, except energy rippling outward like memory.
            </p>
          </div>
        </section>

        <section className="story-section section-future" data-section="6">
          <div className="glass-panel future-panel" data-reveal>
            <span className="section-index">05</span>
            <h2>The Future of Antimatter</h2>
            <p>
              <SplitRevealLine text="We stand at the edge of a force both elegant and dangerous. Whether it becomes a catalyst for discovery or a warning etched in starlight depends on how we choose to learn." />
            </p>
            <small>Antimatter is not only the opposite of matter. It is the opposite of certainty.</small>
          </div>
          <div className="parallax-chip">Final Broadcast: Human curiosity enters the unknown.</div>
          <p className="deep-note">The next breakthrough may arrive not as an answer, but as a better question.</p>

          {foundEasterEgg ? (
            <aside className="glass-panel easter-egg" data-reveal>
              Hidden signal decoded: You found a ghost positron drifting between realities.
            </aside>
          ) : null}
        </section>
      </div>

      <AmbientDrone enabled={soundEnabled} />
    </Scroll>
  );
}

function SplitRevealLine({ text }: { text: string }) {
  const words = text.split(' ');

  return (
    <span className="split-line" aria-label={text}>
      {words.map((word, idx) => (
        <span className="split-word-wrap" key={`${word}-${idx}`}>
          <span className="split-word">{word}</span>
          {idx < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}

function AmbientDrone({ enabled }: { enabled: boolean }) {
  useLayoutEffect(() => {
    if (!enabled) return;

    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const gain = context.createGain();
    gain.gain.value = 0;
    gain.connect(context.destination);

    const osc = context.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 62;

    const osc2 = context.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.value = 93;

    const lfo = context.createOscillator();
    lfo.frequency.value = 0.18;
    const lfoGain = context.createGain();
    lfoGain.gain.value = 0.015;

    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    osc.connect(gain);
    osc2.connect(gain);

    osc.start();
    osc2.start();
    lfo.start();

    gain.gain.linearRampToValueAtTime(0.06, context.currentTime + 1.6);

    return () => {
      gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.6);
      window.setTimeout(() => {
        osc.stop();
        osc2.stop();
        lfo.stop();
        context.close();
      }, 700);
    };
  }, [enabled]);

  return null;
}
