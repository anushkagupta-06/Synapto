import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DeadlineContext = createContext();

export const useDeadlines = () => useContext(DeadlineContext);

export const DeadlineProvider = ({ children }) => {
  const [deadlines, setDeadlines] = useState([]);

  const fetchDeadlines = async (userId) => {
    const res = await axios.get(`/api/deadlines?userId=${userId}`);
    setDeadlines(res.data);
  };

  const addDeadline = async (deadlineData) => {
    const res = await axios.post('/api/deadlines', deadlineData);
    setDeadlines(prev => [...prev, res.data]);
  };

  const markDone = async (deadlineId) => {
    const res = await axios.put(`/api/deadlines/${deadlineId}/done`);
    setDeadlines(prev => prev.map(d => d._id === deadlineId ? res.data : d));
  };

  const savePhoneNumber = async (userId, phoneNumber) => {
    await axios.post('/api/deadlines/save-phone', { userId, phoneNumber });
  };

  return (
    <DeadlineContext.Provider value={{ deadlines, fetchDeadlines, addDeadline, markDone, savePhoneNumber }}>
      {children}
    </DeadlineContext.Provider>
  );
};
