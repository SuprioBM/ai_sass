type Education = {
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  location?: string; // added location here, since you have input for it
};

type Experience = {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
};


type Project = {
  name: string;
  description: string;
};

type Certificate = {
  name: string;
  issuer: string;
};

export type CvFormData = {
  name: string;
  email: string;
  phone: string;
  location: string; // optional top-level location if needed
  summary: string;
  linkedin: string;
  github: string;
  portfolio: string;
  education: Education[];
  experience: Experience[];
  skills: string[];
  languages: string[];
  projects: Project[];
  certificates: Certificate[];
  hobbies?: string[],
};



export type Job = {
  title?: string;
  company?: string;
  location?: string;
  description?: string;
  url?: string;
  [key: string]: any;
}