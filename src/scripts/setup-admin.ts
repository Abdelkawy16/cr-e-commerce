import { createAdminUser } from '../firebase/auth';

// Replace these with your desired admin credentials
const ADMIN_EMAIL = 'admin@anaka-online.com';
const ADMIN_PASSWORD = 'Admin@123456'; // Make sure to use a strong password

export const setupAdmin = async () => {
  try {
    await createAdminUser(ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('Admin user created successfully!');
    console.log('Email:', ADMIN_EMAIL);
    console.log('Password:', ADMIN_PASSWORD);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

setupAdmin(); 