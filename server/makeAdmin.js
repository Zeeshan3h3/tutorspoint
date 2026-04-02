import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = process.argv[2];

        if (!email) {
            console.log('❌ Please provide an email address. Usage: node makeAdmin.js <email>');
            process.exit(1);
        }

        const user = await User.findOneAndUpdate(
            { email },
            { role: 'admin' },
            { new: true }
        );

        if (user) {
            console.log(`✅ Success! ${user.name} (${user.email}) is now an ADMIN.`);
            console.log('👉 Please logout and login again in the browser to refresh your permissions.');
        } else {
            console.log(`❌ User with email ${email} not found.`);
        }
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

makeAdmin();
