import { resolve } from "path";
import { fileURLToPath } from "url";

const root = fileURLToPath(new URL(".", import.meta.url));

const pages = new Set([
  "/diensten",
  "/over-ons",
  "/prijzen",
  "/werkgebied",
  "/reviews",
  "/contact",
  "/faq",
  "/privacy",
]);

function splitUrl(url = "/") {
  const [path, query] = url.split("?");
  return {
    path: path.replace(/\/$/, "") || "/",
    query: query ? `?${query}` : "",
  };
}

function cleanHtmlUrls() {
  return {
    name: "clean-html-urls",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const { path, query } = splitUrl(req.url);
        if (path === "/index.html") {
          res.statusCode = 301;
          res.setHeader("Location", `/${query}`);
          res.end();
          return;
        }
        if (path.endsWith(".html") && pages.has(path.slice(0, -5))) {
          res.statusCode = 301;
          res.setHeader("Location", `${path.slice(0, -5)}${query}`);
          res.end();
          return;
        }
        if (pages.has(path)) {
          req.url = `${path}.html${query}`;
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const { path, query } = splitUrl(req.url);
        if (path === "/index.html") {
          res.statusCode = 301;
          res.setHeader("Location", `/${query}`);
          res.end();
          return;
        }
        if (path.endsWith(".html") && pages.has(path.slice(0, -5))) {
          res.statusCode = 301;
          res.setHeader("Location", `${path.slice(0, -5)}${query}`);
          res.end();
          return;
        }
        if (pages.has(path)) {
          req.url = `${path}.html${query}`;
        }
        next();
      });
    },
  };
}

export default {
  plugins: [cleanHtmlUrls()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: [".monkeycode-ai.live"],
  },
  preview: {
    host: true,
    port: 5173,
    allowedHosts: [".monkeycode-ai.live"],
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        diensten: resolve(root, "diensten.html"),
        overOns: resolve(root, "over-ons.html"),
        prijzen: resolve(root, "prijzen.html"),
        werkgebied: resolve(root, "werkgebied.html"),
        reviews: resolve(root, "reviews.html"),
        contact: resolve(root, "contact.html"),
        faq: resolve(root, "faq.html"),
        privacy: resolve(root, "privacy.html"),
      },
    },
  },
};
