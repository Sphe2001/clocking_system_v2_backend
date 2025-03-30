const sequelize = require("./src/helpers/dbConfig");
const {
  Admin,
  Student,
  Supervisor,
  Role,
  Attendance,
  SupervisorAttendance,
} = require("./src/models");

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("✅ Database synced successfully!");
  })
  .catch((err) => {
    console.error("❌ Error syncing database!", err);
  });
