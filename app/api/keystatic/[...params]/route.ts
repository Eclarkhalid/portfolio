import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../keystatic.config";

const handlers = makeRouteHandler({ config });
const unavailable = () => new Response("Not Found", { status: 404 });

export const GET: typeof handlers.GET = async (...args) =>
  process.env.NODE_ENV === "production"
    ? unavailable()
    : await handlers.GET(...args);

export const POST: typeof handlers.POST = async (...args) =>
  process.env.NODE_ENV === "production"
    ? unavailable()
    : await handlers.POST(...args);
