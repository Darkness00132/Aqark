import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    secureBody: any;
    secureQuery: any;
    secureParams: any;
  }
}
