import {
  type RouteConfig,
  route,
  index,
  prefix,
} from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("user", "routes/user/user.tsx"),
  route("login", "routes/user/login.tsx"),
  route("logout", "routes/user/logout.tsx"),
  route("edit", "routes/edit/edit.tsx"),
  route("edit/:c/:q", "routes/edit/edit.question.tsx"),
  route("sse/events", "routes/events/sse.events.ts"),
  route("sse/events/admin", "routes/events/sse.events.admin.ts"),
  route("admin", "routes/admin/admin.tsx"),
  route("show", "routes/show/show.tsx"),
  ...prefix("/api", [
    route("teams", "routes/api/teams.ts"),
    route("question", "routes/api/question.ts"),
    route("answer", "routes/api/answer.ts"),
    route("lockAnswers", "routes/api/lockAnswers.ts"),
    route("upload", "routes/api/fileUpload.ts"),
    route("clearAnswers", "routes/api/clearAnswers.ts"),
    route("reveal", "routes/api/reveal.ts"),
    route("userReveal", "routes/api/userReveal.ts"),
    route("userBlock", "routes/api/userBlock.ts"),
    route("delete", "routes/api/delete.ts"),
  ]),
] satisfies RouteConfig;
