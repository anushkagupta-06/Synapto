import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './contextapi';

const MassBunkContext = createContext();

export const useMassBunk = () => useContext(MassBunkContext);

export const MassBunkProvider = ({ children }) => {
  const{localuser}=useAuth();
  const [polls, setPolls] = useState([]);
  const [activePoll, setActivePoll] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/massbunk/polls`);
    setPolls(res.data);
    setActivePoll(res.data.find(p => p.status === 'open'));
    setHistory(res.data.filter(p => p.status === 'closed'));
  };

  const createPoll = async (reason) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/massbunk/create`, { reason,localuser});
    await fetchPolls();
    return res.data;
  };

  const votePoll = async (pollId, vote) => {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/massbunk/vote`, { pollId, vote,localuser });
    await fetchPolls();
  };

  const closePoll = async (pollId) => {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/massbunk/close`, { pollId ,localuser});
    await fetchPolls();
  };


    const markImposter = async (pollId, userId, localuser) => {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/massbunk/mark-imposter`, { pollId, userId, localuser });
    await fetchPolls();
  };

  return (
    <MassBunkContext.Provider value={{ polls, activePoll, history, createPoll, votePoll, closePoll,markImposter }}>
      {children}
    </MassBunkContext.Provider>
  );
};