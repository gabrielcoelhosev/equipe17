import { app } from "./app.js";
import { env } from "./env/index.js";

const port = env.PORT;

app.listen({ port, host: "0.0.0.0" }).then(() => {
    console.log(`Server is running on port ${port}`);
});
