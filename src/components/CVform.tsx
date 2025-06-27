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
  const { register, handleSubmit, control, watch, setValue, reset } =
    useForm<CvFormData>({
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

  const { fields: certificatesFields, append: addCertificates } = useFieldArray(
    {
      control,
      name: "certificates",
    }
  );

  const skills = watch("skills") || [];
  const languages = watch("languages") || [];

  const prevDataRef = useRef<CvFormData | null>(null);
  const isFirstLoadRef = useRef(true);


  useEffect(() => {
    if (isFirstLoadRef.current) {
      reset(formData); // ✅ only reset on initial load
      prevDataRef.current = formData;
      isFirstLoadRef.current = false;
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

      <section>
        <h2 className="text-xl font-semibold">Experience</h2>
        {experienceFields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              {...register(`experience.${index}.role` as const)}
              placeholder="Role"
              className="input"
            />
            <input
              {...register(`experience.${index}.company`  as const)}
              placeholder="Company"
              className="input"
            />
            <input
              {...register(`experience.${index}.startDate`  as const)}
              placeholder="Start Date"
              className="input"
            />
            <input
              {...register(`experience.${index}.endDate`  as const)}
              placeholder="End Date"
              className="input"
            />
            <textarea
              {...register(`experience.${index}.description` as const)}
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
      </section>

      <section>
        <h2 className="text-xl font-semibold">Education</h2>
        {educationFields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              {...register(`education.${index}.degree`  as const)}
              placeholder="Degree"
              className="input"
            />
            <input
              {...register(`education.${index}.school`  as const)}
              placeholder="School"
              className="input"
            />
            <input
              {...register(`education.${index}.startDate` as const)}
              placeholder="Start Date"
              className="input"
            />
            <input
              {...register(`education.${index}.endDate` as const)}
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
      </section>

      <section>
        <h2 className="text-xl font-semibold">Skills</h2>
        {skills.map((skill, index) => (
          <input
            key={index}
            {...register(`skills.${index}`)}
            placeholder={`Skill #${index + 1}`}
            className="input"
          />
        ))}
        <button
          type="button"
          onClick={() => setValue("skills", [...skills, ""])}
          className="btn mt-2"
        >
          + Add Skill
        </button>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Languages</h2>
        {languages.map((language, index) => (
          <input
            key={index}
            {...register(`languages.${index}`)}
            placeholder={`Language #${index + 1}`}
            className="input"
          />
        ))}
        <button
          type="button"
          onClick={() => setValue("languages", [...languages, ""])}
          className="btn mt-2"
        >
          + Add Language
        </button>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Projects</h2>
        {projectFields.map((field, index) => (
          <div key={field.id} className="space-y-2">
            <input
              {...register(`projects.${index}.name` as const)}
              placeholder="Project Name"
              className="input"
            />
            <textarea
              {...register(`projects.${index}.description`  as const)}
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
      </section>

      <section>
        <h2 className="text-xl font-semibold">Certificates</h2>
        {certificatesFields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              {...register(`certificates.${index}.name` as const)}
              placeholder="Certificate Name"
              className="input"
            />
            <input
              {...register(`certificates.${index}.issuer`   as const)}
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
      </section>

      <button type="submit" className="btn-primary mt-6">
        Generate CV
      </button>
    </form>
  );
}
