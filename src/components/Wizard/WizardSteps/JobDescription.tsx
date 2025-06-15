"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldErrors, useFormContext, UseFormRegister } from "react-hook-form";
import type { FormData } from "../MainWizard";

interface JobDescriptionStepProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  onNext: () => void;
  onBack?: () => void;
}

export default function JobDescriptionStep({
  register,
  errors,
  onNext,
  onBack,
}: JobDescriptionStepProps) {
  const {trigger} = useFormContext<FormData>();

 

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="job-description">Job Description</Label>
        <Textarea
          id="job-description"
          rows={10}
          placeholder="Paste the full job description here..."
          {...register("jobDescription")}
        />
        {errors.jobDescription && (
          <p className="text-sm text-red-600">
            {errors.jobDescription.message}
          </p>
        )}
      </div>

      <div className="flex justify-between gap-4 pt-4">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
        <Button type="button" onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
