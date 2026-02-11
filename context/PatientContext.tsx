'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Patient, Visit } from '@/lib/mockData';

interface PatientContextType {
    patients: Patient[];
    addPatient: (patient: Patient) => void;
    updatePatient: (patient: Patient) => void;
    deletePatient: (patientId: string) => void;
    addVisit: (patientId: string, visit: Visit) => void;
    getPatient: (id: string) => Patient | undefined;
    fetchPatient: (id: string) => Promise<Patient | undefined>;
    fetchMedicalRecords: (patientId: string) => Promise<Visit[]>;
    deleteVisit: (patientId: string, visitId: string) => Promise<void>;
    updateVisit: (patientId: string, visit: Visit) => Promise<void>;
    loading: boolean;
    error: string | null;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider = ({ children }: { children: ReactNode }) => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPatients = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/patients', {
                data: {}
            });
            if (response.data.success) {
                setPatients(response.data.data);
            }
        } catch (err: any) {
            console.error('Error fetching patients:', err);
            setError(err.message || 'Failed to fetch patients');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatient = React.useCallback(async (id: string) => {
        try {
            const response = await axios.get(`http://localhost:4000/api/patients/${id}`);
            if (response.data.success) {
                const fetchedPatient = response.data.data;
                setPatients((prev) => {
                    const exists = prev.find((p) => p._id === fetchedPatient._id);
                    if (exists) {
                        return prev.map((p) => (p._id === fetchedPatient._id ? fetchedPatient : p));
                    }
                    return [...prev, fetchedPatient];
                });
                return fetchedPatient;
            }
        } catch (err: any) {
            console.error('Error fetching patient:', err);
            return undefined;
        }
    }, []);

    const fetchMedicalRecords = React.useCallback(async (patientId: string) => {
        try {
            const response = await axios.get(`http://localhost:4000/api/patients/${patientId}/medical-records`);
            if (response.data.success) {
                const visits = response.data.data;
                // Update the patient's visits in the local state
                setPatients((prev) =>
                    prev.map((p) => {
                        if (p._id === patientId) {
                            return { ...p, visits };
                        }
                        return p;
                    })
                );
                return visits;
            }
        } catch (err: any) {
            console.error('Error fetching medical records:', err);
            return [];
        }
    }, []);

    const addPatient = async (patient: Patient) => {
        try {
            const response = await axios.post('http://localhost:4000/api/patients', {
                name: patient.name,
                age: patient.age,
                gender: patient.gender,
                contact: `+91-${patient.contact}`,
                address: patient.address
            });
            if (response.data.success) {
                setPatients((prev) => [response.data.data, ...prev]);
                toast.success('Patient added successfully!');
            }
        } catch (err: any) {
            console.error('Error adding patient:', err);
            const errorMessage = err.message || 'Failed to add patient';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    const updatePatient = async (patient: Patient) => {
        try {
            const response = await axios.put(`http://localhost:4000/api/patients/${patient._id}`, {
                name: patient.name,
                age: patient.age,
                gender: patient.gender,
                contact: `+91-${patient.contact}`,
                address: patient.address
            });
            if (response.data.success) {
                setPatients((prev) => prev.map((p) => (p._id === patient._id ? response.data.data : p)));
                toast.success('Patient updated successfully!');
            }
        } catch (err: any) {
            console.error('Error updating patient:', err);
            const errorMessage = err.message || 'Failed to update patient';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    const deletePatient = async (patientId: string) => {
        try {
            const response = await axios.delete(`http://localhost:4000/api/patients/${patientId}`);
            if (response.data.success) {
                setPatients((prev) => prev.filter((p) => p._id !== patientId));
                toast.success('Patient deleted successfully!');
            }
        } catch (err: any) {
            console.error('Error deleting patient:', err);
            const errorMessage = err.message || 'Failed to delete patient';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    const addVisit = async (patientId: string, visit: Visit) => {
        try {
            const response = await axios.post('http://localhost:4000/api/medical-records', {
                patientId,
                visitDate: visit.visitDate,
                diagnosis: visit.diagnosis,
                medications: visit.medications,
                notes: visit.notes
            });

            if (response.data.success) {

                // Update local state
                setPatients((prev) =>
                    prev.map((p) => {
                        if (p._id === patientId) {
                            const updatedVisits = [visit, ...p.visits];
                            // Update lastVisit date if the new visit is more recent
                            const lastVisitDate = visit.visitDate > (p.lastVisit || '') ? visit.visitDate : p.lastVisit;
                            return { ...p, visits: updatedVisits, lastVisit: lastVisitDate };
                        }
                        return p;
                    })
                );
                toast.success('Medical record added successfully!');
            }
        } catch (err: any) {
            console.error('Error adding medical record:', err);
            const errorMessage = err.message || 'Failed to add medical record';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    const deleteVisit = async (patientId: string, visitId: string) => {
        try {
            const response = await axios.delete(`http://localhost:4000/api/medical-records/${visitId}`);

            if (response.data.success) {
                setPatients((prev) =>
                    prev.map((p) => {
                        if (p._id === patientId) {
                            const updatedVisits = p.visits.filter((v) => (v._id || v.id) !== visitId);
                            return { ...p, visits: updatedVisits };
                        }
                        return p;
                    })
                );
                toast.success('Medical record deleted successfully!');
            }
        } catch (err: any) {
            console.error('Error deleting medical record:', err);
            const errorMessage = err.message || 'Failed to delete medical record';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    const updateVisit = async (patientId: string, visit: Visit) => {
        try {
            const visitId = visit._id || visit.id;
            const response = await axios.put(`http://localhost:4000/api/medical-records/${visitId}`, {
                visitDate: visit.visitDate,
                diagnosis: visit.diagnosis,
                medications: visit.medications,
                notes: visit.notes
            });

            if (response.data.success) {
                setPatients((prev) =>
                    prev.map((p) => {
                        if (p._id === patientId) {
                            const updatedVisits = p.visits.map((v) => {
                                if ((v._id || v.id) === visitId) {
                                    return { ...v, ...visit };
                                }
                                return v;
                            });
                            return { ...p, visits: updatedVisits };
                        }
                        return p;
                    })
                );
                toast.success('Medical record updated successfully!');
            }
        } catch (err: any) {
            console.error('Error updating medical record:', err);
            const errorMessage = err.message || 'Failed to update medical record';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    const getPatient = (id: string) => patients.find((p) => p._id === id);

    return (
        <PatientContext.Provider value={{
            patients,
            addPatient,
            updatePatient,
            deletePatient,
            addVisit,
            deleteVisit,
            updateVisit,
            getPatient,
            fetchPatient,
            fetchMedicalRecords,
            loading,
            error
        }}>
            {children}
        </PatientContext.Provider>
    );
};

export const usePatients = () => {
    const context = useContext(PatientContext);
    if (context === undefined) {
        throw new Error('usePatients must be used within a PatientProvider');
    }
    return context;
};
