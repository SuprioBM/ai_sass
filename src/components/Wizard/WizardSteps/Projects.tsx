"use client";

import React from "react";
import {
  useFieldArray,
  UseFormRegister,
  Control,
  FieldErrors,
} from "react-hook-form";
import { FormData } from "../MainWizard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Props = {
  register: UseFormRegister<FormData>;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  onNext: () => void;
  onBack: () => void;
};

export default function ProjectsForm({
  register,
  control,
  errors,
  onNext,
  onBack,
}: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Projects</h2>
      <p className="mb-4 text-sm text-gray-600">
        Add your projects with name and description.
      </p>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="mb-6 border rounded p-4 space-y-2 relative"
        >
          <div>
            <Label htmlFor={`projects.${index}.name`}>Project Name</Label>
            <Input
              id={`projects.${index}.name`}
              {...register(`projects.${index}.name` as const)}
              placeholder="Project name"
              defaultValue={field.name}
            />
            {errors.projects?.[index]?.name?.message && (
              <p className="text-red-600 text-sm">
                {errors.projects[index].name?.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor={`projects.${index}.description`}>Description</Label>
            <Textarea
              id={`projects.${index}.description`}
              {...register(`projects.${index}.description` as const)}
              placeholder="Project description"
              rows={3}
              defaultValue={field.description}
            />
            {errors.projects?.[index]?.description?.message && (
              <p className="text-red-600 text-sm">
                {errors.projects[index].description?.message}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => remove(index)}
            className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
            aria-label={`Remove project ${index + 1}`}
          >
            Remove
          </button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => append({ name: "", description: "" })}
      >
        Add Project
      </Button>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}
