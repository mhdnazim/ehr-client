'use client';

import { PatientProvider } from '@/context/PatientContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <PatientProvider>
            {children}
        </PatientProvider>
    );
}
