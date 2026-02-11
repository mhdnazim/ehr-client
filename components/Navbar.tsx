import Link from 'next/link';
import { HeartPulse } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="p-2 bg-gradient-to-tr from-blue-500 to-teal-400 rounded-xl shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                                <HeartPulse className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500 tracking-tight">
                                MediCare<span className="text-gray-400 font-light">EHR</span>
                            </span>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                            Dashboard
                        </Link>
                        <Link href="#" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                            Patients
                        </Link>
                        <Link href="#" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                            Schedule
                        </Link>
                        {/* <button className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5">
                            Add Patient
                        </button> */}
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-white shadow-md"><img src="https://www.freeiconspng.com/uploads/doctors-transparent-icon-10.png" alt="profile" /></div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
