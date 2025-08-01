import React, { useState, useEffect } from 'react';
import { Menu, MapPin, Clock, User, LogIn, Sparkles } from 'lucide-react';
import { useNavigate ,Link} from 'react-router-dom';
import { useAuth } from '../context/contextapi';

export default function SynaptoHomePage() {
       const navigate = useNavigate()
       const{localuser}=useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName, setUserName] = useState('Synaptian');
  
  const [location, setLocation] = useState('Getting location...');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          
          const lat = position.coords.latitude.toFixed(2);
          const lon = position.coords.longitude.toFixed(2);
          setLocation(`${lat}°, ${lon}°`);
        },
        () => {
          setLocation('Location unavailable');
        }
      );
    } else {
      setLocation('Location not supported');
    }
  }, []);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  // Format time
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    if (name.trim()) {
      setUserName(name);
      setIsLoggedIn(true);
      setShowLoginModal(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setUserName('');
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 via-purple-600 to-indigo-800 text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-purple-300 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center p-6">
        <Menu className="w-6 h-6" />
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm opacity-80">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6">
        {/* Window illustration */}
        <div className="mb-8 relative">
          <div className="w-32 h-20 bg-gradient-to-b from-purple-400 to-purple-600 rounded-lg relative overflow-hidden shadow-2xl">
            <div className="absolute inset-2 bg-gradient-to-b from-indigo-900 to-purple-900 rounded">
              <div className="absolute top-2 left-2 w-2 h-2 bg-yellow-400 rounded-full opacity-80"></div>
              <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full opacity-60"></div>
              <div className="absolute bottom-2 left-2 right-2 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded opacity-70"></div>
            </div>
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-gray-700 rounded-full opacity-60"></div>
        </div>

        {/* Greeting and Name */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-light mb-2 opacity-90">
            {getGreeting()},
          </h1>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            {userName || 'Guest User'}
          </h2>
        </div>

        {/* Time Display */}
        <div className="flex items-center space-x-2 mb-8 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
          <Clock className="w-5 h-5" />
          <span className="text-lg font-mono">{formatTime(currentTime)}</span>
        </div>

        {/* Explore Features Button */}

        <Link to="/dashboard"> <button className="group relative mb-6 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            

            <span>Explore Features</span>
          </div>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-full transition-opacity"></div>
        </button></Link>
       

        {/* App Name */}
        <div className="text-center">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
            Synapto
          </h3>
          <p className="text-sm opacity-70 mt-1">Your ECE Companion</p>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-semibold mb-4 text-center">Welcome to Synapto</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 opacity-90">
                  
                </label>
                <input
                  type="text"
                  id="nameInput"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-white/50"
                  placeholder="Enter your name"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const nameInput = document.getElementById('nameInput');
                    const name = nameInput.value.trim();
                    if (name) {
                      setUserName(name);
                      setIsLoggedIn(true);
                      setShowLoginModal(false);
                    }
                  }}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-lg font-semibold transition-all transform hover:scale-105"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="relative z-10 text-center p-6 opacity-60">
        <p className="text-xs">
          {currentTime.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
    </div>
  );
}