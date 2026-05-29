import { app } from "./app.js";
import { env } from "./env/index.js";

const port = env.PORT;

app.listen({ port: port }).then(() => {
    console.log(`Server is running on port ${port}`);
});