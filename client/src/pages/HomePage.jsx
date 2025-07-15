import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import Spline from '@splinetool/react-spline';
import { useAuth } from '../context/contextapi';
import { Car, Bot, CalendarCheck2, Users, Upload, UserCircle, BellRing, HandMetal,ShieldAlert,GraduationCap, StickyNote, UsersRound } from 'lucide-react';

const generateStars = (count = 100) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const style = {
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${1 + Math.random() * 2}s`,
      opacity: Math.random(),
    };
    stars.push(<div key={i} className="star" style={style} />);
  }
  return stars;
};

const HomePage = () => {
    const{logout,localuser}=useAuth();
  const [phase, setPhase] = useState('spline'); // 'spline' → 'redirecting' → 'home'

 useEffect(() => {
  const hasSeenIntro = localStorage.getItem('hasSeenIntro');

  if (hasSeenIntro) {
    setPhase('home');
  } else {
    const splineTimer = setTimeout(() => setPhase('redirecting'), 4000);
    const redirectTimer = setTimeout(() => {
      setPhase('home');
      localStorage.setItem('hasSeenIntro', 'true');
    }, 7000);

    return () => {
      clearTimeout(splineTimer);
      clearTimeout(redirectTimer);
    };
  }

  // Remove intro flag on tab/window close
  const handleUnload = () => {
    localStorage.removeItem('hasSeenIntro');
  };

  window.addEventListener('unload', handleUnload);
  return () => {
    window.removeEventListener('unload', handleUnload);
  };
}, []);

  const Navbar = () => (
    <nav className="navbar translucent">
      <div className="navbar-content">
        <div className="navbar-title">SYNAPTO</div>
        <div className="navbar-links">
          {localuser ? (
            <>
              <Link to="/AIZonePage" className="nav-link"><Bot size={16} style={{ marginRight: '6px' }} />AI Zone</Link>
              <Link to="/attendance" className="nav-link"><CalendarCheck2 size={16} style={{ marginRight: '6px' }} />Attendance Tracker</Link>
              <Link to="/chat" className="nav-link"><Users size={16} style={{ marginRight: '6px' }} />Community</Link>
              <Link to="/professors" className="nav-link"><GraduationCap size={16} style={{ marginRight: '6px' }} />Professors</Link>
              <Link to="/notes" className="nav-link"><StickyNote size={16} style={{ marginRight: '6px' }} />Sticky Notes</Link>
              {/* <Link to="/notes-collab" className="nav-link"><UsersRound size={16} style={{ marginRight: '6px' }} />Notes Collab</Link> */}
              {localuser?.isAdmin && <Link to="/wtsp-alert" className="nav-link"><BellRing size={16} style={{ marginRight: '6px' }} />Alert Centre</Link>}
              
              <Link to="/subject-file-manager" className="nav-link"><Upload size={16} style={{ marginRight: '6px' }} />File Upload</Link>
             
             
              
              <Link to="/bunk" className="nav-link"><ShieldAlert size={16} style={{ marginRight: '6px' }} />Bunk</Link>
               <Link to="/profile" className="nav-link"><UserCircle size={16} style={{ marginRight: '6px' }} />Profile</Link>
              <p className="nav-link" onClick={logout}><HandMetal size={16} style={{ marginRight: '6px' }} />Logout</p>
            </>
          ) : (
            <Link to="/login" className="nav-link"><HandMetal size={16} style={{ marginRight: '6px' }} />Login</Link>
          )}
        </div>
      </div>
    </nav>
  );

  return (
    <>
      {phase === 'spline' && (
        <div className="spline-container fullscreen">
          <Spline scene="https://prod.spline.design/3WxrW7SgUd5J8a5o/scene.splinecode" />
        </div>
      )}

      {phase === 'redirecting' && (
        <div className="intro-loader">
          <div className="dots-loader">
            <span></span><span></span><span></span>
          </div>
          <h1 className="launch-text">
            <Car size={24} style={{ marginBottom: '-4px', marginRight: '8px' }} /> DRIVING TO HOME PAGE...
          </h1>
        </div>
      )}

 {phase === 'home' && (
  <div className="homepage-root">
    {/* Stars on entire background */}
    <div className="simple-stars">{generateStars(120)}</div>

    {/* Navbar */}
    <Navbar />

    {/* Spline Section (no stars inside) */}
    <div className="simple-spline-section">
      <Spline scene="https://prod.spline.design/yW1kHDXFLLzj5mAz/scene.splinecode" />
    </div>
  </div>
)}


    </>
  );
};

export default HomePage;
