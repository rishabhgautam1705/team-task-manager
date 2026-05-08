import User from "../models/User.js";

const requiredDemoUsers = [
  {
    fullname: "Admin",
    name: "Admin",
    username: "admin",
    email: "admin@teamtask.com",
    password: "Admin@123",
    role: "ADMIN",
    department: "Management",
  },
  {
    fullname: "Member",
    name: "Member",
    username: "member",
    email: "member@teamtask.com",
    password: "Member@123",
    role: "MEMBER",
    department: "Product",
  },
];

const seedDevUsers = async () => {
  console.log("[Seed] Starting to seed demo users...");
  // Always seed required demo accounts so the app works out-of-the-box.
  // If you later want strict environment gating, do it behind a flag.
  for (const userData of requiredDemoUsers) {
    try {
      const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
      if (!existingUser) {
        console.log("[Seed] Creating user:", userData.email);
        const createdUser = await User.create({
          name: userData.name,
          username: userData.username,
          email: userData.email.toLowerCase(),
          password: userData.password,
          role: userData.role,
          department: userData.department,
        });
        console.log("[Seed] User created successfully:", createdUser._id, createdUser.email);
      } else {
        console.log("[Seed] User already exists:", userData.email);
      }
    } catch (error) {
      console.error("[Seed] Error creating user:", userData.email, error.message);
    }
  }
  console.log("[Seed] Seeding complete!");
};

export default seedDevUsers;

