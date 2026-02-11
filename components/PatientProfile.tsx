'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Phone, MapPin, Plus } from 'lucide-react';
import { usePatients } from '@/context/PatientContext';
import VisitHistory from '@/components/VisitHistory';
import AddVisitModal from '@/components/modals/AddVisitModal';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import { Visit } from '@/lib/mockData';

interface PatientProfileProps {
    id: string;
}

export default function PatientProfile({ id }: PatientProfileProps) {
    const { getPatient, fetchPatient, fetchMedicalRecords, deleteVisit } = usePatients();
    const [isAddVisitOpen, setIsAddVisitOpen] = useState(false);
    const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; visitId: string | null }>({
        isOpen: false,
        visitId: null,
    });

    const patient = getPatient(id);
    const [isLoading, setIsLoading] = useState(!patient);

    const dataFetchedRef = useRef<string | null>(null);

    useEffect(() => {
        if (dataFetchedRef.current === id) return;
        dataFetchedRef.current = id;

        const loadPatient = async () => {
            await fetchPatient(id);
            await fetchMedicalRecords(id);
            setIsLoading(false);
        };
        loadPatient();
    }, [id, fetchPatient, fetchMedicalRecords]);

    const handleEditVisit = (visit: Visit) => {
        setEditingVisit(visit);
        setIsAddVisitOpen(true);
    };

    const handleDeleteClick = (visitId: string) => {
        setDeleteConfirmation({ isOpen: true, visitId });
    };

    const handleConfirmDelete = async () => {
        if (deleteConfirmation.visitId) {
            await deleteVisit(id, deleteConfirmation.visitId);
            setDeleteConfirmation({ isOpen: false, visitId: null });
        }
    };

    const handleCloseModal = () => {
        setIsAddVisitOpen(false);
        setEditingVisit(null);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-800">Patient not found</h2>
                <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">Return to Dashboard</Link>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header & Back Link */}
            <div>
                <Link
                    href="/"
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Dashboard
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Patient Profile</h1>
                    <button
                        onClick={() => setIsAddVisitOpen(true)}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none ring-2 ring-offset-2 ring-blue-500 transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Record
                    </button>
                </div>
            </div>

            {/* Patient Bio Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-blue-500 to-teal-400"></div>
                <div className="px-6 pb-6 relative">
                    <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-6 gap-6">
                        <div className="h-24 w-24 rounded-2xl bg-white p-1 shadow-lg">
                            <div className="h-full w-full rounded-xl bg-gradient-to-tr from-gray-100 to-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500">
                                {patient.name.charAt(0)}
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
                            <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                    <User className="w-4 h-4" /> {patient.age} yrs • {patient.gender}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Phone className="w-4 h-4" /> {patient.contact}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" /> {patient.address}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visit History */}
            <VisitHistory
                visits={patient.visits || []}
                onEdit={handleEditVisit}
                onDelete={handleDeleteClick}
            />

            <AddVisitModal
                isOpen={isAddVisitOpen}
                onClose={handleCloseModal}
                patientId={patient._id}
                initialData={editingVisit}
            />

            <ConfirmationModal
                isOpen={deleteConfirmation.isOpen}
                onClose={() => setDeleteConfirmation({ isOpen: false, visitId: null })}
                onConfirm={handleConfirmDelete}
                title="Delete Medical Record"
                message="Are you sure you want to delete this medical record? This action cannot be undone."
                confirmText="Delete Record"
                variant="danger"
            />
        </div>
    );
}
