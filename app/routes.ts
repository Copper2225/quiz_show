import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("home", "routes/home.tsx"),
  route("user", "routes/User/user.tsx"),
  route("login", "routes/User/login.tsx"),
  route("edit", "routes/Edit/edit.tsx"),
  route("edit/:c/:q", "routes/Edit/edit.question.tsx"),
  route("sse/events", "routes/Events/sse.events.ts"),
  route("sse/events/admin", "routes/Events/sse.events.admin.ts"),
  route("admin", "routes/Admin/admin.tsx"),
  route("show", "routes/Show/show.tsx"),
  route("api/team-names", "routes/Api/team-names.ts"),
  route("api/question", "routes/Api/question.ts"),
  route("api/answer", "routes/Api/answer.ts"),
  route("api/buzzer", "routes/Api/buzzer.ts"),
] satisfies RouteConfig;
