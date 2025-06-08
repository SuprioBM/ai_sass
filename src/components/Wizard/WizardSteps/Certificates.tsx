"use client";

import React from "react";
import {
  useFieldArray,
  Control,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormData } from "../MainWizard";

type Props = {
  control: Control<FormData>;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  onNext: () => void;
  onBack: () => void;
};

export default function CertificationsForm({
  control,
  register,
  errors,
  onNext,
  onBack,
}: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "certificates",
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Certifications</h2>

      {fields.map((field, index) => (
        <div key={field.id} className="space-y-2 mb-4 border rounded p-4">
          <div>
            <Label htmlFor={`certificates.${index}.name`}>
              Certification Name*
            </Label>
            <Input
              id={`certificates.${index}.name`}
              {...register(`certificates.${index}.name` as const)}
              className={
                errors.certificates?.[index]?.name ? "border-red-500" : ""
              }
              placeholder="Certification Name"
            />
            {errors.certificates?.[index]?.name && (
              <p className="text-red-600 text-sm">
                {errors.certificates[index]?.name?.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor={`certificates.${index}.issuer`}>Issuer*</Label>
            <Input
              id={`certificates.${index}.issuer`}
              {...register(`certificates.${index}.issuer` as const)}
              className={
                errors.certificates?.[index]?.issuer ? "border-red-500" : ""
              }
              placeholder="Issuer"
            />
            {errors.certificates?.[index]?.issuer && (
              <p className="text-red-600 text-sm">
                {errors.certificates[index]?.issuer?.message}
              </p>
            )}
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => remove(index)}
            className="mt-2"
          >
            Remove
          </Button>
        </div>
      ))}

      {fields.length < 5 && (
        <Button type="button" onClick={() => append({ name: "", issuer: "" })}>
          Add Certification
        </Button>
      )}

      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}
