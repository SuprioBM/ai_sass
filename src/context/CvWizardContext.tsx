// src/context/CvWizardContext.tsx
"use client";

import { CvFormData } from "@/types/Cv";
import { createContext, useContext, useState, ReactNode } from "react";
import { set } from "react-hook-form";

type CvWizardData = {
  userData: CvFormData;
  aiData: CvFormData; // replace 'any' with a proper type for user form data
  selectedTemplateId: string | null;
};

type CvWizardContextType = {
  data: CvWizardData;
  setUserData: (data: CvFormData) => void;
  setAiData: (data: CvFormData) => void; // Optional, if you want to set AI data
  setSelectedTemplateId: (id: string) => void;
};

const CvWizardContext = createContext<CvWizardContextType | undefined>(undefined);

export const CvWizardProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<CvFormData>({} as CvFormData);
  const [aiData, setAiData] = useState<CvFormData>({} as CvFormData); // replace 'any' with a proper type for AI data
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );

  const value = {
    data: {
      userData,
      aiData,
      selectedTemplateId,
    },
    setUserData,
    setAiData,
    setSelectedTemplateId,
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
