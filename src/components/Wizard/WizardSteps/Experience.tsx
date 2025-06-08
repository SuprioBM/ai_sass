"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import {
  useFieldArray,
  UseFormRegister,
  Control,
  FieldErrors,
} from "react-hook-form";
import type { FormData } from "../MainWizard";

type Props = {
  register: UseFormRegister<FormData>;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  onNext: () => void;
  onBack: () => void;
};

export default function WorkExperienceForm({
  register,
  control,
  errors,
  onNext,
  onBack,
}: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  return (
    <Card className="max-w-3xl mx-auto">
      <CardContent className="space-y-6 p-6">
        <h2 className="text-xl font-semibold">Work Experience</h2>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border p-4 rounded-lg space-y-4 relative"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Company*</Label>
                <Input {...register(`experience.${index}.company`)} />
                {errors.experience?.[index]?.company && (
                  <p className="text-red-500 text-sm">
                    {errors.experience[index]?.company?.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Position*</Label>
                <Input {...register(`experience.${index}.role`)} />
                {errors.experience?.[index]?.role && (
                  <p className="text-red-500 text-sm">
                    {errors.experience[index]?.role?.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Start Date*</Label>
                <Input
                  type="month"
                  {...register(`experience.${index}.startDate`)}
                />
                {errors.experience?.[index]?.startDate && (
                  <p className="text-red-500 text-sm">
                    {errors.experience[index]?.startDate?.message}
                  </p>
                )}
              </div>

              <div>
                <Label>End Date</Label>
                <Input
                  type="month"
                  {...register(`experience.${index}.endDate`)}
                />
                {errors.experience?.[index]?.endDate && (
                  <p className="text-red-500 text-sm">
                    {errors.experience[index]?.endDate?.message}
                  </p>
                )}
              </div>

              

              <div className="sm:col-span-2">
                <Label>Description</Label>
                <Textarea
                  {...register(`experience.${index}.description`)}
                  rows={3}
                  placeholder="What did you achieve in this role?"
                />
                {errors.experience?.[index]?.description && (
                  <p className="text-red-500 text-sm">
                    {errors.experience[index]?.description?.message}
                  </p>
                )}
              </div>
            </div>

            {fields.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={() => remove(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              company: "",
              role: "",
              startDate: "",
              endDate: "",
              description: "",
            })
          }
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Another Job
        </Button>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="button" onClick={onNext}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
