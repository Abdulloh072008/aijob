import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import type { AppDispatch, RootState } from '../../../store';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { upsertProfile } from '../../../api/profileApi';

interface Props {
  open: boolean;
  onClose: () => void;
}

const EditProfileDialog = ({ open, onClose }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector((s: RootState) => s.profile.profile);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      bio: profile?.bio || '',
      title: profile?.title || '',
      location: profile?.location || '',
      avatarUrl: profile?.avatarUrl || '',
      bannerUrl: profile?.bannerUrl || '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      await dispatch(upsertProfile(values));
      onClose();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label>Title</Label>
            <Input {...formik.getFieldProps('title')} placeholder="e.g. Senior Engineer" />
            {formik.touched.title && formik.errors.title && (
              <p className="text-xs text-destructive">{formik.errors.title}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label>Location</Label>
            <Input {...formik.getFieldProps('location')} placeholder="e.g. San Francisco, CA" />
          </div>
          <div className="space-y-1">
            <Label>Bio</Label>
            <Textarea {...formik.getFieldProps('bio')} placeholder="Tell us about yourself..." rows={4} />
          </div>
          <div className="space-y-1">
            <Label>Avatar URL</Label>
            <Input {...formik.getFieldProps('avatarUrl')} placeholder="https://..." />
          </div>
          <div className="space-y-1">
            <Label>Banner URL</Label>
            <Input {...formik.getFieldProps('bannerUrl')} placeholder="https://..." />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;