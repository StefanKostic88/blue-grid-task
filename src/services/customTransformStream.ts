import { Transform, TransformCallback } from "stream";
import { NestedObject, FinalResult } from "../types/customTransformTypes";

export class CustomTransFormStream extends Transform {
  private result: FinalResult = {};

  constructor() {
    super({ objectMode: true });
  }

  _transform(
    chunk: any,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    const url = chunk.fileUrl.split("/").slice(2) as string[];
    const [ipAdressWithPort, ...urlPath] = url;
    const ipAdress = ipAdressWithPort.split(":")[0];

    let currentObject = this.result[ipAdress] || [];

    urlPath
      .filter((el) => el !== "")
      .reduce((acc: any, el, index) => {
        if (index === urlPath.length - 1) {
          acc.push(el);
        } else {
          let obj: NestedObject = acc?.find((item: NestedObject) => {
            if (item) {
              return typeof item === "object" && item[el];
            }
          });

          if (!obj) {
            obj = {};
            acc.push(obj);
          }
          obj[el] = obj[el] || [];
          acc = obj[el];
        }
        return acc;
      }, currentObject);

    this.result[ipAdress] = currentObject;
    callback();
  }
  _flush(callback: TransformCallback): void {
    const data = {
      status: 200,
      message: "success",
      body: this.result,
    };
    this.push(JSON.stringify(data, null, 4));
    callback();
  }
}
