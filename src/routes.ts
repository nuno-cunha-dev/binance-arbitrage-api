import { Elysia } from "elysia";
import healthController from "./controllers/healthController";
import arbitrageController from "./controllers/arbitrageController";

const routes = new Elysia();

routes.get('/health', healthController.check);
routes.get('/arbitrage', arbitrageController.profitable);

export default routes;