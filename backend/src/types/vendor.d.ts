/* Provides narrow ambient declarations for local compilation. */

declare module "dotenv" {
  export interface DotenvConfigOutput {
    parsed?: Record<string, string>;
    error?: Error;
  }

  export function config(): DotenvConfigOutput;

  const dotenv: {
    config: typeof config;
  };

  export default dotenv;
}

declare module "ioredis" {
  export default class IORedis {
    constructor(options: {
      host: string;
      port: number;
      maxRetriesPerRequest: null;
      enableReadyCheck: boolean;
    });
    on(event: "connect", listener: () => void): this;
    on(event: "error", listener: (error: Error) => void): this;
  }
}

declare module "bullmq" {
  interface JobRemovePolicy {
    count: number;
  }

  interface JobBackoff {
    type: "exponential";
    delay: number;
  }

  interface QueueDefaultJobOptions {
    attempts: number;
    backoff: JobBackoff;
    removeOnComplete: JobRemovePolicy;
    removeOnFail: JobRemovePolicy;
  }

  interface QueueOptions {
    connection: unknown;
    defaultJobOptions?: QueueDefaultJobOptions;
  }

  interface JobOptions {
    jobId?: string;
  }

  export interface Job<DataType> {
    id?: string | number;
    data: DataType;
  }

  export class Queue<DataType> {
    constructor(name: string, options: QueueOptions);
    add(name: string, data: DataType, options?: JobOptions): Promise<Job<DataType>>;
  }

  interface WorkerOptions {
    connection: unknown;
    concurrency?: number;
  }

  type JobHandler<DataType> = (job: Job<DataType>) => Promise<void>;

  export class Worker<DataType> {
    constructor(name: string, processor: JobHandler<DataType>, options: WorkerOptions);
    on(event: "completed", listener: (job: Job<DataType>) => void): this;
    on(
      event: "failed",
      listener: (job: Job<DataType> | undefined, error: Error) => void
    ): this;
  }
}

declare module "express" {
  export interface Request<
    Params = Record<string, string>,
    ResBody = unknown,
    ReqBody = unknown
  > {
    params: Params;
    body: ReqBody;
  }

  export interface Response {
    status(code: number): Response;
    json(body: unknown): Response;
  }

  export type RequestHandler<
    Params = Record<string, string>,
    ResBody = unknown,
    ReqBody = unknown
  > = (
    req: Request<Params, ResBody, ReqBody>,
    res: Response
  ) => void | Promise<void>;

  export interface Router {
    post<Params = Record<string, string>, ResBody = unknown, ReqBody = unknown>(
      path: string,
      handler: RequestHandler<Params, ResBody, ReqBody>
    ): Router;
    get<Params = Record<string, string>, ResBody = unknown, ReqBody = unknown>(
      path: string,
      handler: RequestHandler<Params, ResBody, ReqBody>
    ): Router;
  }

  interface ExpressInstance {
    use(pathOrHandler: string | RequestHandler, handler?: Router | RequestHandler): void;
    listen(port: number, callback?: () => void): void;
  }

  interface ExpressStatic {
    (): ExpressInstance;
    json(): RequestHandler;
  }

  export function Router(): Router;

  const express: ExpressStatic;

  export default express;
}
