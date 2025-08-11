import app from "./app";
import { connectPostgres } from "./config/postgres.connection";

(async () => {
  await connectPostgres();
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
})();
