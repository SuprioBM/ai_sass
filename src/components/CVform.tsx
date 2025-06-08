"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useRef } from "react";
import { CvFormData } from "@/types/Cv";


type CvFormProps = {
  onSubmit: (data: CvFormData) => void;
  formData: CvFormData;
  setFormData: React.Dispatch<React.SetStateAction<CvFormData>>;
};

export default function CvForm({
  onSubmit,
  formData,
  setFormData,
}: CvFormProps) {
  const { register, handleSubmit, control, watch,setValue,reset } = useForm<CvFormData>({
    defaultValues: formData,
  });

  const { fields: experienceFields, append: addExperience } = useFieldArray({
    control,
    name: "experience",
  });

  const { fields: educationFields, append: addEducation } = useFieldArray({
    control,
    name: "education",
  });

  const { fields: projectFields, append: addProject } = useFieldArray({
    control,
    name: "projects",
  });

  const { fields: certificatesFields, append: addCertificates } =
    useFieldArray({ control, name: "certificates" });

  // skills and languages are simple string arrays; we will handle them manually
  const skills = watch("skills") || [];
  const languages = watch("languages") || [];
   const prevDataRef = useRef<CvFormData | null>(null);
  // For skills, languages, we’ll render inputs for each item and allow adding blank ones
   
   
   useEffect(() => {
     const hasChanged =
       JSON.stringify(prevDataRef.current) !== JSON.stringify(formData);
     if (formData && hasChanged) {
       reset(formData); // Update form state
       prevDataRef.current = formData; // Save current data to compare next time
     }
   }, [formData, reset]);
   
  useEffect(() => {
    const subscription = watch((value) => {
      setFormData(value as CvFormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, setFormData]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
      {/* Basic info */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          {...register("name")}
          placeholder="Full Name"
          className="input"
        />
        <input {...register("email")} placeholder="Email" className="input" />
        <input {...register("phone")} placeholder="Phone" className="input" />
        <input
          {...register("location")}
          placeholder="Location"
          className="input"
        />
        <input
          {...register("linkedin")}
          placeholder="LinkedIn URL"
          className="input"
        />
        <input
          {...register("github")}
          placeholder="GitHub URL"
          className="input"
        />
        <input
          {...register("portfolio")}
          placeholder="Portfolio URL"
          className="input"
        />
      </div>

      <textarea
        {...register("summary")}
        placeholder="About Me / Summary"
        className="input w-full h-24"
      />

      {/* Experience */}
      <div>
        <h2 className="text-xl font-semibold">Experience</h2>
        {experienceFields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              {...register(`experience.${index}.role`)}
              placeholder="Role"
              className="input"
            />
            <input
              {...register(`experience.${index}.company`)}
              placeholder="Company"
              className="input"
            />
            <input
              {...register(`experience.${index}.startDate`)}
              placeholder="Start Date"
              className="input"
            />
            <input
              {...register(`experience.${index}.endDate`)}
              placeholder="End Date"
              className="input"
            />
            <textarea
              {...register(`experience.${index}.description`)}
              placeholder="Description"
              className="input h-20 sm:col-span-2"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            addExperience({
              role: "",
              company: "",
              startDate: "",
              endDate: "",
              description: "",
            })
          }
          className="btn mt-2"
        >
          + Add Experience
        </button>
      </div>

      {/* Education */}
      <div>
        <h2 className="text-xl font-semibold">Education</h2>
        {educationFields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              {...register(`education.${index}.degree`)}
              placeholder="Degree"
              className="input"
            />
            <input
              {...register(`education.${index}.school`)}
              placeholder="School"
              className="input"
            />
            <input
              {...register(`education.${index}.startDate`)}
              placeholder="Start Date"
              className="input"
            />
            <input
              {...register(`education.${index}.endDate`)}
              placeholder="End Date"
              className="input"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            addEducation({ degree: "", school: "", startDate: "", endDate: "" })
          }
          className="btn mt-2"
        >
          + Add Education
        </button>
      </div>

      {/* Skills (string array) */}
      <div>
        <h2 className="text-xl font-semibold">Skills</h2>
        {skills.map((skill, index) => (
          <input
            key={index}
            {...register(`skills.${index}` as const)}
            placeholder={`Skill #${index + 1}`}
            className="input"
          />
        ))}
        <button
          type="button"
          onClick={() => {
            const currentSkills = watch("skills") || [];
            setValue("skills", [...currentSkills, ""]);
          }}
          className="btn mt-2"
        >
          + Add Skill
        </button>
      </div>

      {/* Languages (string array) */}
      <div>
        <h2 className="text-xl font-semibold">Languages</h2>
        {languages.map((language, index) => (
          <input
            key={index}
            {...register(`languages.${index}` as const)}
            placeholder={`Language #${index + 1}`}
            className="input"
          />
        ))}
        <button
          type="button"
          onClick={() => {
            const currentLanguages = watch("languages") || [];
            setValue("languages", [...currentLanguages, ""]);
          }}
          className="btn mt-2"
        >
          + Add Language
        </button>
      </div>

      {/* Projects */}
      <div>
        <h2 className="text-xl font-semibold">Projects</h2>
        {projectFields.map((field, index) => (
          <div key={field.id} className="space-y-2">
            <input
              {...register(`projects.${index}.name`)}
              placeholder="Project Name"
              className="input"
            />
            <textarea
              {...register(`projects.${index}.description`)}
              placeholder="Project Description"
              className="input h-20"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => addProject({ name: "", description: "" })}
          className="btn mt-2"
        >
          + Add Project
        </button>
      </div>

      {/* Certifications */}
      <div>
        <h2 className="text-xl font-semibold">Certificates</h2>
        {certificatesFields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              {...register(`certificates.${index}.name`)}
              placeholder="Certificates Name"
              className="input"
            />
            <input
              {...register(`certificates.${index}.issuer`)}
              placeholder="Issuer"
              className="input"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => addCertificates({ name: "", issuer: "" })}
          className="btn mt-2"
        >
          + Add Certification
        </button>
      </div>

      <button type="submit" className="btn-primary mt-6">
        Generate CV
      </button>
    </form>
  );
}
