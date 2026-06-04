import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import type { AppDispatch } from '../../../store';
import {
    createExperience,
    updateExperience,
    deleteExperience,
    type Experience,
} from '../../../api/profileApi';

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
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Separator } from '../../../components/ui/separator';
import { Trash2 } from 'lucide-react';

interface Props {
    open: boolean;
    onClose: () => void;
    item?: Experience;
    userId: number;
}

interface ExperienceFormValues {
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    description: string;
}

const ExperienceDialog = ({
    open,
    onClose,
    item,
    userId,
}: Props) => {
    const dispatch = useDispatch<AppDispatch>();

    const isEdit = Boolean(item);

    const formik = useFormik<ExperienceFormValues>({
        enableReinitialize: true,

        initialValues: {
            title: item?.title ?? '',
            company: item?.company ?? '',
            location: item?.location ?? '',
            startDate: item?.startDate ?? '',
            endDate: item?.endDate ?? '',
            isCurrent: item?.isCurrent ?? false,
            description: item?.description ?? '',
        },

        validationSchema: Yup.object({
            title: Yup.string().required('Title is required'),
            company: Yup.string().required('Company is required'),
            location: Yup.string().required('Location is required'),
            startDate: Yup.string().required('Start date is required'),
        }),

        onSubmit: async (values) => {
            const payload = {
                userId,
                title: values.title,
                company: values.company,
                location: values.location,
                startDate: values.startDate,
                endDate: values.endDate || null,
                isCurrent: values.isCurrent,
                description: values.description,
            };

            try {
                if (isEdit && item) {
                    await dispatch(
                        updateExperience({
                            id: item.id,
                            data: payload,
                        })
                    ).unwrap();
                } else {
                    await dispatch(createExperience(payload)).unwrap();
                }

                onClose();
            } catch (error) {
                console.error(error);
            }
        },
    });

    const handleDelete = async () => {
        if (!item) return;

        try {
            await dispatch(deleteExperience(item.id)).unwrap();
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Edit Experience' : 'Add Experience'}
                    </DialogTitle>

                    <DialogDescription>
                        {isEdit
                            ? 'Update your work experience.'
                            : 'Add a new work experience.'}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={formik.handleSubmit}
                    className="space-y-4"
                >
                    <div className="space-y-1">
                        <Label>Job Title</Label>
                        <Input
                            {...formik.getFieldProps('title')}
                            placeholder="Frontend Developer"
                        />
                        {formik.touched.title && formik.errors.title && (
                            <p className="text-xs text-destructive">
                                {formik.errors.title}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label>Company</Label>
                        <Input
                            {...formik.getFieldProps('company')}
                            placeholder="Google"
                        />
                        {formik.touched.company && formik.errors.company && (
                            <p className="text-xs text-destructive">
                                {formik.errors.company}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label>Location</Label>
                        <Input
                            {...formik.getFieldProps('location')}
                            placeholder="New York, USA"
                        />
                        {formik.touched.location &&
                            formik.errors.location && (
                                <p className="text-xs text-destructive">
                                    {formik.errors.location}
                                </p>
                            )}
                    </div>

                    <div className='flex items-center justify-between'>

                        <div className="space-y-1">
                            <Label>Start Date</Label>
                            <Input
                                type="date"
                                {...formik.getFieldProps('startDate')}
                            />
                            {formik.touched.startDate && formik.errors.startDate && (
                                <p className="text-xs text-destructive">
                                    {formik.errors.startDate}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label>End Date</Label>
                            <Input
                                type="date"
                                {...formik.getFieldProps('endDate')}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formik.values.isCurrent}
                            onChange={(e) =>
                                formik.setFieldValue(
                                    'isCurrent',
                                    e.target.checked
                                )
                            }
                        />

                        <Label>Current Position</Label>
                    </div>

                    <div className="space-y-1">
                        <Label>Description</Label>
                        <Textarea
                            rows={4}
                            {...formik.getFieldProps('description')}
                            placeholder="Describe your role..."
                        />
                    </div>

                    {isEdit && <Separator />}

                    <DialogFooter className="flex justify-between">
                        {isEdit && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={handleDelete}
                            >
                                <Trash2 size={14} className="mr-1" />
                                Delete
                            </Button>
                        )}

                        <div className="flex gap-2 ml-auto">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={formik.isSubmitting}
                            >
                                {formik.isSubmitting
                                    ? 'Saving...'
                                    : 'Save'}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ExperienceDialog;