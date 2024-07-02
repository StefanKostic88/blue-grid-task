import { IncomingMessage, ServerResponse } from "http";
import { getAllFiles } from "../controlers/fileControler";

class RouuteService {
  public static instance: RouuteService;

  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new RouuteService();
    }
    return this.instance;
  }

  public async getAllFilesRoutes(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & {
      req: IncomingMessage;
    }
  ) {
    const { url, method } = req;

    if (url === "/api/files" && method !== "GET") {
      return this.generateResponse(
        405,
        `Method ${method} not allowed for ${url}`,
        res
      );
    }

    if (url !== "/api/files") {
      return this.generateResponse(404, `Unsupported route ${url}`, res);
    }

    await getAllFiles(req, res);
  }

  private generateResponse(
    statusCode: number,
    message: string,
    res: ServerResponse<IncomingMessage> & {
      req: IncomingMessage;
    }
  ): void {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: statusCode, message, body: null }));
  }
}

const routeServiceInstance = RouuteService.getInstance();

export default routeServiceInstance;
