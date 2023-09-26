import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors'
import routes from "./routes";
import config from "./config";

const app = new Elysia();
app.use(cors());
app.use(routes);
app.listen({
  port: config.port,
  hostname: '0.0.0.0'
});

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);