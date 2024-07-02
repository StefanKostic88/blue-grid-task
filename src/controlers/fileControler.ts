import { IncomingMessage, ServerResponse } from "http";
import transformServiceInsatnce from "../services/transform.service";

export const getAllFiles = async (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage> & {
    req: IncomingMessage;
  }
) => {
  try {
    const finalData = await (await transformServiceInsatnce.transformData())
      .getData()
      .getFinalData();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(finalData);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: 500,
        message: "Internal Server Error",
        body: null,
      })
    );
  }
};
