import Tutor from '../models/Tutor.js';

export const getMyTutorProfile = async (req, res) => {
    try {
        const tutor = await Tutor.findOne({ userId: req.user._id }).populate('userId', 'name email phone');
        if (!tutor) return res.status(404).json({ message: 'Tutor profile not found' });
        res.json(tutor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createTutorProfile = async (req, res) => {
    try {
        const existingTutor = await Tutor.findOne({ userId: req.user._id });
        if (existingTutor) {
            return res.status(400).json({ message: 'Tutor profile already exists' });
        }

        let subjects = req.body.subjects;
        if (typeof subjects === 'string') {
            try { subjects = JSON.parse(subjects); } catch (e) { subjects = [subjects]; }
        }

        const tutorData = { ...req.body, subjects };
        if (req.file) {
            tutorData.profileImage = `/uploads/profiles/${req.file.filename}`;
        }

        const tutor = await Tutor.create({
            userId: req.user._id,
            ...tutorData
        });

        res.status(201).json(tutor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTutors = async (req, res) => {
    try {
        // Return only approved tutors to the public
        const tutors = await Tutor.find({ isApproved: true }).populate('userId', 'name email phone');
        res.json(tutors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTutorById = async (req, res) => {
    try {
        const tutor = await Tutor.findById(req.params.id).populate('userId', 'name email phone');
        if (!tutor) {
            return res.status(404).json({ message: 'Tutor not found' });
        }
        res.json(tutor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTutorProfile = async (req, res) => {
    try {
        const tutor = await Tutor.findOne({ userId: req.user._id });
        if (!tutor) {
            return res.status(404).json({ message: 'Tutor profile not found' });
        }

        let subjects = req.body.subjects || tutor.subjects;
        if (typeof req.body.subjects === 'string') {
            try { subjects = JSON.parse(req.body.subjects); } catch (e) { subjects = [req.body.subjects]; }
        }

        const tutorData = { ...req.body, subjects };
        if (req.file) {
            tutorData.profileImage = `/uploads/profiles/${req.file.filename}`;
        }

        const updatedTutor = await Tutor.findOneAndUpdate(
            { userId: req.user._id },
            { $set: tutorData },
            { new: true }
        );

        res.json(updatedTutor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
