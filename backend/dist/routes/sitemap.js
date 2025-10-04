import { Router } from "express";
import { createGzip } from "zlib";
import asyncHandler from "../utils/asyncHnadler.js";
import Ad from "../models/ad.model.js";
const router = Router();
router.get("/sitemap.xml", asyncHandler(async (req, res) => {
    res.header("Content-Type", "application/xml");
    res.header("Content-Encoding", "gzip");
    const ads = await Ad.findAll({ attributes: ["slug"] });
    const smStream = new SitemapStream({
        hostname: "https://aqark.vercel.app",
    });
    const pipeline = smStream.pipe(createGzip());
    smStream.write({ url: "/", changefreq: "daily", priority: 1.0 });
    smStream.write({ url: "/ads", changefreq: "daily", priority: 0.9 });
    smStream.write({ url: "/about", changefreq: "monthly", priority: 0.7 });
    smStream.write({ url: "/contact", changefreq: "monthly", priority: 0.7 });
    ads.forEach((ad) => {
        smStream.write({
            url: `/ads/${ad.slug}`,
            changefreq: "weekly",
            priority: 0.8,
        });
    });
    smStream.end();
    const xml = await streamToPromise(pipeline);
    res.send(xml.toString());
}));
export default router;
//# sourceMappingURL=sitemap.js.map