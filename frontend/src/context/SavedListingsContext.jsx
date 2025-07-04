import React, { createContext, useState, useCallback } from 'react';

export const SavedListingsContext = createContext({
  savedListings: [],
  refreshSavedListings: () => {},
  setSavedListings: () => {},
});

export const SavedListingsProvider = ({ children }) => {
  const [savedListings, setSavedListings] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const refreshSavedListings = useCallback(() => {
    setRefreshFlag(prev => !prev);
  }, []);

  return (
    <SavedListingsContext.Provider value={{ savedListings, setSavedListings, refreshSavedListings, refreshFlag }}>
      {children}
    </SavedListingsContext.Provider>
  );
};
