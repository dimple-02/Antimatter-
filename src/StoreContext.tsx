import React, { createContext, useContext, useState } from 'react';

interface StoreContextType {
  isAntimatter: boolean;
  toggleAntimatter: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  activeSection: number;
  setActiveSection: (idx: number) => void;
  selectedHotspot: string | null;
  setSelectedHotspot: (id: string | null) => void;
  foundEasterEgg: boolean;
  setFoundEasterEgg: (value: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAntimatter, setIsAntimatter] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>('energy');
  const [foundEasterEgg, setFoundEasterEgg] = useState(false);

  const toggleAntimatter = () => {
    setIsAntimatter(prev => {
      const next = !prev;
      if (next) {
        document.body.classList.add('antimatter-mode');
      } else {
        document.body.classList.remove('antimatter-mode');
      }
      return next;
    });
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  return (
    <StoreContext.Provider
      value={{
        isAntimatter,
        toggleAntimatter,
        soundEnabled,
        toggleSound,
        activeSection,
        setActiveSection,
        selectedHotspot,
        setSelectedHotspot,
        foundEasterEgg,
        setFoundEasterEgg,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
