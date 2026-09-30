import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Book, CheckCircle } from 'lucide-react';

const SemesterRegistration = ({ user }) => {
    const [semesters, setSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/student/semesters');
                setSemesters(res.data);
            } catch (err) {
                console.error("Error fetching semesters", err);
            } finally {
                setFetching(false);
            }
        };
        fetchSemesters();
    }, []);

    const handleSemesterChange = async (e) => {
        const semId = e.target.value;
        if (!semId) {
            setSelectedSemester(null);
            setSubjects([]);
            return;
        }

        const sem = semesters.find(s => s.id === parseInt(semId));
        setSelectedSemester(sem);

        try {
            const res = await axios.get(`http://localhost:5000/api/student/semesters/${semId}/subjects`);
            setSubjects(res.data);
            // Default to all subjects selected for demo
            setSelectedSubjects(res.data.map(s => s.id));
        } catch (err) {
            console.error("Error fetching subjects", err);
        }
    };

    const handleSubjectToggle = (id) => {
        if (selectedSubjects.includes(id)) {
            setSelectedSubjects(selectedSubjects.filter(subId => subId !== id));
        } else {
            setSelectedSubjects([...selectedSubjects, id]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSemester) {
            setStatusMessage('Please select a semester.');
            return;
        }

        setLoading(true);
        setStatusMessage('');

        try {
            await axios.post('http://localhost:5000/api/student/register-semester', {
                student_register_number: user.register_number,
                semester_id: selectedSemester.id,
                subject_ids: selectedSubjects
            });
            setStatusMessage('Semester registration submitted successfully!');
            setSelectedSemester(null);
            setSubjects([]);
        } catch (err) {
            setStatusMessage(err.response?.data?.message || 'Failed to submit registration.');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div>Loading registration details...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-college-blue">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <Book className="mr-3 text-college-blue" /> Higher Semester Registration
            </h2>

            {statusMessage && (
                <div className={`p-3 mb-4 rounded ${statusMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {statusMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Semester for Registration</label>
                    <select
                        className="block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-college-blue focus:border-college-blue"
                        onChange={handleSemesterChange}
                        defaultValue=""
                    >
                        <option value="" disabled>-- Select Semester --</option>
                        {semesters.map(sem => (
                            <option key={sem.id} value={sem.id}>Semester {sem.semester_number} ({sem.academic_year})</option>
                        ))}
                    </select>
                </div>

                {subjects.length > 0 && (
                    <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                        <h3 className="font-semibold text-lg mb-4 text-gray-800">Available Subjects</h3>
                        <div className="space-y-3">
                            {subjects.map(subject => (
                                <div key={subject.id} className="flex items-center bg-white p-3 border border-gray-200 rounded-md shadow-sm">
                                    <input
                                        type="checkbox"
                                        id={`sub-${subject.id}`}
                                        checked={selectedSubjects.includes(subject.id)}
                                        onChange={() => handleSubjectToggle(subject.id)}
                                        className="h-5 w-5 text-college-blue focus:ring-college-blue border-gray-300 rounded"
                                    />
                                    <label htmlFor={`sub-${subject.id}`} className="ml-3 flex-1 flex justify-between cursor-pointer">
                                        <span className="font-medium text-gray-700">{subject.subject_code} - {subject.subject_name}</span>
                                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{subject.credits} Credits</span>
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
                            <span className="text-gray-600">Total Credits Selected:</span>
                            <span className="font-bold text-lg">
                                {subjects.filter(s => selectedSubjects.includes(s.id)).reduce((acc, curr) => acc + curr.credits, 0)}
                            </span>
                        </div>
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading || !selectedSemester || selectedSubjects.length === 0}
                        className="flex items-center py-2 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-college-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-college-blue disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Submitting...' : <><CheckCircle className="mr-2" size={20} /> Submit Registration</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SemesterRegistration;
