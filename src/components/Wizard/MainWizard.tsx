"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler,FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import PersonalInfoForm from "./WizardSteps/PersonalInfoForm";
import WorkExperienceForm from "./WizardSteps/Experience";
import EducationForm from "./WizardSteps/Education";
import SkillsForm from "./WizardSteps/Skills";
import ProjectsForm from "./WizardSteps/Projects";
import CertificationsForm from "./WizardSteps/Certificates";
import LanguagesForm from "./WizardSteps/Languages";
import TemplatePreviewSelector from "../CvTemplates/TemplatePreviewSelector";
import { dummyData } from "@/lib/Data";
import { templates } from "@/lib/Data";
import { pdf } from "@react-pdf/renderer";
import JobDescriptionStep from "./WizardSteps/JobDescription";
import { useRouter } from "next/navigation";
import { useCvWizard } from "@/context/CvWizardContext";
import { generateImageFromPdfBlob } from "@/lib/pdftoimage";
import { CvFormData } from "@/types/Cv";




export type Experience = {
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type Education = {
  degree: string;
  school: string;
  startDate: string;
  endDate: string;
};

export type Project = {
  name: string;
  description: string;
};

export type Certificate = {
  name: string;
  issuer: string;
};

export type FormData = {
  name: string;
  email: string;
  phone: string;
  location: string;
  jobTitle?: string; // Optional field for job title
  linkedin?: string;
  github?: string;
  portfolio?: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certificates: Certificate[];
  languages: string[];
  jobDescription: string;
};

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(7, "Phone is required"),
  location: z.string().min(2, "Location is required"),
  jobTitle: z.string().optional(),
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
  portfolio: z.string().url().optional(),
  summary: z.string().min(10, "Summary is required"),
  experience: z.array(
    z.object({
      role: z.string(),
      company: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      description: z.string(),
    })
  ),
  education: z.array(
    z.object({
      degree: z.string(),
      school: z.string(),
      startDate: z.string(),
      endDate: z.string(),
    })
  ),
  skills: z.array(z.string()),
  projects: z.array(
    z.object({
      name: z.string().min(2, "Project name is required"),
      description: z
        .string()
        .min(10, "Project description is required")
        .max(100, "Description too long"),
    })
  ),
  certificates: z.array(
    z.object({
      name: z.string(),
      issuer: z.string(),
    })
  ),
  languages: z.array(z.string()),
  jobDescription: z.string(),
});

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  jobTitle: "",
  github: "",
  portfolio: "",
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certificates: [],
  languages: [],
  jobDescription: "",
};

export default function MainWizard() {
  const [step, setStep] = useState(1);
  const [aiGeneratedData, setAiGeneratedData] = useState<CvFormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const router = useRouter();
  const { setAiData } = useCvWizard();
  const [aiPreviewImage, setAiPreviewImage] = useState<string | null>(null);


  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
} = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormData,
    mode: "onBlur",
  });
  const methods = {
    ...useForm<FormData>({
      resolver: zodResolver(formSchema),
      defaultValues: initialFormData,
      mode: "onBlur",
    }),
  };
    function nextStep() {
      console.log("nextStep called, current step:", step);
      
      setStep((s) => Math.min(s + 1, 10));
  }
  function prevStep() {
      setStep((s) => Math.max(s - 1, 1));
    }
    
    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setLoading(true);
        try {
            const response = await fetch("/api/generate-ai-cv", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error("Failed to generate AI CV");
            
            const aiData = await response.json();
            console.log("AI Generated Data:", aiData);
            
            setAiGeneratedData(aiData);
            setAiData(aiData);
            nextStep();
        } catch (error) {
            alert(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };
    
    async function FinalCv(selectedTemplate: string | null, aigeneratedData: CvFormData | null) {
           console.log("FinalCv called with template:", selectedTemplate, "and AI data:", aigeneratedData);
           
            if (!selectedTemplate || !aigeneratedData) {
                alert("Please select a template and ensure AI data is available.");
                return;
            }
    
            const TemplateComponent = templates[selectedTemplate as keyof typeof templates];
            console.log("Template Component:", TemplateComponent);
            if (!TemplateComponent) {
                alert("Selected template not found.");
                return;
            }
            const blob = await pdf(<TemplateComponent data={aigeneratedData} />).toBlob();
            const imageUrl = await generateImageFromPdfBlob(blob);
            const pdfBlobUrl = URL.createObjectURL(blob);
            setPdfUrl(pdfBlobUrl);
            setAiPreviewImage(imageUrl);
            setStep(11);
    
        }
    


    function renderStep() {
        switch (step) {
          case 1:
            return (
              <PersonalInfoForm
                register={register}
                errors={errors}
                onNext={handleSubmit(nextStep, (errors) => console.log(errors))}
              />
            );
          case 2:
            return (
              <WorkExperienceForm
                register={register}
                errors={errors}
                control={control}
                onNext={handleSubmit(nextStep, (errors) => console.log(errors))}
                onBack={prevStep}
              />
            );
          case 3:
            return (
              <EducationForm
                register={register}
                errors={errors}
                control={control}
                onNext={handleSubmit(nextStep, (errors) => console.log(errors))}
                onBack={prevStep}
              />
            );
          case 4:
            return (
              <SkillsForm
                control={control}
                errors={errors}
                onNext={handleSubmit(nextStep, (errors) => console.log(errors))}
                onBack={prevStep}
              />
            );
          case 5:
            return (
              <ProjectsForm
                register={register}
                errors={errors}
                control={control}
                onNext={handleSubmit(nextStep, (errors) => console.log(errors))}
                onBack={prevStep}
              />
            );
          case 6:
            return (
              <CertificationsForm
                control={control}
                register={register}
                errors={errors}
                onNext={handleSubmit(nextStep, (errors) => console.log(errors))}
                onBack={prevStep}
              />
            );
          case 7:
            return (
              <LanguagesForm
                control={control}
                errors={errors}
                onNext={handleSubmit(nextStep, (errors) => console.log(errors))}
                onBack={prevStep}
              />
            );
          case 8:
            return (
              <JobDescriptionStep
                register={register}
                errors={errors}
                onNext={handleSubmit(nextStep, (errors) => console.log(errors))}
                onBack={prevStep}
              />
            );
          case 9: {
            const values = getValues();

            async function handleConfirm() {
              setLoadingLocal(true);
              try {
                await onSubmit(values);
                setConfirmed(true);
              } catch (error) {
                console.error(error)
                setConfirmed(false);
              } finally {
                setLoadingLocal(false);
              }
            }

            function renderReview() {
              return (
                <div className="space-y-6">
                  {/* Personal Info */}
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Personal Info
                    </h3>
                    <p>
                      <strong>Name:</strong> {values.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {values.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {values.phone}
                    </p>
                    <p>
                      <strong>Address:</strong> {values.location}
                    </p>
                    <p>
                      <strong>Job Title:</strong> {values.jobTitle || "N/A"}
                    </p>
                    <p>
                      <strong>LinkedIn:</strong> {values.linkedin}
                    </p>
                    <p>
                      <strong>Github:</strong> {values.github}
                    </p>
                    <p>
                      <strong>Portfolio:</strong> {values.portfolio}
                    </p>
                  </div>

                  {/* Education */}
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Education</h3>
                    {values.education?.length ? (
                      values.education.map((edu, i) => (
                        <div key={i} className="mb-2">
                          <p>
                            <strong>{edu.degree}</strong> at {edu.school}
                          </p>
                          <p>
                            {edu.startDate} - {edu.endDate}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No education added.</p>
                    )}
                  </div>

                  {/* Experience */}
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Experience</h3>
                    {values.experience?.length ? (
                      values.experience.map((exp, i) => (
                        <div key={i} className="mb-2">
                          <p>
                            <strong>{exp.role}</strong> at {exp.company}
                          </p>
                          <p>
                            {exp.startDate} - {exp.endDate}
                          </p>
                          <p>{exp.description}</p>
                        </div>
                      ))
                    ) : (
                      <p>No experience added.</p>
                    )}
                  </div>

                  {/* Projects */}
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Projects</h3>
                    {values.projects?.length ? (
                      values.projects.map((proj, i) => (
                        <div key={i} className="mb-2">
                          <p>
                            <strong>{proj.name || "Unnamed Project"}</strong>
                          </p>
                          <p>{proj.description || "No description"}</p>
                        </div>
                      ))
                    ) : (
                      <p>No projects added.</p>
                    )}
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Skills</h3>
                    <p>{values.skills?.join(", ") || "No skills added."}</p>
                  </div>

                  {/* Certificates */}
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Certificates</h3>
                    {values.certificates?.length ? (
                      values.certificates.map((cert, i) => (
                        <p key={i}>
                          • {cert.name} - {cert.issuer}
                        </p>
                      ))
                    ) : (
                      <p>No certificates added.</p>
                    )}
                  </div>

                  {/* Languages */}
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Languages</h3>
                    <p>
                      {values.languages?.join(", ") || "No languages added."}
                    </p>
                  </div>

                  {/* Job Description */}
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Job Description
                    </h3>
                    <p>
                      {values.jobDescription || "No job description provided."}
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <Card className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Review Your Data
                </h2>
                <Separator />
                <ScrollArea className="h-[300px]">{renderReview()}</ScrollArea>

                <div className="flex justify-between mt-4">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={loading || loadingLocal}
                  >
                    Back
                  </Button>

                  <Button
                    onClick={handleConfirm}
                    disabled={loading || loadingLocal}
                  >
                    {/* {loadingLocal
                  ? "Confirming..."
                  : confirmed
                  ? "Confirmed"
                  : "Confirm"} */}
                  test
                  </Button>

                  <Button
                    onClick={handleSubmit(nextStep)}
                    disabled={!confirmed}
                    variant={confirmed ? "default" : "outline"}
                  >
                    Select CV Template
                  </Button>
                </div>
              </Card>
            );
          }

          case 10:
            return (
              <Card className="p-6 space-y-6">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Select a Template
                </h2>
                <Separator />
                <TemplatePreviewSelector
                  dummyData={dummyData}
                  onSelect={(id) => setSelectedTemplate(id)}
                  showGenerateButton={true}
                />
                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button
                    onClick={() => {
                      FinalCv(selectedTemplate, aiGeneratedData);
                    }}
                    disabled={!selectedTemplate || !aiGeneratedData}
                  >
                    Generate Final CV
                  </Button>
                </div>
              </Card>
            );
          case 11:
            return (
              <Card className="p-6 space-y-6">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Your Final CV
                </h2>
                <Separator />
                {aiPreviewImage ? (
                  <img
                    src={aiPreviewImage}
                    alt="AI Generated Preview"
                    className="rounded shadow-md"
                  />
                ) : (
                  <p>Generating preview...</p>
                )}
                <div className="flex gap-4 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const values = getValues();

                      const location = encodeURIComponent(values.location);
                      const skills = encodeURIComponent(
                        values.skills.join(",")
                      );
                      const experience = encodeURIComponent(
                        values.experience.length.toString()
                      );
                      const salary = ""; // Optional – you can add a form field later

                      router.push(
                        `/jobs?location=${location}&skills=${skills}&experience=${experience}&salary=${salary}`
                      );
                    }}
                  >
                    Search Jobs Based on This CV
                  </Button>

                  <Button
                    onClick={() => {
                      if (pdfUrl) {
                        const link = document.createElement("a");
                        link.href = pdfUrl;
                        link.download = "final_cv.pdf";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }
                    }}
                    disabled={!pdfUrl}
                  >
                    Download CV
                  </Button>
                  <Button variant="outline" onClick={() => setStep(9)}>
                    Edit
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(`/cv/fill-data/?template=${selectedTemplate}`)
                    }
                  >
                    Edit With Preview
                  </Button>
                </div>
              </Card>
            );

          default:
            return (
              <Card className="p-6 space-y-6">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Step {step} Form
                </h2>
                <Separator />
                <p>Step form component placeholder</p>
                <div className="flex justify-between">
                  {step > 1 && (
                    <Button variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                  )}
                  <Button onClick={nextStep}>Next</Button>
                </div>
              </Card>
            );
        }
  }


  return (
        <FormProvider {...methods}>
    <div className="max-w-4xl mx-auto  mt-30">
      <Card className="p-6 space-y-6 bg-transparent">
        <h1 className="text-5xl font-bold tracking-tight text-center">
          CV Builder Wizard
        </h1>
        <div className="text-center text-sm text-muted-foreground">
          Step {step} of 11
        </div>
        {renderStep()}
      </Card>
    </div>
        </FormProvider>
  );
}
