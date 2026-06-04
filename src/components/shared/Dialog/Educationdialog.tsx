import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2 } from 'lucide-react';

import type { AppDispatch, RootState } from '../../../store';
import {
  createEducation,
  updateEducation,
  deleteEducation,
  type Education,
} from '../../../api/profileApi';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../../../components/ui/dialog';

import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Button } from '../../../components/ui/button';
import { Separator } from '../../../components/ui/separator';

interface Props {
  open: boolean;
  onClose: () => void;
  item?: Education;
}

const EducationDialog = ({ open, onClose, item }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { me } = useSelector((state: RootState) => state.profile);

  const isEdit = !!item;

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      school: item?.institution || '',
      degree: item?.degree || '',
      fieldOfStudy: item?.field || '',
      startDate: item?.startDate ? item.startDate.slice(0, 10) : '',
      endDate: item?.endDate ? item.endDate.slice(0, 10) : '',
    },

    validationSchema: Yup.object({
      school: Yup.string().required('School is required'),
      degree: Yup.string().required('Degree is required'),
    }),

    onSubmit: async (values) => {
      const payload = {
        userId: Number(me?.id),
        institution: values.school,
        degree: values.degree,
        field: values.fieldOfStudy,
        startDate: values.startDate,
        endDate: values.endDate,
      };

      if (isEdit) {
        await dispatch(
          updateEducation({
            id: Number(item.id),
            data: payload,
          })
        );
      } else {
        await dispatch(createEducation(payload));
      }

      onClose();
    },
  });

  const handleDelete = async () => {
    await dispatch(deleteEducation(Number(item.id)));
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Education' : 'Add Education'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update your education details'
              : 'Add your education background'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label>School</Label>
            <Input
              name="school"
              value={formik.values.school}
              onChange={formik.handleChange}
            />
          </div>

          <div className="space-y-1">
            <Label>Degree</Label>
            <Input
              name="degree"
              value={formik.values.degree}
              onChange={formik.handleChange}
            />
          </div>

          <div className="space-y-1">
            <Label>Field of Study</Label>
            <Input
              name="fieldOfStudy"
              value={formik.values.fieldOfStudy}
              onChange={formik.handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Start Date</Label>
              <Input
                type="date"
                name="startDate"
                value={formik.values.startDate}
                onChange={formik.handleChange}
              />
            </div>

            <div className="space-y-1">
              <Label>End Date</Label>
              <Input
                type="date"
                name="endDate"
                value={formik.values.endDate}
                onChange={formik.handleChange}
              />
            </div>
          </div>

          <Separator />

          <DialogFooter className="flex flex-col gap-2">
            <div className="flex gap-2 ml-auto">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>

              <Button type="submit">
                {isEdit ? 'Update' : 'Save'}
              </Button>
            </div>

            {isEdit && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className=""
              >
                <Trash2 size={14} className="mr-1" />
                Delete Education
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EducationDialog;