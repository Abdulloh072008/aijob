import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import type { AppDispatch } from '../../../store';
import { addLanguage, updateLanguage, deleteLanguage } from '../../../api/profileApi';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Separator } from '../../../components/ui/separator';
import { Trash2 } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  item?:any;
  profileId: string;
}

const PROFICIENCY_LEVELS = [
  'Native',
  'Full Professional',
  'Professional Working',
  'Limited Working',
  'Conversational',
  'Elementary',
];

const LanguageDialog = ({ open, onClose, item, profileId }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const isEdit = !!item;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      language: item?.language || '',
      proficiency: item?.proficiency || 'Conversational',
    },
    validationSchema: Yup.object({
      language: Yup.string().required('Required'),
      proficiency: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      if (isEdit) {
        await dispatch(updateLanguage({ id: item.id, data: { ...values, profileId } }));
      } else {
        await dispatch(addLanguage({ ...values, profileId }));
      }
      onClose();
    },
  });

  const handleDelete = async () => {
    await dispatch(deleteLanguage(item.id));
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Language' : 'Add Language'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label>Language</Label>
            <Input {...formik.getFieldProps('language')} placeholder="e.g. English" />
            {formik.touched.language && formik.errors.language && (
              <p className="text-xs text-destructive">{formik.errors.language}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label>Proficiency</Label>
            <select
              {...formik.getFieldProps('proficiency')}
              className="w-full border rounded-md px-3 py-2 text-sm bg-background"
            >
              {PROFICIENCY_LEVELS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {isEdit && <Separator />}

          <DialogFooter className="flex justify-between">
            {isEdit && (
              <Button type="button" variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 size={14} className="mr-1" /> Delete
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageDialog;