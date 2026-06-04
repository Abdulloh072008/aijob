import { useState } from "react";
import { useFormik } from "formik";
import { X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Badge } from "../../../components/ui/badge";
import { useAppDispatch, useAppSelector } from "../../../store/Hooks";
import { jobPostSchema } from "../../../utils/validation";
import { createJobPost } from "../../../api/organizationapi";

interface PostJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PostJobModal = ({ open, onOpenChange }: PostJobModalProps) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.organization);

  const [skillInput, setSkillInput] = useState("");
  const [jobSkills, setJobSkills] = useState<string[]>([]);

  const jobFormik = useFormik({
    initialValues: {
      title: "",
      location: "",
      description: "",
      jobType: "Full-time" as const,
      experienceLevel: "Mid" as const,
      salary: "",
    },
    validationSchema: jobPostSchema,
    onSubmit: (values) => {
      dispatch(
        createJobPost({
          ...values,
          skills: jobSkills,
          status: "active",
        })
      ).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          onOpenChange(false);
          jobFormik.resetForm();
          setJobSkills([]);
        }
      });
    },
  });

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (skillInput.trim() && !jobSkills.includes(skillInput.trim())) {
      setJobSkills([...jobSkills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setJobSkills(jobSkills.filter((s) => s !== skill));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-tight">Create an Employment Posting</DialogTitle>
        </DialogHeader>
        <form onSubmit={jobFormik.handleSubmit} className="space-y-4 my-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Job Title *</label>
              <Input name="title" value={jobFormik.values.title} onChange={jobFormik.handleChange} onBlur={jobFormik.handleBlur} placeholder="e.g. Staff Fullstack Engineer" />
              {jobFormik.touched.title && jobFormik.errors.title && <p className="text-red-500 text-xs mt-1 font-medium">{jobFormik.errors.title}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Location *</label>
              <Input name="location" value={jobFormik.values.location} onChange={jobFormik.handleChange} onBlur={jobFormik.handleBlur} placeholder="e.g. San Francisco, CA (Hybrid)" />
              {jobFormik.touched.location && jobFormik.errors.location && <p className="text-red-500 text-xs mt-1 font-medium">{jobFormik.errors.location}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Description Summary *</label>
            <Textarea name="description" value={jobFormik.values.description} onChange={jobFormik.handleChange} onBlur={jobFormik.handleBlur} rows={5} placeholder="Provide overview text context metrics..." className="resize-none" />
            {jobFormik.touched.description && jobFormik.errors.description && <p className="text-red-500 text-xs mt-1 font-medium">{jobFormik.errors.description}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Job Type *</label>
              <Select value={jobFormik.values.jobType} onValueChange={(val) => jobFormik.setFieldValue("jobType", val)}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                </SelectContent>
              </Select>
              {jobFormik.touched.jobType && jobFormik.errors.jobType && <p className="text-red-500 text-xs mt-1 font-medium">{jobFormik.errors.jobType}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Experience Level *</label>
              <Select value={jobFormik.values.experienceLevel} onValueChange={(val) => jobFormik.setFieldValue("experienceLevel", val)}>
                <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entry">Entry</SelectItem>
                  <SelectItem value="Mid">Mid</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                  <SelectItem value="Lead/Manager">Lead/Manager</SelectItem>
                  <SelectItem value="Executive">Executive</SelectItem>
                </SelectContent>
              </Select>
              {jobFormik.touched.experienceLevel && jobFormik.errors.experienceLevel && <p className="text-red-500 text-xs mt-1 font-medium">{jobFormik.errors.experienceLevel}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Salary Range (Optional)</label>
            <Input name="salary" value={jobFormik.values.salary} onChange={jobFormik.handleChange} onBlur={jobFormik.handleBlur} placeholder="e.g. $140,000 - $175,000/yr" />
            {jobFormik.touched.salary && jobFormik.errors.salary && <p className="text-red-500 text-xs mt-1 font-medium">{jobFormik.errors.salary}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Skills Requirements</label>
            <div className="flex gap-2">
              <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Type skill token" />
              <Button type="button" onClick={handleAddSkill} variant="secondary" className="px-4 font-semibold text-xs rounded-full">Add</Button>
            </div>
            {jobSkills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 bg-slate-50 p-2.5 rounded-xl border">
                {jobSkills.map((sk) => (
                  <Badge key={sk} className="bg-[#EDF3F8] text-[#0A66C2] hover:bg-[#EDF3F8] font-medium text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-none">
                    <span>{sk}</span>
                    <button type="button" onClick={() => handleRemoveSkill(sk)} className="text-[#0A66C2] font-bold ml-0.5"><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-full px-5">Cancel</Button>
            <Button type="submit" disabled={loading.postingJob} className="bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full px-5">
              {loading.postingJob ? "Posting..." : "Post Job"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};