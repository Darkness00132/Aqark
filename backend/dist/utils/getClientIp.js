export function getClientIP(req) {
    return (req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
        req.socket.remoteAddress ||
        req.ip ||
        "unknown");
}
//# sourceMappingURL=getClientIp.js.map