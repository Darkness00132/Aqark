import { customAlphabet } from 'nanoid';

const alphabet =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function customeNanoId(size: number) {
  return customAlphabet(alphabet, size)();
}

export default customeNanoId;
