import Tutor from '../models/Tutor.js';

export const getPendingTutors = async (req, res) => {
    try {
        const tutors = await Tutor.find({ isApproved: false }).populate('userId', 'name email phone');
        res.json(tutors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const approveTutor = async (req, res) => {
    try {
        const tutor = await Tutor.findById(req.params.id);
        if (!tutor) {
            return res.status(404).json({ message: 'Tutor not found' });
        }

        tutor.isApproved = true;
        await tutor.save();

        res.json({ message: 'Tutor approved successfully', tutor });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
