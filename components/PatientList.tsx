'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Patient } from '@/lib/mockData';
import PatientCard from './PatientCard';
import Loader from './Loader';

interface PatientListProps {
    initialPatients: Patient[];
    onEdit: (patient: Patient) => void;
    onDelete: (id: string) => void;
    isLoading?: boolean;
}

const PatientList: React.FC<PatientListProps> = ({ initialPatients, onEdit, onDelete, isLoading = false }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPatients = initialPatients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="relative max-w-md mx-auto md:mx-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm"
                    placeholder="Search patients by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <Loader />
                </div>
            ) : filteredPatients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPatients.map((patient) => (
                        <PatientCard
                            key={patient._id}
                            patient={patient}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                    <div className="text-gray-400 mb-2">No patients found</div>
                    <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
                </div>
            )}
        </div>
    );
};

export default PatientList;
