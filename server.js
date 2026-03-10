const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3002;

const eventsFile = path.join(__dirname, "data", "events.json");

app.use(express.json());
app.use(express.static(__dirname));

function readEvents() {
  return JSON.parse(fs.readFileSync(eventsFile, "utf8"));
}

function writeEvents(data) {
  fs.writeFileSync(eventsFile, JSON.stringify(data, null, 2));
}

function summarize(events) {
  const totals = events.reduce(
    (acc, row) => {
      acc.signups += row.signups;
      acc.sales += row.sales;
      acc.revenue += row.revenue;
      return acc;
    },
    { signups: 0, sales: 0, revenue: 0 }
  );

  const conversion = totals.signups ? (totals.sales / totals.signups) * 100 : 0;
  return {
    totals,
    conversionRate: Number(conversion.toFixed(2)),
    points: events
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "analytics-dashboard" });
});

app.get("/api/metrics", (req, res) => {
  const days = Number(req.query.days || 7);
  const events = readEvents();
  const selected = events.slice(-Math.max(1, Math.min(days, 30)));
  res.json({ success: true, data: summarize(selected) });
});

app.post("/api/events/simulate", (_req, res) => {
  const events = readEvents();
  const latest = events[events.length - 1];
  const nextDate = new Date(latest.date + "T00:00:00Z");
  nextDate.setUTCDate(nextDate.getUTCDate() + 1);

  const newEvent = {
    date: nextDate.toISOString().slice(0, 10),
    signups: Math.floor(Math.random() * 16) + 10,
    sales: Math.floor(Math.random() * 8) + 3,
    revenue: Math.floor(Math.random() * 900) + 400
  };

  events.push(newEvent);
  if (events.length > 30) {
    events.shift();
  }

  writeEvents(events);
  res.status(201).json({ success: true, event: newEvent });
});

app.listen(PORT, () => {
  console.log(`Project3 running at http://localhost:${PORT}`);
});
