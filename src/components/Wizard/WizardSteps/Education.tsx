import React from "react";
import {
  useFieldArray,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import type { FormData } from "../MainWizard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type Props = {
  register: UseFormRegister<FormData>;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  onNext: () => void;
  onBack: () => void;
};

export default function EducationForm({
  register,
  control,
  errors,
  onNext,
  onBack,
}: Props) {
  // ✅ Correct usage of the hook directly at the top level
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  async function handleNext() {
    // Optional: add validation logic here
    onNext();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Education</h2>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border p-4 rounded-lg space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Degree*</label>
              <input
                {...register(`education.${index}.degree` as const, {
                  required: "Degree is required",
                })}
                className="input"
                placeholder="e.g. B.Sc. in Computer Science"
                defaultValue={field.degree}
              />
              {errors.education?.[index]?.degree && (
                <p className="text-red-500 text-sm">
                  {errors.education[index]?.degree?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Institution*</label>
              <input
                {...register(`education.${index}.school` as const, {
                  required: "Institution is required",
                })}
                className="input"
                placeholder="e.g. University of Dhaka"
                defaultValue={field.school}
              />
              {errors.education?.[index]?.school && (
                <p className="text-red-500 text-sm">
                  {errors.education[index]?.school?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Start Date*</label>
              <input
                type="month"
                {...register(`education.${index}.startDate` as const, {
                  required: "Start date is required",
                })}
                className="input"
                defaultValue={field.startDate}
              />
              {errors.education?.[index]?.startDate && (
                <p className="text-red-500 text-sm">
                  {errors.education[index]?.startDate?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">End Date</label>
              <input
                type="month"
                {...register(`education.${index}.endDate` as const)}
                className="input"
                defaultValue={field.endDate}
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={() => remove(index)}
            variant="destructive">
            Remove
          </Button>
        </div>
      ))}

      <Button
        type="button"
        onClick={() =>
          append({ degree: "", school: "", startDate: "", endDate: "" })
        }

      >
        <Plus className="mr-2" />
        Add another education
      </Button>

      <div className="flex justify-between mt-6">
        <button type="button" onClick={onBack} className="btn">
          Back
        </button>
        <button type="button" onClick={handleNext} className="btn btn-primary">
          Next
        </button>
      </div>
    </div>
  );
}
