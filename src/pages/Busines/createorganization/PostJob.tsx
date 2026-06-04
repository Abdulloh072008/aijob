import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent } from "../../../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Label } from "../../../components/ui/label";
import { Plus, Briefcase } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../store/Hooks";
import { createJobPost, fetchOrgJobs, fetchOrgProfile } from "../../../api/organizationapi";

const jobValidationSchema = Yup.object({
  title: Yup.string().required("Job title is required"),
  description: Yup.string().required("Job description is required"),
  location: Yup.string().required("Location is required"),
  employmentType: Yup.string()
    .oneOf(["Full-time", "Part-time", "Contract", "Internship", "Remote"])
    .required("Job type is required"),
  experienceLevel: Yup.string()
    .oneOf(["Entry", "Mid", "Senior", "Lead/Manager", "Executive"])
    .required("Experience level is required"),
  salary: Yup.string().required("Salary range is required"),
});

export default function JobListings() {
  const dispatch = useAppDispatch();
  const { jobs, profile } = useAppSelector((state) => state.organization);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!profile?.id) dispatch(fetchOrgProfile());
    dispatch(fetchOrgJobs());
  }, [dispatch, profile?.id]);

const formik = useFormik({
  initialValues: {
    title: "",
    description: "",
    location: "",
    employmentType: "Full-time",
    experienceLevel: "Entry",
    salary: "",
  },

  validationSchema: jobValidationSchema,

  onSubmit: (values) => {
    console.log("FORM SUBMIT FIRED", values);
    const orgId = profile?.id;
    if (!orgId) {
  console.log("ORG NOT LOADED YET");
  return;
}

    const payload = {
      title: values.title,
      description: values.description,
      location: values.location,
      employmentType: values.employmentType,
      experienceLevel: values.experienceLevel,
      salary: values.salary,
      skills: [],
      status: "active" as const,
      organizationId: Number(profile.id),
    };

    dispatch(createJobPost(payload)).then(() => {
      formik.resetForm();
      setOpen(false);
      dispatch(fetchOrgJobs());
    });
  },
  });

  return (
    <div className="space-y-6 w-full max-w-[1128px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900">Job Positions</h2>
          <p className="text-sm text-muted-foreground">Manage and coordinate your active vacancies.</p>
        </div>
        <Dialog open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (!isOpen) formik.resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-[#0A66C2] hover:bg-[#004182] rounded-full px-5"><Plus className="mr-1.5 h-4 w-4" /> Post a Job</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <form onSubmit={formik.handleSubmit}>
              <DialogHeader>
                <DialogTitle>Create Job Listing</DialogTitle>
                <DialogDescription>Provide complete details following endpoint requirements.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="title" className="text-xs font-semibold text-muted-foreground uppercase">Job Title</Label>
                  <Input id="title" name="title" value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                  {formik.touched.title && formik.errors.title && <p className="text-xs text-red-500">{formik.errors.title}</p>}
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="description" className="text-xs font-semibold text-muted-foreground uppercase">Description</Label>
                  <Input id="description" name="description" value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                  {formik.touched.description && formik.errors.description && <p className="text-xs text-red-500">{formik.errors.description}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="location" className="text-xs font-semibold text-muted-foreground uppercase">Location</Label>
                    <Input id="location" name="location" value={formik.values.location} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    {formik.touched.location && formik.errors.location && <p className="text-xs text-red-500">{formik.errors.location}</p>}
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="salary" className="text-xs font-semibold text-muted-foreground uppercase">Salary Range</Label>
                    <Input id="salary" name="salary" placeholder="e.g. $4000 - $6000" value={formik.values.salary} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    {formik.touched.salary && formik.errors.salary && <p className="text-xs text-red-500">{formik.errors.salary}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="employmentType" className="text-xs font-semibold text-muted-foreground uppercase">Job Type</Label>
                    <Select value={formik.values.employmentType} onValueChange={(v) => formik.setFieldValue("employmentType", v)}>
                      <SelectTrigger id="employmentType"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="experienceLevel" className="text-xs font-semibold text-muted-foreground uppercase">Experience Level</Label>
                    <Select value={formik.values.experienceLevel} onValueChange={(v) => formik.setFieldValue("experienceLevel", v)}>
                      <SelectTrigger id="experienceLevel"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Entry">Entry</SelectItem>
                        <SelectItem value="Mid">Mid</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                        <SelectItem value="Lead/Manager">Lead/Manager</SelectItem>
                        <SelectItem value="Executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#0A66C2] hover:bg-[#004182]">Publish Listing</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {jobs.length === 0 ? (
        <Card className="border-dashed bg-white py-12 text-center">
          <CardContent className="flex flex-col items-center justify-center gap-2">
            <Briefcase className="h-8 w-8 text-muted-foreground/60" />
            <p className="text-sm font-medium text-muted-foreground">No vacancies created yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white overflow-hidden shadow-xs border-gray-200">
          <CardContent className="p-0 divide-y divide-gray-100">
            {jobs.map((job) => (
              <div key={job.id} className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div>
                  <h4 className="text-base font-semibold text-gray-900">{job.title}</h4>
                  <p className="text-sm text-muted-foreground mt-0.5">{job.employmentType} • {job.location} • {job.salary}</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full">{job.status || "active"}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}