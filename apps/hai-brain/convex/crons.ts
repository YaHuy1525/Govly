import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Hourly rollup of daily stats for dashboard speed.
crons.cron("daily-stats-rollup", "0 * * * *", internal.stats.rollup);

export default crons;
