import { useFormik } from "formik";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { useAppDispatch, useAppSelector } from "../../../store/Hooks";
import { updateOrgProfile } from "../../../api/organizationapi";
import { orgProfileSchema } from "../../../utils/validation";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditProfileModal = ({ open, onOpenChange }: EditProfileModalProps) => {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.organization);

  const profileFormik = useFormik({
    initialValues: {
      name: profile?.name || "",
      industry: profile?.industry || "",
      website: profile?.website || "",
      location: profile?.location || "",
      size: profile?.size || "",
      description: profile?.description || "",
    },
    enableReinitialize: true,
    validationSchema: orgProfileSchema,
    onSubmit: (values) => {
      dispatch(updateOrgProfile(values)).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          onOpenChange(false);
        }
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-tight">Modify Profile Specifications</DialogTitle>
        </DialogHeader>
        <form onSubmit={profileFormik.handleSubmit} className="space-y-4 my-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Company Name *</label>
              <Input name="name" value={profileFormik.values.name} onChange={profileFormik.handleChange} onBlur={profileFormik.handleBlur} />
              {profileFormik.touched.name && profileFormik.errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{profileFormik.errors.name}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Industry Sector *</label>
              <Input name="industry" value={profileFormik.values.industry} onChange={profileFormik.handleChange} onBlur={profileFormik.handleBlur} />
              {profileFormik.touched.industry && profileFormik.errors.industry && <p className="text-red-500 text-xs mt-1 font-medium">{profileFormik.errors.industry}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Website URL *</label>
              <Input name="website" value={profileFormik.values.website} onChange={profileFormik.handleChange} onBlur={profileFormik.handleBlur} />
              {profileFormik.touched.website && profileFormik.errors.website && <p className="text-red-500 text-xs mt-1 font-medium">{profileFormik.errors.website}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Location Base *</label>
              <Input name="location" value={profileFormik.values.location} onChange={profileFormik.handleChange} onBlur={profileFormik.handleBlur} />
              {profileFormik.touched.location && profileFormik.errors.location && <p className="text-red-500 text-xs mt-1 font-medium">{profileFormik.errors.location}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Company Size (Headcount) *</label>
            <Input name="size" value={profileFormik.values.size} onChange={profileFormik.handleChange} onBlur={profileFormik.handleBlur} placeholder="e.g. 501-1,000 employees" />
            {profileFormik.touched.size && profileFormik.errors.size && <p className="text-red-500 text-xs mt-1 font-medium">{profileFormik.errors.size}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Description Abstract *</label>
            <Textarea name="description" value={profileFormik.values.description} onChange={profileFormik.handleChange} onBlur={profileFormik.handleBlur} rows={4} className="resize-none" />
            {profileFormik.touched.description && profileFormik.errors.description && <p className="text-red-500 text-xs mt-1 font-medium">{profileFormik.errors.description}</p>}
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-full px-5">Cancel</Button>
            <Button type="submit" className="bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full px-5">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};