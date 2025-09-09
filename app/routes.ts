import {
  type RouteConfig,
  route,
  index,
  prefix,
} from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("home", "routes/home.tsx"),
  route("user", "routes/user/user.tsx"),
  route("login", "routes/user/login.tsx"),
  route("edit", "routes/edit/edit.tsx"),
  route("edit/:c/:q", "routes/edit/edit.question.tsx"),
  route("sse/events", "routes/events/sse.events.ts"),
  route("sse/events/admin", "routes/events/sse.events.admin.ts"),
  route("admin", "routes/admin/admin.tsx"),
  route("show", "routes/show/show.tsx"),
  ...prefix("/api", [
    route("teamNames", "routes/api/teamNames.ts"),
    route("question", "routes/api/question.ts"),
    route("answer", "routes/api/answer.ts"),
    route("buzzer", "routes/api/buzzer.ts"),
    route("lockAnswers", "routes/api/lockAnswers.ts"),
    route("upload", "routes/api/fileUpload.ts"),
    route("teamPoints", "routes/api/teamPoints.ts"),
  ]),
] satisfies RouteConfig;
