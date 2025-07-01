// src/context/CvWizardContext.tsx
"use client";

import { CvFormData } from "@/types/Cv";
import { createContext, useContext, useState, ReactNode } from "react";

type CvWizardData = {
  userData: CvFormData;
  aiData: CvFormData;
  selectedTemplateId: string | null;
};

type CvWizardContextType = {
  data: CvWizardData;
  setUserData: (data: CvFormData) => void;
  setAiData: (data: CvFormData) => void;
  setSelectedTemplateId: (id: string) => void;
  resetWizard: () => void; // ✅ new reset function
};

const CvWizardContext = createContext<CvWizardContextType | undefined>(
  undefined
);

export const CvWizardProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<CvFormData>({} as CvFormData);
  const [aiData, setAiData] = useState<CvFormData>({} as CvFormData);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );

  // ✅ new reset function
  const resetWizard = () => {
    setUserData({} as CvFormData);
    setAiData({} as CvFormData);
    setSelectedTemplateId(null);
  };

  const value = {
    data: {
      userData,
      aiData,
      selectedTemplateId,
    },
    setUserData,
    setAiData,
    setSelectedTemplateId,
    resetWizard, // ✅ add to context
  };

  return (
    <CvWizardContext.Provider value={value}>
      {children}
    </CvWizardContext.Provider>
  );
};

export const useCvWizard = (): CvWizardContextType => {
  const context = useContext(CvWizardContext);
  if (!context) {
    throw new Error("useCvWizard must be used within a CvWizardProvider");
  }
  return context;
};
