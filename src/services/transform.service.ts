import { Readable, pipeline } from "stream";
import { DataResponse, Item } from "../types/responseType";
import { CustomTransFormStream } from "./customTransformStream";

export class TransformService {
  public static instance: TransformService;
  public result = "";

  private customTransFormStream?: CustomTransFormStream;
  private apiEndpoint = "https://rest-test-eight.vercel.app/api/test";
  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new TransformService();
    }
    return this.instance;
  }

  public async transformData(): Promise<TransformService> {
    const rawDataConvertedToStream = Readable.from(await this.getRawData());
    this.customTransFormStream = new CustomTransFormStream();

    try {
      pipeline(rawDataConvertedToStream, this.customTransFormStream, (err) => {
        if (err) {
          console.log(err);
        }
      });

      return this;
    } catch (error) {
      throw error;
    }
  }

  public getData(): TransformService {
    this.customTransFormStream?.on("data", (data: string) => {
      this.result += data;
    });

    return this;
  }

  public getFinalData(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.customTransFormStream?.on("end", () => {
        resolve(this.result);
      });
      this.customTransFormStream?.on("error", (err) => {
        reject(err);
      });
    });
  }

  private async getRawData(): Promise<Item[]> {
    const response = await fetch(this.apiEndpoint);
    const { items } = (await response.json()) as DataResponse;
    return items;
  }
}

const transformServiceInsatnce = TransformService.getInstance();

export default transformServiceInsatnce;
