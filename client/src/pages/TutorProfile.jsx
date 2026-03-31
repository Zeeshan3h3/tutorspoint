import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTutorById } from '../services/tutorService';
import { MapPin, BookOpen, IndianRupee, Phone } from 'lucide-react';

export default function TutorProfile() {
    const { id } = useParams();
    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');

    useEffect(() => {
        getTutorById(id).then(res => setTutor(res.data)).catch(() => setErr('Tutor not found.')).finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>;
    if (err || !tutor) return <p className="text-center py-20 text-gray-500">{err || 'Tutor not found.'}</p>;

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <div className="bg-white rounded-2xl shadow-md p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                        {tutor.userId?.name?.[0] || 'T'}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{tutor.userId?.name}</h1>
                        <span className="text-sm text-green-600 font-medium">✓ Verified Tutor</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-700">
                    <div className="flex items-center gap-2"><BookOpen size={16} /><span>{tutor.subjects?.join(', ')}</span></div>
                    <div className="flex items-center gap-2"><MapPin size={16} /><span>{tutor.area}</span></div>
                    <div className="flex items-center gap-2"><IndianRupee size={16} /><span>{tutor.pricing}/month</span></div>
                    <div className="flex items-center gap-2"><span className="font-medium">Experience:</span><span>{tutor.experience}</span></div>
                </div>
                {tutor.bio && <p className="text-gray-600 mb-6 leading-relaxed">{tutor.bio}</p>}
                <a href={`tel:${tutor.userId?.phone}`}
                    className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium">
                    <Phone size={18} /> Call Now
                </a>
            </div>
        </div>
    );
}
