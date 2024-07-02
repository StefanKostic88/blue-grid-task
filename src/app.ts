import http, { Server, IncomingMessage, ServerResponse } from "http";
import { fileRoutes } from "./routes/filesRoute";
import { Socket } from "net";

abstract class CoreApp {
  protected server?: Server<typeof IncomingMessage, typeof ServerResponse>;
  protected port: number = 8080;
  protected connections: Socket[] = [];

  constructor() {
    this.handleShutDown();
    this.init();
  }

  protected init(): void {}
  public startServer(): void {}
  public listen(): void {}
  public close(): void {}

  private handleShutDown() {
    process.on("SIGTERM", () => {
      console.log("SIGTERM signal received");
      this.close();
    });
    process.on("SIGINT", () => {
      console.log("SIGINT signal received");
      this.close();
    });
  }
}

export class App extends CoreApp {
  public static instance: App;

  constructor() {
    super();
  }

  public static getInstance(): App {
    if (!this.instance) {
      this.instance = new App();
    }
    return this.instance;
  }

  protected init(): void {
    this.server = http.createServer(async (req, res) => {
      res.setHeader("Content-Type", "application/json");
      await fileRoutes(req, res);
    });
  }

  public startServer(): void {
    this.server?.listen(this.port, () => {
      console.log(
        `Server Running on port ${this.port}, on process id: ${process.pid}`
      );
    });

    this.server?.on("connection", (curConnection) => {
      this.connections.push(curConnection);

      curConnection.on("close", () => {
        this.connections = this.connections.filter(
          (conncetion) => conncetion !== curConnection
        );
      });
    });
  }

  public close(): void {
    console.log("Shutting down gracefully...");

    this.server?.close(() => {
      console.log("Closed out remaining connections");

      process.exit(0);
    });

    setTimeout(() => {
      console.error(
        "Could not close connections in time, forcefully shutting down"
      );
      process.exit(1);
    }, 20000);

    this.connections.forEach((connection) => connection.end());

    setTimeout(() => {
      this.connections.forEach((connection) => connection.destroy());
    }, 10000);
  }
}
