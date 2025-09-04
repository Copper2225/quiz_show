import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("home", "routes/home.tsx"),
  route("user", "routes/User/user.tsx"),
  route("login", "routes/User/login.tsx"),
  route("edit", "routes/Edit/edit.tsx"),
  route("edit/:c/:q", "routes/Edit/editQuestion.tsx"),
  route("sse/events", "routes/Events/sse.events.ts"),
  route("admin", "routes/Admin/admin.tsx"),
  route("show", "routes/Show/show.tsx"),
  route("api/team-names", "routes/Api/team-names.ts"),
] satisfies RouteConfig;
