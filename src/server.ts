import { App } from "./app";

const app = App.getInstance();

app.startServer();

process.on("uncaughtException", (err) => {
  console.log(err);
  process.exit(1);
});
