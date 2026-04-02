import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, Lock, CheckCircle, Info } from 'lucide-react';

export default function EditProfile() {
    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Assuming standard authorization header is set in your axios interceptor
                const res = await axios.get('/api/tutor/profile');
                const data = res.data;
                setTutor(data);
                setFormData({
                    area: data.area || '',
                    bio: data.bio || '',
                    experience: data.experience || '',
                    expectedFeesMin: data.expectedFeesMin || '',
                    expectedFeesMax: data.expectedFeesMax || '',
                    teachingMode: data.teachingMode || '',
                    college: data.college || '',
                    subjects: data.subjects?.join(', ') || '',
                    classesHandled: data.classesHandled?.join(', ') || ''
                });
            } catch (err) {
                setError('Failed to load profile. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        // Format array fields before sending
        const payload = {
            ...formData,
            subjects: formData.subjects.split(',').map(s => s.trim()).filter(Boolean),
            classesHandled: formData.classesHandled.split(',').map(s => s.trim()).filter(Boolean)
        };

        try {
            const res = await axios.patch('/api/tutor/profile', payload);
            setSuccess(res.data.message || 'Profile updated successfully!');
            setTutor(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading profile editor...</div>;
    if (!tutor) return <div className="p-8 text-center text-red-500">Profile not found.</div>;

    // Calculate 10-day strict lock window
    const msSinceCreation = Date.now() - new Date(tutor.createdAt).getTime();
    const tenDaysMs = 10 * 24 * 60 * 60 * 1000;
    const isCriticalLocked = msSinceCreation < tenDaysMs;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Manage Profile</h1>

            {/* Phase 3: Penalty Banner */}
            {tutor.status === 'PENDING' && (
                <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded shadow-sm flex items-start gap-3">
                    <AlertTriangle className="text-amber-500 w-6 h-6 shrink-0" />
                    <div>
                        <h3 className="font-semibold text-amber-800">Profile Under Review</h3>
                        <p className="text-amber-700 text-sm mt-1">
                            Your profile is temporarily restricted from unlocking new leads because you recently changed critical fields. Our team will verify the changes shortly.
                        </p>
                    </div>
                </div>
            )}

            {/* Profile Completeness Tracker */}
            <div className="mb-8 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-slate-800">Profile Strength</h3>
                    <p className="text-sm text-slate-500">
                        {tutor.completenessScore < 100
                            ? "Add a video and complete your bio to reach 100%. Complete profiles get 3x more parent messages!"
                            : "Excellent! Your profile is fully optimized."}
                    </p>
                </div>
                <div className="text-2xl font-black text-blue-600">{tutor.completenessScore}%</div>
            </div>

            {error && <div className="mb-4 text-red-600 bg-red-50 p-3 rounded">{error}</div>}
            {success && <div className="mb-4 text-emerald-600 bg-emerald-50 p-3 rounded">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">

                {/* PERMANENTLY LOCKED FIELDS */}
                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-slate-400" /> Basic Info (Non-Editable)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                            <input type="text" disabled value={tutor.userId?.name || ''} className="w-full p-2 border rounded bg-slate-100 text-slate-500 cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Degree / Course</label>
                            <input type="text" disabled value={tutor.degree || ''} className="w-full p-2 border rounded bg-slate-100 text-slate-500 cursor-not-allowed" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Contact support if there is a typo in your permanent details.</p>
                </section>

                {/* CRITICAL FIELDS (10-Day Lock) */}
                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
                        {isCriticalLocked ? <Lock className="w-4 h-4 text-amber-500" /> : <Info className="w-4 h-4 text-blue-500" />}
                        Academic & Location Details
                    </h2>
                    {isCriticalLocked && (
                        <p className="text-xs text-amber-600 mb-4 bg-amber-50 p-2 rounded">
                            🔒 Critical fields are locked for 10 days after signup to prevent fraud. They will unlock in {Math.ceil((tenDaysMs - msSinceCreation) / (1000 * 60 * 60 * 24))} days.
                        </p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">College Name</label>
                            <input type="text" name="college" disabled={isCriticalLocked} value={formData.college} onChange={handleChange} className={`w-full p-2 border rounded ${isCriticalLocked ? 'bg-slate-100 cursor-not-allowed text-slate-500' : 'bg-white'}`} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Teaching Area (e.g., Jadavpur)</label>
                            <input type="text" name="area" disabled={isCriticalLocked} value={formData.area} onChange={handleChange} className={`w-full p-2 border rounded ${isCriticalLocked ? 'bg-slate-100 cursor-not-allowed text-slate-500' : 'bg-white'}`} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-600 mb-1">Subjects (Comma Separated)</label>
                            <input type="text" name="subjects" disabled={isCriticalLocked} value={formData.subjects} onChange={handleChange} placeholder="Math, Physics, English" className={`w-full p-2 border rounded ${isCriticalLocked ? 'bg-slate-100 cursor-not-allowed text-slate-500' : 'bg-white'}`} />
                        </div>
                    </div>
                </section>

                {/* SAFE FIELDS (Always Editable) */}
                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" /> Teaching Preferences
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Teaching Mode</label>
                            <select name="teachingMode" value={formData.teachingMode} onChange={handleChange} className="w-full p-2 border rounded bg-white">
                                <option value="Home Tuition">Home Tuition</option>
                                <option value="Online">Online</option>
                                <option value="Both">Both</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Experience (Years)</label>
                            <input type="number" name="experience" value={formData.experience} onChange={handleChange} className="w-full p-2 border rounded bg-white" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-600 mb-1">Short Bio</label>
                            <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" placeholder="Tell parents why they should hire you..." className="w-full p-2 border rounded bg-white"></textarea>
                        </div>
                    </div>
                </section>

                <div className="pt-4 border-t flex justify-end">
                    <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 disabled:opacity-50">
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}