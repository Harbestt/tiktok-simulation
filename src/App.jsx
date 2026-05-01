import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MicOff } from 'lucide-react';
import './index.css';

/* ============================================================
   GIFT DATA — mirrors the real TikTok gift catalog
   ============================================================ */
const GIFTS = [
  { id: 'rose',         name: 'Rose',         cost: 1,     img: '/gifts/rose.png',         tier: 'standard' },
  { id: 'finger_heart', name: 'Finger Heart', cost: 5,     img: '/gifts/finger_heart.png', tier: 'standard' },
  { id: 'ice_cream',    name: 'Ice Cream',    cost: 10,    img: '/gifts/ice_cream.png',     tier: 'standard' },
  { id: 'perfume',      name: 'Perfume',      cost: 20,    img: '/gifts/perfume.png',       tier: 'standard' },
  { id: 'love_you',     name: 'Love You',     cost: 99,    img: '/gifts/love_you.png',      tier: 'standard' },
  { id: 'diamond',      name: 'Diamond',      cost: 199,   img: '/gifts/diamond.png',       tier: 'standard' },
  { id: 'crown',        name: 'Crown',        cost: 500,   img: '/gifts/crown.png',         tier: 'premium' },
  { id: 'drama_queen',  name: 'Drama Queen',  cost: 999,   img: '/gifts/drama_queen.png',   tier: 'premium' },
  { id: 'swan',         name: 'Swan',         cost: 1999,  img: '/gifts/swan.png',          tier: 'premium' },
  { id: 'rocket',       name: 'Rocket',       cost: 2999,  img: '/gifts/rocket.png',        tier: 'premium' },
  { id: 'sports_car',   name: 'Sports Car',   cost: 7999,  img: '/gifts/sports_car.png',    tier: 'premium' },
  { id: 'lion',         name: 'Lion',         cost: 29999, img: '/gifts/lion.png',          tier: 'epic' },
  { id: 'universe',     name: 'Universe',     cost: 34999, img: '/gifts/universe.png',      tier: 'epic' },
  { id: 'tiktok_coin',  name: 'TikTok',       cost: 1,     img: '/gifts/tiktok_coin.png',   tier: 'standard' },
];

/* ============================================================
   FAKE CHAT MESSAGES
   ============================================================ */
const BASE_NAMES = ['olivia', 'jake', 'mia', 'king', 'luna', 'alex', 'nina', 'carlos', 'beauty', 'sam', 'emma', 'noah', 'ava', 'liam', 'sophia', 'mason', 'isabella', 'jacob', 'william', 'ethan', 'james', 'alexander', 'michael', 'benjamin', 'elijah', 'daniel', 'aiden', 'logan', 'matthew', 'lucas'];
const SUFFIXES = ['_xo', '_live', '_sparkle', '_official', '_99', '_vibes', '123', 'music', 'gaming', 'tv'];
const FAKE_USERS = Array.from({ length: 150 }, (_, i) => {
  const name = `${BASE_NAMES[Math.floor(Math.random() * BASE_NAMES.length)]}${SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)]}${Math.floor(Math.random() * 100)}`;
  return {
    name,
    avatar: `https://i.pravatar.cc/40?img=${(i % 70) + 1}`,
    level: Math.random() > 0.9 ? Math.floor(Math.random() * 40) + 10 : 0
  };
});

const BASE_COMMENTS = [
  'Hey!! 🔥', 'Love this stream!', 'Hi from Brazil 🇧🇷', 'You are amazing!! 💖', 'Say my name pls 🙏', '🥰🥰🥰', 'First time here!', 'How are you today?', 'Wow so beautiful ✨', 'Hello from Tokyo 🇯🇵', 'You deserve more followers!', 'Keep going! 💪', 'I love your content', 'Hiii 👋👋', 'Omg this is so cool', 'Can you sing for us? 🎤', 'I watch you every day', 'So pretty!', 'Hi from Germany 🇩🇪', 'boss up me', 'posso subir? amigo Portugal 🙏🙏', 'You dropped this 👑', 'Bro is so talented', 'W stream', 'Lets goooo', 'Chat moving too fast', 'Who else is new here?', 'My favorite tiktoker', 'Love the vibes here', 'Can I get a shoutout?', 'Please notice me 🥺', 'This is my comfort stream', 'Tap the screen guys!', 'Lets get to 100k likes', '🔥🔥🔥', '✨✨✨', 'omg yes', 'no way!!', 'What time is it there?', 'I wish I could stream like this', 'You are so funny', 'Haha true', 'Agree 100%'
];

const CHAT_TEXTS = Array.from({ length: 200 }, () => {
  const base = BASE_COMMENTS[Math.floor(Math.random() * BASE_COMMENTS.length)];
  const emojis = ['😂', '❤️', '🔥', '✨', '👏', '🥺', '💯', '💀'];
  const appendEmoji = Math.random() > 0.7 ? ` ${emojis[Math.floor(Math.random() * emojis.length)]}` : '';
  return base + appendEmoji;
});

const SYSTEM_MESSAGES = [
  'joined the LIVE',
  'shared the LIVE',
  'followed the host',
];

/* ============================================================
   SVG ICONS
   ============================================================ */
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconShare = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
  </svg>
);
const IconGift = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7"/>
    <path d="M7.5 8a2.5 2.5 0 010-5C9 3 12 8 12 8"/><path d="M16.5 8a2.5 2.5 0 000-5C15 3 12 8 12 8"/>
  </svg>
);
const IconHeart = () => (
  <svg viewBox="0 0 24 24" fill="#fe2c55" stroke="none">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);


/* ============================================================
   SPARKLE GENERATOR
   ============================================================ */
function Sparkles() {
  const particles = Array.from({ length: 30 }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 200;
    return {
      id: i,
      sx: `${Math.cos(angle) * dist}px`,
      sy: `${Math.sin(angle) * dist}px`,
      delay: `${Math.random() * 0.8}s`,
      size: 3 + Math.random() * 5,
      color: ['#ffb800', '#ff6b2c', '#fe2c55', '#25f4ee', '#fff'][Math.floor(Math.random() * 5)],
    };
  });
  return (
    <div className="sparkle-field">
      {particles.map(p => (
        <div key={p.id} className="sparkle" style={{
          left: '50%', top: '50%',
          width: p.size, height: p.size,
          background: p.color,
          '--sx': p.sx, '--sy': p.sy,
          animationDelay: p.delay,
        }} />
      ))}
    </div>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */
function App() {
  const [bgMode, setBgMode] = useState('image');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGiftPanel, setShowGiftPanel] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);
  const [giftTab, setGiftTab] = useState('Popular');

  const [coins, setCoins] = useState(50000);
  const [viewers, setViewers] = useState(2847);
  const [likes, setLikes] = useState(127400);

  const [chatMessages, setChatMessages] = useState([]);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [giftNotifs, setGiftNotifs] = useState([]);
  const [fullScreenGift, setFullScreenGift] = useState(null);

  // Multi-guest mock data
  const [guests, setGuests] = useState([
    { name: 'joeljul...', avatar: 'https://i.pravatar.cc/100?img=10', coins: '89.9K' },
    { name: 'joeljul...', avatar: 'https://i.pravatar.cc/100?img=12', coins: '29.9K' },
    { name: 'joeljul...', avatar: 'https://i.pravatar.cc/100?img=15', coins: '59.9K' },
    { name: 'Lisa ...', avatar: 'https://i.pravatar.cc/100?img=20', coins: '149.9K' },
    { name: 'joeljul...', avatar: 'https://i.pravatar.cc/100?img=25', coins: '29.9K' },
    { name: 'joeljul...', avatar: 'https://i.pravatar.cc/100?img=30', coins: '29.9K' },
    { name: 'Nana...', avatar: 'https://i.pravatar.cc/100?img=35', coins: '239.9K' },
    { name: 'steph....', avatar: 'https://i.pravatar.cc/100?img=40', coins: '209.9K' },
  ]);

  const chatEndRef = useRef(null);
  const heartColors = ['#fe2c55', '#ff6b81', '#ff4757', '#ff6348', '#e84393', '#fd79a8'];

  // ── Callbacks ──
  const handleLike = useCallback(() => {
    setLikes(prev => prev + 1);
    const id = Date.now() + Math.random();
    const color = heartColors[Math.floor(Math.random() * heartColors.length)];
    setFloatingHearts(prev => [...prev, { id, color, left: Math.random() * 30 }]);
    setTimeout(() => setFloatingHearts(prev => prev.filter(h => h.id !== id)), 2600);
  }, []);

  const triggerGiftNotif = useCallback((user, gift) => {
    const id = Date.now() + Math.random();
    const combo = 1 + Math.floor(Math.random() * 5);
    if (gift.id === 'rose') {
      setGiftNotifs(prev => [...prev.slice(-2), { id, user, gift, combo }]);
      setTimeout(() => setGiftNotifs(prev => prev.filter(n => n.id !== id)), 4000);
    }
  }, []);

  const handleSendGift = useCallback(() => {
    if (!selectedGift) return;
    if (coins < selectedGift.cost) {
      setShowGiftPanel(false);
      setShowTopUp(true);
      return;
    }
    setCoins(prev => prev - selectedGift.cost);
    setShowGiftPanel(false);
    const me = { name: 'You', avatar: 'https://i.pravatar.cc/40?img=47', level: 50 };
    if (selectedGift.tier === 'epic' || selectedGift.cost >= 5000) {
      setFullScreenGift({ gift: selectedGift, user: me, triggerId: Date.now() });
      // Let onEnded handle cleanup
    }
    triggerGiftNotif(me, selectedGift);
    setSelectedGift(null);
  }, [selectedGift, coins, triggerGiftNotif]);

  const handleTopUp = useCallback((amount) => {
    setCoins(prev => prev + amount);
    setShowTopUp(false);
  }, []);

  // ── Effects ──

  // Preload gift animation videos on mount
  useEffect(() => {
    const videoUrls = ['/videos/universe.mp4', '/videos/lion.mp4'];
    videoUrls.forEach(url => {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.muted = true;
      video.src = url;
      video.load();
    });
    // Also preload all gift images
    GIFTS.forEach(g => {
      const img = new Image();
      img.src = g.img;
    });
  }, []);

  // Auto-generate chat messages
  useEffect(() => {
    const interval = setInterval(() => {
      const user = FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)];
      const isSystem = Math.random() < 0.10;
      const msg = isSystem
        ? { user, text: SYSTEM_MESSAGES[Math.floor(Math.random() * SYSTEM_MESSAGES.length)], isSystem: true }
        : { user, text: CHAT_TEXTS[Math.floor(Math.random() * CHAT_TEXTS.length)], isSystem: false };
      setChatMessages(prev => [...prev.slice(-30), msg]);
    }, 400 + Math.random() * 600);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Viewer fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(prev => Math.max(100, prev + Math.floor(Math.random() * 21) - 10));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Simulate random gift sends from other users (Waves with pauses)
  useEffect(() => {
    let timeoutId;
    let giftsInCurrentWave = 0;
    
    const triggerNextGift = () => {
      // If we've sent a bunch of gifts in this wave (5 to 15 gifts), take a pause
      if (giftsInCurrentWave > 5 + Math.random() * 10) {
        giftsInCurrentWave = 0;
        // Pause between waves: 4 to 8 seconds
        timeoutId = setTimeout(triggerNextGift, 4000 + Math.random() * 4000);
        return;
      }
      
      // Otherwise, fire a gift rapidly (wave is active)
      if (Math.random() < 0.95) {
        const user = FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)];
        const roseGift = GIFTS.find(g => g.id === 'rose');
        triggerGiftNotif(user, roseGift);
        giftsInCurrentWave++;
      }
      
      // Fast interval during wave: 0.5 to 1.5 seconds
      timeoutId = setTimeout(triggerNextGift, 500 + Math.random() * 1000);
    };

    timeoutId = setTimeout(triggerNextGift, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  // Random huge gifts (Universe/Lion) automated trigger
  useEffect(() => {
    const interval = setInterval(() => {
      // 15% chance every 3 seconds to randomly fire a massive gift
      if (Math.random() < 0.15 && !fullScreenGift) {
        const bigGifts = GIFTS.filter(g => g.id === 'universe' || g.id === 'lion');
        const gift = bigGifts[Math.floor(Math.random() * bigGifts.length)];
        const user = FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)];
        triggerGiftNotif(user, gift);
        setFullScreenGift({ gift, user, triggerId: Date.now() });
        // No setTimeout here; let <video onEnded> handle it for epic gifts
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [fullScreenGift, triggerGiftNotif]);

  // Auto hearts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.6) {
        handleLike();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [handleLike]);


  
  // Debug/Test triggers: U = Universe, L = Lion
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'u' || key === 'l') {
        const giftId = key === 'u' ? 'universe' : 'lion';
        const gift = GIFTS.find(g => g.id === giftId);
        const user = FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)];
        triggerGiftNotif(user, gift);
        setFullScreenGift({ gift, user, triggerId: Date.now() });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.triggerUniverse = () => {
      const gift = GIFTS.find(g => g.id === 'universe');
      const user = FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)];
      triggerGiftNotif(user, gift);
      setFullScreenGift({ gift, user, triggerId: Date.now() });
    };
    window.triggerLion = () => {
      const gift = GIFTS.find(g => g.id === 'lion');
      const user = FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)];
      triggerGiftNotif(user, gift);
      setFullScreenGift({ gift, user, triggerId: Date.now() });
    };
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      delete window.triggerUniverse;
      delete window.triggerLion;
    };
  }, [triggerGiftNotif]);

  // Filter gifts by tab
  const filteredGifts = giftTab === 'Popular'
    ? GIFTS
    : giftTab === 'New'
    ? GIFTS.slice(0, 6)
    : GIFTS.filter(g => g.tier === 'epic' || g.tier === 'premium');

  return (
    <div className={`app bg-${bgMode} ${isFullscreen ? 'fullscreen' : ''}`}>



      <div className="phone-frame">

        {/* ── Top Bar ── */}
        <div className="top-bar">
          <div className="host-pill">
            <div className="host-tag">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '12px', height: '12px'}}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Host
            </div>
          </div>
          <div className="top-right">
            <div className="viewer-pill">
              <div className="live-dot" />
              {viewers.toLocaleString()}
            </div>

          </div>
        </div>

        {/* ── Multi-Guest Grid ── */}
        <div className="main-content-area">
          <div className="host-area">
            <img src="/enigma_logo.png" alt="Enigma Logo" className="enigma-logo" />
            <div className="host-name-label">Enigma World 👑</div>
          </div>
          <div className="guest-grid">
            {guests.map((g, i) => (
              <div key={i} className="guest-box">
                <div className="guest-coins">
                  <img src="/gifts/tiktok_coin.png" alt="coin" />
                  {g.coins}
                </div>
                <img src={g.avatar} alt={g.name} className="guest-avatar-small" />
                <span className="guest-name-small">{g.name}</span>
                <div className="guest-actions">
                  <div className="guest-btn">➕</div>
                  <div className="guest-btn"><MicOff size={14} color="rgba(255,255,255,0.7)" strokeWidth={2} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>





        {/* Gift Notif Stack (left) */}
        <div className="gift-notif-stack" style={{bottom: '380px'}}>
          {giftNotifs.map(n => (
            <div key={n.id} className="gift-notif">
              <img src={n.user.avatar || 'https://i.pravatar.cc/40?img=1'} alt="" className="notif-avatar" />
              <div className="notif-pill-content">
                <div className="notif-user">{n.user.name}</div>
                <div className="notif-action">sent {n.gift.name}</div>
              </div>
              <img src={n.gift.img} className="notif-gift-img" alt="gift" />
              <div className="notif-combo-text">x{n.combo}</div>
            </div>
          ))}
        </div>

        {/* Hearts Column */}
        <div className="hearts-column">
          {floatingHearts.map(h => (
            <div key={h.id} className="float-heart" style={{ left: h.left, color: h.color }}>
              ❤️
            </div>
          ))}
        </div>

        {/* Click zone for hearts */}
        <div className="middle-zone" onClick={handleLike} style={{height: '20%'}} />

        {/* ── Bottom Section ── */}
        <div className="bottom">
          <div className="chat-feed">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className="chat-row">
                <img src={msg.user.avatar} alt="" className="chat-avatar" />
                <div className="chat-bubble" style={{background: 'transparent', padding: '2px 0'}}>
                  {msg.user.level > 0 && (
                    <span className={`chat-username level-badge ${msg.user.level >= 30 ? 'purple' : ''}`}>
                      <span style={{fontSize: '8px'}}>💎</span>{msg.user.level}
                    </span>
                  )}
                  <span className="chat-username" style={{color: '#fff', opacity: 0.8}}>{msg.user.name}</span>
                  <span className={`chat-body ${msg.isSystem ? 'system' : ''} ${msg.isGift ? 'gift-msg' : ''}`}>
                    {msg.text}
                    {msg.giftImg && <img src={msg.giftImg} alt="" className="chat-gift-inline" />}
                  </span>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>


        </div>

        {/* ── Gift Panel ── */}
        {showGiftPanel && (
          <>
            <div className="gift-panel-backdrop" onClick={() => setShowGiftPanel(false)} />
            <div className="gift-panel">
              <div className="gift-panel-handle" />
              <div className="gift-tabs">
                {['Popular', 'New', 'Premium'].map(tab => (
                  <div key={tab}
                    className={`gift-tab ${giftTab === tab ? 'active' : ''}`}
                    onClick={() => setGiftTab(tab)}>
                    {tab}
                  </div>
                ))}
              </div>
              <div className="coin-row">
                <div className="coin-display">
                  <img src="/gifts/tiktok_coin.png" alt="coin" className="coin-icon" />
                  {coins.toLocaleString()}
                </div>
                <button className="recharge-btn" onClick={() => { setShowGiftPanel(false); setShowTopUp(true); }}>
                  Recharge
                </button>
              </div>
              <div className="gift-grid">
                {filteredGifts.map(gift => (
                  <div key={gift.id}
                    className={`gift-cell ${selectedGift?.id === gift.id ? 'selected' : ''}`}
                    onClick={() => setSelectedGift(gift)}>
                    <img src={gift.img} alt={gift.name} className="gift-cell-img" />
                    <span className="gift-cell-name">{gift.name}</span>
                    <span className="gift-cell-price">
                      <img src="/gifts/tiktok_coin.png" alt="" className="mini-coin" />
                      {gift.cost.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="send-row">
                <button className="send-gift-btn"
                  disabled={!selectedGift}
                  onClick={handleSendGift}>
                  {selectedGift ? `Send ${selectedGift.name}` : 'Select a gift'}
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── Top Up Modal ── */}
        {showTopUp && (
          <div className="modal-backdrop" onClick={() => setShowTopUp(false)}>
            <div className="topup-modal" onClick={e => e.stopPropagation()}>
              <div className="topup-title">Recharge Coins</div>
              <div className="topup-subtitle">Balance: {coins.toLocaleString()} coins</div>
              <div className="topup-grid">
                {[
                  { amount: 100,   price: '$1.29' },
                  { amount: 500,   price: '$6.49', bonus: '+50 bonus' },
                  { amount: 1000,  price: '$12.99', bonus: '+150 bonus' },
                  { amount: 5000,  price: '$64.99', bonus: '+1000 bonus' },
                  { amount: 10000, price: '$129.99', bonus: '+3000 bonus' },
                  { amount: 50000, price: '$649.99', bonus: '+15000 bonus' },
                ].map(opt => (
                  <div key={opt.amount} className="topup-option" onClick={() => handleTopUp(opt.amount + (opt.bonus ? parseInt(opt.bonus.replace(/\D/g,'')) : 0))}>
                    <div className="topup-coins">
                      <img src="/gifts/tiktok_coin.png" alt="" />
                      {opt.amount.toLocaleString()}
                    </div>
                    <div className="topup-price">{opt.price}</div>
                    {opt.bonus && <div className="topup-bonus">{opt.bonus}</div>}
                  </div>
                ))}
              </div>
              <button className="topup-cancel" onClick={() => setShowTopUp(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* ── Full-Screen Gift Animation ── */}
        {fullScreenGift && (
          <div className="fullscreen-gift-overlay">
            <div className="fullscreen-gift-bg" />
            
            {/* If video files exist, they will play here. Otherwise, CSS particles show. */}
            {(fullScreenGift.gift.id === 'lion' || fullScreenGift.gift.id === 'universe') ? (
              <video 
                key={fullScreenGift.triggerId} 
                autoPlay 
                playsInline
                className={`fullscreen-gift-video gift-${fullScreenGift.gift.id}`}
                onEnded={() => setFullScreenGift(null)}
                src={`/videos/${fullScreenGift.gift.id}.mp4`}
                onError={(e) => {
                  console.error("Video failed to load:", fullScreenGift.gift.id);
                  setFullScreenGift(null);
                }}
              />
            ) : null}

            {!(fullScreenGift.gift.id === 'lion' || fullScreenGift.gift.id === 'universe') && (
              <>
                <Sparkles />
                <img src={fullScreenGift.gift.img} alt="" className="fullscreen-gift-img" />
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
