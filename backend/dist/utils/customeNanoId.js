import { customAlphabet } from 'nanoid';
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function customeNanoId(size) {
    return customAlphabet(alphabet, size)();
}
export default customeNanoId;
//# sourceMappingURL=customeNanoId.js.map