import { Visit } from '@/lib/mockData';
import { Calendar, Stethoscope, Pill, FileText, Edit2, Trash2 } from 'lucide-react';

interface VisitHistoryProps {
    visits: Visit[];
    onEdit: (visit: Visit) => void;
    onDelete: (id: string) => void;
}

const VisitHistory = ({ visits, onEdit, onDelete }: VisitHistoryProps) => {
    // Sort visits by date (newest first)
    const sortedVisits = [...visits].sort((a, b) =>
        new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
    );

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Medical History
            </h3>

            {sortedVisits.length > 0 ? (
                <div className="relative border-l-2 border-blue-100 ml-3 space-y-8">
                    {sortedVisits.map((visit, index) => (
                        <div key={index} className="relative pl-8">
                            {/* Timeline dot */}
                            <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-white border-4 border-blue-500 shadow-sm"></div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-300">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900">{visit.diagnosis}</h4>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(visit.visitDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onEdit(visit)}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit Record"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(visit._id || visit.id)}
                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Record"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                            <Stethoscope className="w-4 h-4 text-teal-600" />
                                            Notes
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed">{visit.notes}</p>
                                    </div>

                                    <div className="bg-blue-50/50 rounded-lg p-3">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-purple-50 rounded-lg">
                                                <Pill className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900">Medication</h4>
                                                <p className="text-sm text-gray-600 font-medium">
                                                    {visit.medications.length > 0 ? visit.medications.join(', ') : 'None'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500">No medical records found for this patient.</p>
                </div>
            )}
        </div>
    );
};

export default VisitHistory;
