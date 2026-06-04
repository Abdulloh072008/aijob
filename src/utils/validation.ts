import * as Yup from "yup";

export const jobPostSchema = Yup.object().shape({
  title: Yup.string().required("Job title is required"),
  location: Yup.string().required("Location deployment zone is required"),
  description: Yup.string().min(20, "Please supply a description text of at least 20 parameters").required("Description outline is required"),
  jobType: Yup.string().oneOf(["Full-time", "Part-time", "Contract", "Internship", "Remote"]).required("Job classification tracking required"),
  experienceLevel: Yup.string().oneOf(["Entry", "Mid", "Senior", "Lead/Manager", "Executive"]).required("Experience parameter required"),
  salary: Yup.string().optional(),
});

export const orgProfileSchema = Yup.object().shape({
  name: Yup.string().required("Corporate designation identifier is required"),
  industry: Yup.string().required("Industrial core category field required"),
  website: Yup.string().url("Must enter a valid URL protocol standard structure").required("Domain index required"),
  location: Yup.string().required("Base geographical matrix required"),
  size: Yup.string().required("Enterprise size metric parameter tracking required"),
  description: Yup.string().min(10, "Provide a descriptive abstract summary statement").required("Overview text data matrix mandatory"),
});