import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import seedDevUsers from "./src/utils/seedDevUsers.js";

const PORT = Number(process.env.PORT) || 5001;

console.log("[Server] Starting TeamTask API...");
console.log("[Server] Port:", PORT);
console.log("[Server] Node Environment:", process.env.NODE_ENV || "development");

connectDB()
  .then(async () => {
    console.log("[Server] Database connected, seeding users...");
    await seedDevUsers();
    console.log("[Server] Database seeding complete");
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[Server] TeamTask API running on port ${PORT}`);
      console.log(`[Server] API URL: http://localhost:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.error("[Server] Startup error:", error);
    process.exit(1);
  });
