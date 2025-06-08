"use client";

import React from "react";
import { Control, Controller, FieldErrors, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormData } from "../MainWizard";

type Props = {
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  onNext: () => void;
  onBack: () => void;
};

export default function SkillsForm({control,errors, onNext, onBack }: Props) {
  const {
    trigger,
  } = useFormContext<FormData>();

  const handleNext = async () => {
    const isValid = await trigger("skills");
    if (isValid) {
      onNext();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Skills</h2>

      <Label htmlFor="skills">Skills (comma-separated)</Label>

      <Controller
        name="skills"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            id="skills"
            type="text"
            placeholder="JavaScript, React, Node.js"
            className={errors.skills ? "border-red-500" : ""}
            value={value?.join(", ") || ""}
            onChange={(e) => {
              const inputValue = e.target.value;
              const parsed = inputValue
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s.length > 0);
              onChange(parsed);
            }}
          />
        )}
      />

      {errors.skills && typeof errors.skills.message === "string" && (
        <p className="text-red-600 text-sm">{errors.skills.message}</p>
      )}

      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
}
