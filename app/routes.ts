import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/guitar-hero.tsx"),
  //route("guitar-hero", "routes/guitar-hero.tsx"),
] satisfies RouteConfig;
