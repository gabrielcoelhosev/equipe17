import type { IncomingMessage, ServerResponse } from "node:http";
import { app } from "../src/app.js";

const ready = app.ready();

export default async function handler(request: IncomingMessage, reply: ServerResponse) {
  await ready;
  app.server.emit("request", request, reply);
}
