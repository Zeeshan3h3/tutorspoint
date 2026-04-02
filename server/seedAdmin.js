import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './src/models/User.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'mdzeeshan08886@gmail.com';
        const password = 'Zeeshan';

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.findOneAndUpdate(
            { email },
            {
                name: 'Super Admin',
                email,
                password: hashedPassword,
                role: 'admin',
                phone: '9088260058'
            },
            { upsert: true, new: true }
        );

        console.log(`✅ Success! Admin seeded: ${user.email}`);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

seedAdmin();
