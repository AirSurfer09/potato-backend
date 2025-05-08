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
  const incomingUrl = new URL(req.url || "", `http://${req.headers.host}`);
  const searchParams = new URLSearchParams(incomingUrl.search);
  const sessionId = searchParams.get("sessionid");

  console.log("Incoming URL:", req.url);
  console.log("Parsed sessionId:", sessionId);
  console.log("Session ID", searchParams.get("sessionId"));
  // Build the full target URL
  const target = `https://x.convai.com/stream-v2/2713ca2a-2bd6-11f0-ad25-42010a7be01f/`;
  proxy.web(req, res, {
    target: target,
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
