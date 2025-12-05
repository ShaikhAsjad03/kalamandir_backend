const fs = require("fs");
const path = require("path");
const Menu = require("../models/menu.model");
const ProductSchema = require("../models/product.model");
const BASE_URL = process.env.FRONT_BASE_URL?.endsWith("/")
    ? process.env.FRONT_BASE_URL
    : `${process.env.FRONT_BASE_URL || process.env.URL}/`;

const sitemapController = {
    async sitemap(req, res,) {
        try {
            await sitemapController.generateSitemap();
            return res.status(200).json({
                isSuccess: true,
                message: "Sitemap generated successfully",
            });
        } catch (error) {
            return res.status(400).json({
                isSuccess: false,
                message: "Something went wrong",
            });
        }
    },

    async generateSitemap() {
        try {
            const menus = await Menu.find({ isActive: true }).sort({ sortOrder: 1 });
            const product = await ProductSchema.find({ isActive: true })
            const categoryMenus = menus.filter((m) => m.categoryId);
            const brandMenus = menus.filter((m) => m.brandId);
            const normalMenus = menus.filter((m) => !m.categoryId && !m.brandId);
            let urls = new Set();
            normalMenus.forEach((menu) => {
                if (!menu.menuURL) return;
                const menuUrl =
                    menu.menuURL.toLowerCase() === "home" ? BASE_URL : `${BASE_URL}${menu.menuURL}`;
                urls.add(menuUrl);
            })

            categoryMenus.forEach((menu) => {
                const categoryUrl = `${BASE_URL}${menu.menuURL}`;
                urls.add(categoryUrl);
            });

            brandMenus.forEach((menu) => {
                const brandUrl = `${BASE_URL}${menu.menuURL}`;
                urls.add(brandUrl);
            });

            product.forEach((item) => {
                const ProductUrl = `${BASE_URL}productdetail/${item.productCode}`;
                urls.add(ProductUrl);
            });



            const xmlContent = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          ${[...urls]
                    .map(
                        (url) => `
              <url>
                <loc>${url}</loc>
                <changefreq>weekly</changefreq>
                <priority>0.8</priority>
              </url>`
                    )
                    .join("")}
        </urlset>
      `;

            const outputFile = path.resolve(__dirname, "../../kalamandir-Jewellers-Frontend/sitemap.xml");
            fs.writeFileSync(outputFile, xmlContent.trim());
        } catch (error) {
            console.error("❌ Sitemap generation failed:", error);
        }
    },
};







module.exports = sitemapController;
