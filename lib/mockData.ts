

export interface Visit {
    _id?: string;
    id: string;
    visitDate: string;
    diagnosis: string;
    medications: string[];
    notes: string;
}

export interface Patient {
    _id: string;
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    contact: string;
    address: string;
    lastVisit?: string;
    visits: Visit[];
}

// Initial Mock Data
export const INITIAL_PATIENTS: Patient[] = [
    {
        _id: '1',
        name: 'Sarah Johnson',
        age: 34,
        gender: 'Female',
        contact: '+1 (555) 123-4567',
        address: '123 Maple Ave, Springfield, IL',
        lastVisit: '2023-10-15',
        visits: [
            {
                id: '101',
                visitDate: '2023-10-15',
                diagnosis: 'Acute Bronchitis',
                medications: ['Amoxicillin 500mg'],
                notes: 'Patient reported coughing and fever for 3 days.',
            },
            {
                id: '102',
                visitDate: '2023-05-20',
                diagnosis: 'Routine Checkup',
                medications: ['None'],
                notes: 'Blood pressure normal. No complaints.',
            },
        ],
    },
    {
        _id: '2',
        name: 'Michael Chen',
        age: 45,
        gender: 'Male',
        contact: '+1 (555) 987-6543',
        address: '456 Oak Dr, Metropolis, NY',
        lastVisit: '2023-11-02',
        visits: [
            {
                id: '201',
                visitDate: '2023-11-02',
                diagnosis: 'Hypertension',
                medications: ['Lisinopril 10mg'],
                notes: 'Follow-up on high blood pressure.',
            },
        ],
    },
    {
        _id: '3',
        name: 'Emily Davis',
        age: 28,
        gender: 'Female',
        contact: '+1 (555) 555-5555',
        address: '789 Pine Ln, Gotham, NJ',
        lastVisit: '2023-09-10',
        visits: [
            {
                id: '301',
                visitDate: '2023-09-10',
                diagnosis: 'Migraine',
                medications: ['Sumatriptan 50mg'],
                notes: 'Recurring headaches with aura.',
            }
        ],
    },
];
