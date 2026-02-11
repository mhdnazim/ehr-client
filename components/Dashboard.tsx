'use client';

import { useState } from 'react';
import PatientList from '@/components/PatientList';
import { usePatients } from '@/context/PatientContext';
import { Users, Activity, Calendar, Plus } from 'lucide-react';
import PatientModal from './modals/PatientModal';
import ConfirmationModal from './modals/ConfirmationModal';
import { Patient } from '@/lib/mockData';

export default function Dashboard() {
    const { patients, deletePatient } = usePatients();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; patientId: string | null }>({
        isOpen: false,
        patientId: null,
    });

    // Calculate stats
    const totalPatients = patients.length;
    // Mock active visits logic (e.g., visits in last 30 days or just a random static number for now)
    const activeVisits = Math.floor(totalPatients * 0.3) + 5;
    const appointments = Math.floor(totalPatients * 0.1) + 2;

    const handleAddPatient = () => {
        setEditingPatient(null);
        setIsModalOpen(true);
    };

    const handleEditPatient = (patient: Patient) => {
        setEditingPatient(patient);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setDeleteConfirmation({ isOpen: true, patientId: id });
    };

    const handleConfirmDelete = async () => {
        if (deleteConfirmation.patientId) {
            await deletePatient(deleteConfirmation.patientId);
            setDeleteConfirmation({ isOpen: false, patientId: null });
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPatient(null);
    };

    return (
        <div className="space-y-8">
            {/* Hero / Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-blue-100 font-medium">Total Patients</p>
                                <h3 className="text-3xl font-bold mt-1">{totalPatients}</h3>
                            </div>
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm text-blue-100">
                            <span className="bg-white/20 px-1.5 py-0.5 rounded text-white">+1</span>
                            <span>new this session</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-teal-50 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 font-medium">Active Visits</p>
                                <h3 className="text-3xl font-bold mt-1 text-gray-900">{activeVisits}</h3>
                            </div>
                            <div className="p-2 bg-teal-50 rounded-lg">
                                <Activity className="w-6 h-6 text-teal-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                            <span className="text-teal-600 font-medium">Recorded</span>
                            <span>in system</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-purple-50 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 font-medium">Appointments</p>
                                <h3 className="text-3xl font-bold mt-1 text-gray-900">{appointments}</h3>
                            </div>
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <Calendar className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                            <span className="text-purple-600 font-medium">Next: 2:00 PM</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Patient List</h2>
                <button
                    onClick={handleAddPatient}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none ring-2 ring-offset-2 ring-blue-500 transition-all"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Patient
                </button>
            </div>

            <PatientList
                initialPatients={patients}
                onEdit={handleEditPatient}
                onDelete={handleDeleteClick}
            />

            <PatientModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                patient={editingPatient}
            />

            <ConfirmationModal
                isOpen={deleteConfirmation.isOpen}
                onClose={() => setDeleteConfirmation({ isOpen: false, patientId: null })}
                onConfirm={handleConfirmDelete}
                title="Delete Patient"
                message="Are you sure you want to delete this patient? This action cannot be undone."
                confirmText="Delete Patient"
                variant="danger"
            />
        </div>
    );
}
