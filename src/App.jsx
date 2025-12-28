import React, { useState, useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, SkipForward, SkipBack, Heart, Home, ChevronDown, BookOpen } from 'lucide-react';

const App = () => {
  const [step, setStep] = useState(0); 
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  const [isManualNav, setIsManualNav] = useState(false); 
  const [transitionSpeed, setTransitionSpeed] = useState('0.8s');
 
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "I AM SO GLAD I COULD END 2025 WITH YOU IN MY LIFE";
 
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const finaleSurfer = useRef(null);

  const playlist = [
    {
      title: "Layla", artist: "Eric Clapton", songUrl: "/layla.mp3", cover: "/layla-cover.jpg", length: 422,
      note: "Eric Clapton wrote this song for his friend's wife based on the story of Layla-Majnu, a legend about a love so deep it's eternal. So when we first met, this is the song that I used to listen to nearly every day to give myself the confidence to win your heart and make you mine. Sounds sooo corny I know, hehe."
    },
    {
      title: "Apocalypse", artist: "Cigarettes After Sex", songUrl: "/apocalypse.mp3", cover: "/cas-cover.jpg", length: 290,
      note: "Do I even need to say why this song is in this list? Here's to my favorite night of this year: Us in each other's arm, listening to Apocalypse and kissing one another. It still feels like a dream honestly, that night but its all reallll yaaaayyy. I hope we have have more such nights within ourselves in the future ✨"
    },
    {
      title: "drive ME crazy!", artist: "Lil Yachty", songUrl: "/yachty.mp3", cover: "/yachty-cover.jpg", length: 197,
      note: "Girl ever since you came into my life, you are all that I can think of, you are all over my mind and even when i am doing something, your thoughts still linger in some corner of my mind. And so in broader sense you can say, you've been driving me crazyy"
    },
    {
      title: "We Might Even Be Falling In Love", artist: "Victoria Monét", songUrl: "/victoria.mp3", cover: "/victoria-cover.jpg", length: 51, isDarkTheme: true,
      note: "Lowk I put this song here to act as an interlude to show the shift from day to night. But also, ignoring the \"love\" part of the song, it also sorta represents how both of us slowly started to fall for one another and how we both told this to one another at night. ✨"
    },
    {
      title: "Darling, I", artist: "Tyler, The Creator", songUrl: "/darling.mp3", cover: "/darling-cover.jpg", length: 253, isDarkTheme: true,
      note: "Ignoring the \"love\" part and replacing it with \"like you sooooo much\"... this song is put here to show how irresistible it is to like you, and how much I'm just so glad that out of everyone in the world, it is you. Adoring you is just the easiest thing in the world. ❤️"
    },
    {
      title: "I was made for lovin' you", artist: "KISS", songUrl: "/kiss.mp3", cover: "/kiss-cover.jpg", length: 270, isDarkTheme: true,
      note: "I have already said all that I wanted to say so umm yeah, just enjoy the song!"
    }
  ];

  const currentTrack = playlist[trackIndex];

  // Dynamic Transition Logic
  useEffect(() => {
    if (trackIndex === 3 && step === 2 && !isManualNav) { setTransitionSpeed('20s'); } 
    else { setTransitionSpeed('0.6s'); }
  }, [trackIndex, step, isManualNav]);

  // Finale Logic (TV Girl)
  useEffect(() => {
    if (step === 3) {
      finaleSurfer.current = WaveSurfer.create({ container: document.createElement('div'), height: 0 });
      finaleSurfer.current.load('/tvgirl.mp3');
      finaleSurfer.current.on('ready', () => {
        finaleSurfer.current.setTime(0);
        finaleSurfer.current.setVolume(0.3);
        finaleSurfer.current.play();
      });
      finaleSurfer.current.on('finish', () => { finaleSurfer.current.setTime(0); finaleSurfer.current.play(); });
      let i = 0; setDisplayedText("");
      const typingTimer = setInterval(() => {
        setDisplayedText(fullText.slice(0, i + 1));
        i++; if (i === fullText.length) clearInterval(typingTimer);
      }, 70);
      return () => { if (finaleSurfer.current) finaleSurfer.current.destroy(); clearInterval(typingTimer); };
    }
  }, [step]);

  useEffect(() => { setIsDarkMode(!!currentTrack.isDarkTheme || step === 3); }, [trackIndex, currentTrack, step]);

  useEffect(() => {
    if (step === 2 && waveformRef.current) {
      if (wavesurfer.current) wavesurfer.current.destroy();
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(194, 24, 91, 0.15)',
        progressColor: isDarkMode ? '#ff9eb5' : '#c2185b',
        barWidth: 3, barGap: 3, barRadius: 3, height: 60, responsive: true, normalize: true,
      });
      wavesurfer.current.load(currentTrack.songUrl);
      wavesurfer.current.on('ready', () => wavesurfer.current.play());
      wavesurfer.current.on('audioprocess', (time) => setCurrentTime(time));
      wavesurfer.current.on('play', () => setIsPlaying(true));
      wavesurfer.current.on('pause', () => setIsPlaying(false));
      return () => wavesurfer.current.destroy();
    }
  }, [trackIndex, isDarkMode, step]);

  const handleNext = () => { setIsManualNav(false); if (trackIndex < playlist.length - 1) { setTrackIndex(i => i + 1); } else { if (wavesurfer.current) wavesurfer.current.pause(); setStep(3); } };
  const handleBack = () => { setIsManualNav(false); if (trackIndex > 0) { setTrackIndex(i => i - 1); } };
  const triggerManualNav = (action) => { setIsManualNav(true); if (wavesurfer.current) wavesurfer.current.destroy(); action(); };

  const styles = getStyles(isDarkMode, step, transitionSpeed);

  return (
    <div style={styles.page}>
      <div style={styles.darkBg}></div>
      <div style={styles.lightBg}></div>
      <div style={styles.patternOverlay}></div>

      {step > 0 && (
        <nav style={styles.navBar} className="fade-in">
          <button onClick={() => triggerManualNav(() => setStep(0))} style={styles.navLink}><Home size={16} /></button>
          <div style={styles.navDivider}></div>
          <button onClick={() => triggerManualNav(() => setStep(1))} style={styles.navLink}><BookOpen size={16} /></button>
          <div style={styles.navDivider}></div>
          <div className="nav-dropdown">
            <button style={styles.navLink}>Songs <ChevronDown size={12} /></button>
            <div className="dropdown-content" style={styles.dropdownContainer}>
              <div style={styles.dropdownList}>
                {playlist.map((song, i) => (
                  <button key={i} onClick={() => triggerManualNav(() => {setStep(2); setTrackIndex(i);})} style={styles.dropItem} className="drop-hover">{song.title}</button>
                ))}
              </div>
            </div>
          </div>
          <div style={styles.navDivider}></div>
          <button onClick={() => triggerManualNav(() => setStep(3))} style={styles.navLink}>Finale</button>
        </nav>
      )}

      <div style={styles.cardWrapper}>
        <div style={step === 3 ? styles.finalCard : styles.glassCard} className="fade-in">
          {step === 0 ? (
            <div style={styles.centerCol}>
              <span style={styles.topEmoji}>💝</span>
              <h1 style={styles.title}>Happy Monthiversary!</h1>
              <p style={styles.text}>To my favorite person... I built this little digital corner just for us to celebrate the time we've shared.</p>
              <button onClick={() => setStep(1)} style={styles.button}>Click Here To Start</button>
            </div>
          ) : step === 1 ? (
            <div style={styles.centerCol}>
              <h2 style={styles.subtitle}>INTRODUCTION</h2>
              <div style={styles.introBox}>
                <p style={styles.introText}>
                  Hey Shreya, It's finally been one month since we got together, and one month and one day extra since our first makeout hehehe. 
                  <br /><br />
                  So in celebration of our one month, I made this small website which is kind of a music player with a selected few songs that I've chosen based on my feelings regarding specific moments. I know you might find these songs "odd" or even weird but as soon as it speaks what I want to say then it might as well be odd, cause being normal is boring as hellll.
                  <br /><br />
                  <strong>How it Works?:</strong>
                  <br />
                  You're a smart little girl, I know you can figure it out. I've written a small little note for each song to tell why it belongs in this list. That's all I hope you enjoy this weird little gift of mine!
                </p>
              </div>
              <button onClick={() => setStep(2)} style={styles.button}>Click To Start</button>
            </div>
          ) : step === 2 ? (
            <div key={`song-${trackIndex}`} className="fade-in" style={styles.playerWrapper}>
                <div style={styles.vinylContainer} className={isPlaying ? "spinning" : ""}><img src={currentTrack.cover} style={styles.albumArt} alt="Cover" /></div>
                <h3 style={styles.songTitle}>{currentTrack.title}</h3>
                <p style={styles.artistName}>{currentTrack.artist}</p>
                <div style={styles.noteBox}><p style={styles.noteText}>"{currentTrack.note}"</p></div>
                <div style={styles.waveformContainer}>
                   <div style={styles.waveformClipper}><div ref={waveformRef} /></div>
                </div>
                <div style={styles.controlBar}>
                  <button onClick={handleBack} style={styles.navBtn}><SkipBack size={20} fill="currentColor" /></button>
                  <button onClick={() => wavesurfer.current.playPause()} style={styles.playButton}>{isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" style={{marginLeft: '4px'}} />}</button>
                  <button onClick={handleNext} style={styles.navBtn}><SkipForward size={20} fill="currentColor" /></button>
                </div>
                <button onClick={handleNext} style={styles.nextTrackHint}>{trackIndex < playlist.length - 1 ? "Next Track →" : "Continue to the end ❤️"}</button>
            </div>
          ) : (
            <div style={styles.centerCol}>
              <h1 style={styles.bigBanner}>{displayedText}<span className="cursor">|</span></h1>
              <div style={styles.photoGrid}>
                  {[1,2,3,4].map(n => <div key={n} style={{...styles.photoFrame, animationDelay: `${n*0.3}s`}} className="stagger-in"><img src={`/us${n}.jpeg`} style={styles.galleryImg} alt="" /></div>)}
              </div>
              <div style={styles.finalWordsBox} className="stagger-in">
                <p style={styles.finalText}>
                  Looking back at this month, I'm reminded of all the moments we shared together and how much I've treasure all of them. Thank you of being my favorite part of 2025 and I hope to spend many much moments and more with you next year as well. THANK YOUUU!!!!
                </p>
                <p style={styles.signature}>Your Forever and Always, SomSom</p>
              </div>

              {/* SPOTIFY EMBED IMPLEMENTED HERE */}
              <div style={styles.spotifyEmbedBox} className="stagger-in">
                <p style={styles.spotifyTitle}>A little take-home gift... ❤️</p>
                <iframe style={{borderRadius:'12px'}} src="https://open.spotify.com/embed/playlist/4I25FHK2JVKEVHoRwsVvl3?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
              </div>

              <button onClick={() => triggerManualNav(() => {setStep(0); setTrackIndex(0);})} style={styles.restartBtn} className="stagger-in">Restart Our Journey</button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap');
        @keyframes liquid { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes blink { 50% { opacity: 0; } }
        .spinning { animation: spin 12s linear infinite; } .fade-in { animation: fadeIn 1s ease-out forwards; }
        .stagger-in { opacity: 0; animation: fadeIn 1s ease-out forwards; } .cursor { animation: blink 0.8s infinite; color: #ff9eb5; }
        .nav-dropdown { position: relative; display: inline-block; } .dropdown-content { display: none; position: absolute; min-width: 200px; z-index: 2000; top: 100%; left: 50%; transform: translateX(-50%); }
        .nav-dropdown:hover .dropdown-content { display: block; } .drop-hover:hover { background: rgba(255,255,255,0.1) !important; color: #ff9eb5 !important; }
      `}</style>
    </div>
  );
};

const getStyles = (isDark, step, speed) => {
    const accent = isDark ? '#ff9eb5' : '#db2777';
    const cardBg = isDark ? 'rgba(15, 2, 12, 0.96)' : 'rgba(255, 255, 255, 0.85)';
    const transition = `all ${speed} ease-in-out`;

    return {
        page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontFamily: '"Poppins", sans-serif' },
        lightBg: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(45deg, #fbcfe8, #ffffff, #f9a8d4, #ffe4e6)', backgroundSize: '400% 400%', zIndex: -1, filter: 'blur(80px)', animation: 'liquid 20s ease infinite', opacity: isDark ? 0 : 1, transition: `opacity ${speed} ease-in-out` },
        darkBg: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(45deg, #1a0514, #0a0005, #2e0224, #12010c)', backgroundSize: '400% 400%', zIndex: -2, filter: 'blur(80px)', animation: 'liquid 20s ease infinite', opacity: isDark ? 1 : 0, transition: `opacity ${speed} ease-in-out` },
        patternOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, opacity: 0.05, backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20L0 20z' fill='${isDark ? '%23fff' : '%23db2777'}' /%3E%3C/svg%3E")`, transition },
        navBar: { position: 'fixed', top: '25px', background: cardBg, backdropFilter: 'blur(20px)', padding: '8px 20px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '12px', border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', zIndex: 3000, transition },
        navLink: { background: 'none', border: 'none', color: accent, fontWeight: '700', fontSize: '13px', cursor: 'pointer', opacity: 0.8, transition },
        navDivider: { width: '1px', height: '15px', background: accent, opacity: 0.2, transition },
        dropdownContainer: { paddingTop: '10px' },
        dropdownList: { background: cardBg, backdropFilter: 'blur(30px)', borderRadius: '20px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`, padding: '8px', transition },
        dropItem: { display: 'block', width: '100%', textAlign: 'left', padding: '10px 15px', background: 'none', border: 'none', color: isDark ? '#fff' : '#333', fontSize: '12px', fontWeight: '600', cursor: 'pointer', borderRadius: '10px', transition: '0.2s' },
        cardWrapper: { paddingTop: '60px', width: '100%', display: 'flex', justifyContent: 'center' },
        glassCard: { width: '90%', maxWidth: '440px', background: cardBg, backdropFilter: 'blur(45px)', borderRadius: '40px', padding: '40px 30px', textAlign: 'center', border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`, boxShadow: '0 40px 100px rgba(0,0,0,0.1)', transition },
        finalCard: { width: '95%', maxWidth: '700px', background: cardBg, backdropFilter: 'blur(45px)', borderRadius: '50px', padding: '50px 35px', textAlign: 'center', border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`, maxHeight: '85vh', overflowY: 'auto', transition },
        centerCol: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
        topEmoji: { fontSize: '42px', marginBottom: '10px' },
        title: { fontSize: '28px', color: accent, fontWeight: '800', marginBottom: '15px', transition },
        text: { color: isDark ? '#d1d5db' : '#555', fontSize: '15px', lineHeight: '1.6', marginBottom: '30px', transition },
        button: { background: accent, color: 'white', border: 'none', padding: '15px 45px', borderRadius: '22px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition },
        introBox: { background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', padding: '25px', borderRadius: '25px', marginBottom: '30px', textAlign: 'left', transition },
        introText: { color: isDark ? '#e5e7eb' : '#444', fontSize: '14px', lineHeight: '1.8', transition },
        subtitle: { color: accent, fontWeight: '800', fontSize: '22px', marginBottom: '20px', transition },
        playerWrapper: { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' },
        vinylContainer: { width: '180px', height: '180px', borderRadius: '50%', border: `8px solid ${isDark ? '#111' : '#fff'}`, boxShadow: '0 15px 35px rgba(0,0,0,0.2)', overflow: 'hidden', marginBottom: '25px', transition },
        albumArt: { width: '100%', height: '100%', objectFit: 'cover' },
        songTitle: { margin: '0', color: isDark ? '#fff' : '#111', fontWeight: '800', fontSize: '22px', transition },
        artistName: { color: accent, fontSize: '13px', fontWeight: '600', marginBottom: '15px', letterSpacing: '2px', textTransform: 'uppercase', transition },
        noteBox: { marginBottom: '25px', padding: '0 10px' },
        noteText: { color: isDark ? '#d1d5db' : '#666', fontStyle: 'italic', fontSize: '13px', lineHeight: '1.5', transition },
        waveformContainer: { position: 'relative', width: '100%', marginBottom: '35px', background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(194, 24, 91, 0.05)', borderRadius: '25px', padding: '10px 20px', transition },
        waveformClipper: { height: '50px', overflow: 'hidden' },
        controlBar: { display: 'flex', alignItems: 'center', gap: '25px' },
        playButton: { width: '64px', height: '64px', borderRadius: '50%', background: accent, border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition },
        navBtn: { background: 'none', border: 'none', color: accent, cursor: 'pointer', transition },
        nextTrackHint: { marginTop: '20px', background: 'none', border: 'none', color: accent, fontSize: '14px', fontWeight: '800', cursor: 'pointer', transition },
        bigBanner: { fontSize: '24px', color: accent, fontWeight: '900', marginBottom: '40px', lineHeight: '1.3', transition },
        photoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '40px' },
        photoFrame: { borderRadius: '20px', overflow: 'hidden', border: `4px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`, aspectRatio: '1/1', transition },
        galleryImg: { width: '100%', height: '100%', objectFit: 'cover' },
        finalWordsBox: { background: 'rgba(255,255,255,0.03)', padding: '25px', borderRadius: '25px', marginBottom: '30px', textAlign: 'left', transition },
        finalText: { color: isDark ? '#d1d5db' : '#444', fontSize: '14px', lineHeight: '1.8', transition },
        signature: { color: accent, fontWeight: '800', marginTop: '15px', fontSize: '18px', transition },
        restartBtn: { background: 'none', border: `2.5px solid ${accent}`, color: accent, padding: '12px 30px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', transition },
        // Spotify Styling
        spotifyEmbedBox: { width: '100%', padding: '20px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`, borderRadius: '25px', marginBottom: '30px', textAlign: 'center', transition },
        spotifyTitle: { fontSize: '13px', color: accent, fontWeight: '700', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }
    };
};

export default App;