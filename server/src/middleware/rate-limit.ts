import rateLimit from "express-rate-limit";

// Guards against click-spam within a couple of seconds -- e.g. mashing the
// delete/toggle button -- independent of whether the caller is under the
// per-minute cap below.
export const burstLimiter = rateLimit({
  windowMs: 2_000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, slow down." }
});

// Sustained-rate guard. 30/min sits at the low end of the industry range
// for write-style API calls (~10-30/min), which fits here since every
// endpoint in this API does a database write or a full-table read.
export const sustainedLimiter = rateLimit({
  windowMs: 60_000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again in a minute." }
});
