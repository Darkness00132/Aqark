import { SESClient } from '@aws-sdk/client-ses';

const sesClient = new SESClient({
  credentials: {
    accessKeyId: process.env.AWS_KEY!,
    secretAccessKey: process.env.AWS_SECRET!,
  },
  region: process.env.AWS_REGION!,
});

export default sesClient;
