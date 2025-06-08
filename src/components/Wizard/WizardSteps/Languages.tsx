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

export default function LanguagesForm({control,errors, onNext, onBack }: Props) {
  const {
    trigger,
  } = useFormContext<FormData>();

  const handleNext = async () => {
    const isValid = await trigger("languages");
    if (isValid) {
      onNext();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Languages</h2>

      <Label htmlFor="languages">Languages (comma-separated)</Label>

      <Controller
        name="languages"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            id="languages"
            type="text"
            placeholder="English, Spanish, Bengali"
            value={value?.join(", ") || ""}
            onChange={(e) => {
              const parsed = e.target.value
                .split(",")
                .map((l) => l.trim())
                .filter((l) => l.length > 0);
              onChange(parsed);
            }}
            className={errors.languages ? "border-red-500" : ""}
          />
        )}
      />

      {errors.languages && typeof errors.languages.message === "string" && (
        <p className="text-red-600 text-sm">{errors.languages.message}</p>
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
