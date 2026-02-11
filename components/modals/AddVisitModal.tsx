'use client';

import { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { visitSchema, VisitFormValues } from '@/lib/validations';
import { X } from 'lucide-react';
import { usePatients } from '@/context/PatientContext';
import { v4 as uuidv4 } from 'uuid';
import { Visit } from '@/lib/mockData';
import { useEffect } from 'react';

interface AddVisitModalProps {
    isOpen: boolean;
    onClose: () => void;
    patientId: string;
    initialData?: Visit | null;
}

const AddVisitModal = ({ isOpen, onClose, patientId, initialData }: AddVisitModalProps) => {
    const { addVisit, updateVisit } = usePatients();

    const [medications, setMedications] = useState<string[]>([]);
    const [currentMedication, setCurrentMedication] = useState('');

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<VisitFormValues>({
        resolver: zodResolver(visitSchema),
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            diagnosis: '',
            medication: '',
            notes: '',
        },
    });

    useEffect(() => {
        if (isOpen && initialData) {
            reset({
                date: initialData.visitDate.split('T')[0], // Ensure correct date format for input
                diagnosis: initialData.diagnosis,
                medication: '',
                notes: initialData.notes,
            });
            setMedications(initialData.medications || []);
        } else if (isOpen && !initialData) {
            reset({
                date: new Date().toISOString().split('T')[0],
                diagnosis: '',
                medication: '',
                notes: '',
            });
            setMedications([]);
        }
    }, [isOpen, initialData, reset]);

    if (!isOpen) return null;

    const handleAddMedication = () => {
        if (currentMedication.trim()) {
            setMedications([...medications, currentMedication.trim()]);
            setCurrentMedication('');
        }
    };

    const handleRemoveMedication = (index: number) => {
        setMedications(medications.filter((_, i) => i !== index));
    };

    const onSubmit: SubmitHandler<VisitFormValues> = async (data) => {
        if (initialData) {
            await updateVisit(patientId, {
                ...initialData,
                visitDate: data.date,
                diagnosis: data.diagnosis,
                medications: medications,
                notes: data.notes || '',
            });
        } else {
            await addVisit(patientId, {
                id: uuidv4(),
                visitDate: data.date,
                diagnosis: data.diagnosis,
                medications: medications,
                notes: data.notes || '',
            });
        }

        reset();
        setMedications([]);
        setCurrentMedication('');
        onClose();
    };

    const handleClose = () => {
        reset();
        setMedications([]);
        setCurrentMedication('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-500/75"
                onClick={handleClose}
            />

            {/* Modal */}
            <div
                className="relative z-10 w-full max-w-lg mx-4 bg-white rounded-xl shadow-xl"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
                <div className="px-4 pt-5 pb-4 sm:p-6">
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-lg font-medium text-gray-900">
                            {initialData ? 'Edit Medical Record' : 'Add Medical Record'}
                        </h3>
                        <button
                            onClick={handleClose}
                            className="bg-gray-100 rounded-full p-1 hover:bg-gray-200"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <Controller
                                name="date"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <input
                                            {...field}
                                            type="date"
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
                                    </>
                                )}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                            <Controller
                                name="diagnosis"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <input
                                            {...field}
                                            type="text"
                                            placeholder="e.g. Acute Bronchitis"
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
                                    </>
                                )}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Medications</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="e.g. Amoxicillin 500mg"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    value={currentMedication}
                                    onChange={(e) => setCurrentMedication(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddMedication();
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddMedication}
                                    className="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 min-h-[32px]">
                                {medications.map((med, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                                    >
                                        {med}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveMedication(index)}
                                            className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-600 focus:outline-none"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                                {medications.length === 0 && (
                                    <span className="text-sm text-gray-400 italic">No medications added</span>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Notes</label>
                            <Controller
                                name="notes"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <textarea
                                            {...field}
                                            rows={3}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
                                            value={field.value || ''}
                                        />
                                        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
                                    </>
                                )}
                            />
                        </div>

                        <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
                            >
                                {isSubmitting ? 'Saving...' : 'Save Record'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddVisitModal;
