'use client';

import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { patientSchema, PatientFormValues } from '@/lib/validations';
import { X } from 'lucide-react';
import { usePatients } from '@/context/PatientContext';
import { v4 as uuidv4 } from 'uuid';
import { Patient } from '@/lib/mockData';
import { useEffect } from 'react';

interface PatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    patient?: Patient | null;
}

const PatientModal = ({ isOpen, onClose, patient }: PatientModalProps) => {
    const { addPatient, updatePatient } = usePatients();

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<PatientFormValues>({
        resolver: zodResolver(patientSchema),
        defaultValues: {
            name: '',
            age: '',
            gender: 'Male',
            contact: '',
            address: '',
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (patient) {
                reset({
                    name: patient.name,
                    age: String(patient.age),
                    gender: patient.gender,
                    contact: patient.contact ? patient.contact.replace('+91-', '') : '',
                    address: patient.address,
                });
            } else {
                reset({
                    name: '',
                    age: '',
                    gender: 'Male',
                    contact: '',
                    address: '',
                });
            }
        }
    }, [isOpen, patient, reset]);


    if (!isOpen) return null;

    const onSubmit: SubmitHandler<PatientFormValues> = async (data) => {
        if (patient) {
            // Edit mode
            await updatePatient({
                ...patient,
                name: data.name,
                age: Number(data.age),
                gender: data.gender,
                contact: data.contact,
                address: data.address,
            });
        } else {
            // Add mode
            await addPatient({
                _id: uuidv4(),
                name: data.name,
                age: Number(data.age),
                gender: data.gender,
                contact: data.contact,
                address: data.address,
                lastVisit: undefined,
                visits: [],
            });
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-500/75"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative z-10 w-full max-w-lg mx-4 bg-white rounded-xl shadow-xl"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
                <div className="px-4 pt-5 pb-4 sm:p-6">
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-lg font-medium text-gray-900">
                            {patient ? 'Edit Patient' : 'Add New Patient'}
                        </h3>
                        <button
                            onClick={onClose}
                            className="bg-gray-100 rounded-full p-1 hover:bg-gray-200"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <input
                                            {...field}
                                            type="text"
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
                                    </>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                <Controller
                                    name="age"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <>
                                            <input
                                                {...field}
                                                type="number"
                                                min="0"
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                            {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
                                        </>
                                    )}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <Controller
                                    name="gender"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <>
                                            <select
                                                {...field}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
                                        </>
                                    )}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                            <Controller
                                name="contact"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <input
                                            {...field}
                                            type="tel"
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
                                    </>
                                )}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <Controller
                                name="address"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <textarea
                                            {...field}
                                            rows={3}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
                                    </>
                                )}
                            />
                        </div>

                        <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
                            >
                                {isSubmitting ? 'Saving...' : (patient ? 'Save Changes' : 'Add Patient')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PatientModal;
