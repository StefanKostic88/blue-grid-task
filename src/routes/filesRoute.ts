import { IncomingMessage, ServerResponse } from "http";

import routeServiceInstance from "../services/routeService";

export const fileRoutes = async (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage> & {
    req: IncomingMessage;
  }
) => {
  await routeServiceInstance.getAllFilesRoutes(req, res);
};
