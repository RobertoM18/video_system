require("dotenv").config();
const app = require("./app");
const config = require("./config/server");
const db = require("./config/db");

const PORT = config.port || 3000;

async function testConnection() {
  try {
    const result = await db.one("SELECT 1 AS connected");
    return { success: true, message: "Database connected successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

app.listen(PORT, () => {
  testConnection().then((result) => {
    if (result.success) {
      console.log(result.message);
    } else {
      console.error("Database connection error:", result.message);
    }
  });
  console.log(`Server running on port ${PORT}`);
});
