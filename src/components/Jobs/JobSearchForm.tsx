"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobList } from "./JobList";

export function JobSearchForm() {
  const [formData, setFormData] = useState({
    query: "",
    location: "",
    skills: [] as string[],
    experience: "any",
    type: "all",
  });

  const [skillInput, setSkillInput] = useState("");
  const [searchParams, setSearchParams] = useState<typeof formData | null>(
    null
  );

  // Add skill when user presses Enter or clicks Add
  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
      setSkillInput("");
    }
  };

  // Remove skill by index
  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // On submit, set searchParams to trigger JobList fetch
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(formData);
  };

  return (
    <div className="w-full space-y-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="space-y-6 py-6">
          <h2 className="text-xl font-semibold text-center">Search for Jobs</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Job Title / Query</Label>
              <Input
                placeholder="e.g. Frontend Developer"
                value={formData.query}
                onChange={(e) => handleChange("query", e.target.value)}
              />
            </div>

            <div>
              <Label>Location</Label>
              <Input
                placeholder="e.g. New York, Remote"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </div>

            {/* Skills input with tags */}
            <div>
              <Label>Skills</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.skills.map((skill, i) => (
                  <div
                    key={i}
                    className="bg-blue-200 text-blue-800 rounded px-2 py-1 flex items-center space-x-1"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(i)}
                      className="font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Type skill and press Add"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <Button type="button" onClick={addSkill}>
                  Add
                </Button>
              </div>
            </div>

            <div>
              <Label>Experience Level</Label>
              <Select
                value={formData.experience}
                onValueChange={(val) => handleChange("experience", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior Level</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Job Type</Label>
              <Select
                value={formData.type}
                onValueChange={(val) => handleChange("type", val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="onsite">Onsite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Search Jobs
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="max-w-2xl mx-auto space-y-4">
        {searchParams && <JobList searchParams={searchParams} />}
      </div>
    </div>
  );
}
