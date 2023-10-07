module.exports = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-XSS-Protection", value: "1" },
  { key: "X-Frame-Options", value: "deny" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Download-Options", value: "noopen" },
  { key: "Access-Control-Allow-Credentials", value: "true" },
];
