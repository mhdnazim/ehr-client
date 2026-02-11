import Link from 'next/link';
import { User, Calendar, MapPin, Edit2, Trash2 } from 'lucide-react';
import { Patient } from '@/lib/mockData';

interface PatientCardProps {
    patient: Patient;
    onEdit: (patient: Patient) => void;
    onDelete: (id: string) => void;
}

const PatientCard = ({ patient, onEdit, onDelete }: PatientCardProps) => {
    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onEdit(patient);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete(patient._id);
    };

    return (
        <div className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
            <Link href={`/patients/${patient._id}`} className="block p-6 h-full">
                {/* Decorative gradient blob */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-teal-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>

                <div className="flex justify-between items-start relative z-10">
                    <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-100 to-teal-100 flex items-center justify-center text-blue-600 font-bold text-lg shadow-sm border border-white">
                            {patient.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {patient.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <User className="w-3.5 h-3.5" />
                                <span>{patient.age} years • {patient.gender}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>Last Visit: {patient.lastVisit || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span className="truncate max-w-[120px]">{patient.address}</span>
                    </div>
                </div>
            </Link>

            {/* Actions */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                    onClick={handleEdit}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors"
                    title="Edit Patient"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <button
                    onClick={handleDelete}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors"
                    title="Delete Patient"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default PatientCard;
