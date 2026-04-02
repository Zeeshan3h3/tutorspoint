import multer from 'multer';
import path from 'path';
import fs from 'fs';

const dirs = ['uploads/profiles', 'uploads/proofs', 'uploads/videos'];

// Ensure dirs exist
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
    destination(req, file, cb) {
        if (file.mimetype.startsWith('video/')) return cb(null, 'uploads/videos');
        if (req.originalUrl.includes('/proof')) return cb(null, 'uploads/proofs');
        cb(null, 'uploads/profiles');
    },
    filename(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${req.user._id}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
        const filetypes = /mp4|webm|mov/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        return extname ? cb(null, true) : cb(new Error('Only MP4, WEBM, MOV allowed!'));
    }

    const filetypes = /jpg|jpeg|png|webp|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    return extname ? cb(null, true) : cb(new Error('Only Images or PDFs allowed!'));
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 30 * 1024 * 1024 } // 30MB limit for videos and proofs
});
