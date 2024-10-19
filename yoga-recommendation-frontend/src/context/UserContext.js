import { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userAnswers, setUserAnswers] = useState({});

  const updateUserAnswer = (question, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [question]: answer,
    }));
  };

  return (
    <UserContext.Provider value={{ userAnswers, updateUserAnswer }}>
      {children}
    </UserContext.Provider>
  );
  

};
