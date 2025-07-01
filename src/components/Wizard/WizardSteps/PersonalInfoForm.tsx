"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import type { FormData } from "../MainWizard";

type Props = {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  onNext: () => void;
  onBack?: () => void;
};

export default function PersonalInfoForm({
  register,
  errors,
  onNext,
  onBack,
}: Props) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="space-y-6 p-6">
        <h2 className="text-xl font-semibold">Personal Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name*</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm">{String(errors.name.message)}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email*</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register("phone")} />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register("location")} />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input id="jobTitle" {...register("jobTitle")} />
            {errors.jobTitle && (
              <p className="text-red-500 text-sm">{errors.jobTitle.message}</p>
            )}
            </div>
          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input id="linkedin" {...register("linkedin")} />
            {errors.linkedin && (
              <p className="text-red-500 text-sm">{errors.linkedin.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="github">GitHub</Label>
            <Input id="github" {...register("github")} />
            {errors.github && (
              <p className="text-red-500 text-sm">{errors.github.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="portfolio">Portfolio</Label>
            <Input id="portfolio" {...register("portfolio")} />
            {errors.portfolio && (
              <p className="text-red-500 text-sm">{errors.portfolio.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea
            id="summary"
            {...register("summary")}
            rows={4}
            placeholder="Brief summary of your skills and experience..."
          />
          {errors.summary && (
            <p className="text-red-500 text-sm">{errors.summary.message}</p>
          )}
        </div>

        <div className="flex justify-between pt-4">
          {onBack && (
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
          <Button type="button" onClick={onNext}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
