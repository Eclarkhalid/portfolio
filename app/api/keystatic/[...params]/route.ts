import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../keystatic.config";

const handlers = makeRouteHandler({ config });
const unavailable = () => new Response("Not Found", { status: 404 });

export const GET: typeof handlers.GET = (...args) =>
  process.env.NODE_ENV === "production" ? unavailable() : handlers.GET(...args);

export const POST: typeof handlers.POST = (...args) =>
  process.env.NODE_ENV === "production" ? unavailable() : handlers.POST(...args);
