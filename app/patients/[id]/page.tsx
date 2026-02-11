import PatientProfile from '@/components/PatientProfile';

// This is correct for Next.js 16 App Router
type Params = Promise<{ id: string }>;

export default async function PatientDetailsPage(props: { params: Params }) {
    const params = await props.params;
    const patientId = params.id;

    return <PatientProfile id={patientId} />;
}
