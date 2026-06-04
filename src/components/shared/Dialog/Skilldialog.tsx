import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import type { AppDispatch, RootState } from '../../../store';
import { addSkill, deleteSkill } from '../../../api/profileApi';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../../../components/ui/dialog';

import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const SkillDialog = ({ open, onClose, userId }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const skills = useSelector((s: RootState) => s.profile.skills);

  const formik = useFormik({
    initialValues: { skillName: '' },
    validationSchema: Yup.object({
      skillName: Yup.string().trim().required('Skill is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!values.skillName.trim()) return;

      await dispatch(
        addSkill({
          userId: Number(userId),
          skillName: values.skillName.trim(),
        })
      ).unwrap();

      resetForm();
    },
  });

  const handleDelete = async (id?: number) => {
    if (!id) return;

    await dispatch(deleteSkill(id)).unwrap();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Skills</DialogTitle>
          <DialogDescription>
            Add or remove skills to highlight your expertise.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="flex gap-2">
          <Input
            {...formik.getFieldProps('skillName')}
            placeholder="e.g. React, Python..."
            className="flex-1"
          />

          <Button type="submit">
            Add
          </Button>
        </form>

        {formik.touched.skillName && formik.errors.skillName && (
          <p className="text-xs text-destructive -mt-2">
            {formik.errors.skillName}
          </p>
        )}

        <Separator />

        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
          {skills?.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No skills yet. Add one above.
            </p>
          ) : (
            skills.map((sk, idx) => (
              <Badge
                key={sk.id ?? idx}
                variant="secondary"
                className="flex items-center gap-1 pr-1"
              >
                {sk.skillName || sk.name}

                <button
                  type="button"
                  className="ml-1 hover:text-red-500"
                  onClick={() => handleDelete(sk.id)}
                >
                  <X size={12} />
                </button>
              </Badge>
            ))
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SkillDialog;