// import dotenv from "dotenv";
// import { connectDB } from "./db/index.js";
// import { app } from "./app.js";
//
// dotenv.config({
//   path: "./env",
// });
//
// connectDB()
//   .then(
//     app.listen(process.env.PORT || 8000, () => {
//       console.log(`Server listening on port: ${process.env.PORT || 8000}`);
//     })
//   )
//   .catch((err) => {
//     console.log("MONGODB connection error:", err);
//   });
//

import http from "http";
import httpProxy from "http-proxy";

const proxy = httpProxy.createProxyServer({ selfHandleResponse: true });

const server = http.createServer((req, res) => {
  proxy.web(req, res, {
    target:
      "https://x.convai.com/stream-v2/6eda50ce-2bcf-11f0-ad25-42010a7be01f/",
    changeOrigin: true,
  });
});

proxy.on("proxyRes", (proxyRes, req, res) => {
  let body = [];

  proxyRes.on("data", (chunk) => {
    body.push(chunk);
  });

  proxyRes.on("end", () => {
    const responseBody = Buffer.concat(body);

    // Log headers before modification
    console.log("Original headers:", proxyRes.headers);

    // Clean up headers
    const headers = { ...proxyRes.headers };
    delete headers["x-frame-options"];
    delete headers["content-security-policy"];
    delete headers["content-security-policy-report-only"];

    res.writeHead(proxyRes.statusCode, headers);
    res.end(responseBody);
  });
});

server.listen(3000, () => {
  console.log("Proxy server running on http://localhost:3000");
});
