import { config } from "./config";
import { createApp } from "./app";

const app = createApp();

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});

