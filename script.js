const daysSelect = document.getElementById("daysSelect");
const simulateBtn = document.getElementById("simulateBtn");
const statusText = document.getElementById("status");
const metricsTable = document.getElementById("metricsTable");
const chart = document.getElementById("revenueChart");
const ctx = chart.getContext("2d");

function setStatus(message, isError = false) {
  statusText.textContent = message;
  statusText.classList.toggle("error", isError);
}

function renderKpis(data) {
  document.getElementById("kpiSignups").textContent = data.totals.signups;
  document.getElementById("kpiSales").textContent = data.totals.sales;
  document.getElementById("kpiRevenue").textContent = `$${data.totals.revenue}`;
  document.getElementById("kpiConversion").textContent = `${data.conversionRate}%`;
}

function renderTable(points) {
  metricsTable.innerHTML = "";
  points.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${row.date}</td><td>${row.signups}</td><td>${row.sales}</td><td>$${row.revenue}</td>`;
    metricsTable.appendChild(tr);
  });
}

function renderChart(points) {
  const width = chart.width;
  const height = chart.height;
  const padding = 36;

  ctx.clearRect(0, 0, width, height);

  if (!points.length) {
    return;
  }

  const maxRevenue = Math.max(...points.map((p) => p.revenue));
  const stepX = (width - padding * 2) / Math.max(1, points.length - 1);

  ctx.strokeStyle = "#c6d2ff";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();

  ctx.strokeStyle = "#2056f8";
  ctx.lineWidth = 3;
  ctx.beginPath();

  points.forEach((point, index) => {
    const x = padding + index * stepX;
    const y = height - padding - (point.revenue / maxRevenue) * (height - padding * 2);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.stroke();

  ctx.fillStyle = "#2056f8";
  points.forEach((point, index) => {
    const x = padding + index * stepX;
    const y = height - padding - (point.revenue / maxRevenue) * (height - padding * 2);
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

async function loadMetrics() {
  setStatus("Loading metrics...");

  try {
    const response = await fetch(`/api/metrics?days=${daysSelect.value}`);
    const body = await response.json();

    if (!response.ok) {
      setStatus(body.error || "Unable to load metrics.", true);
      return;
    }

    renderKpis(body.data);
    renderTable(body.data.points);
    renderChart(body.data.points);
    setStatus(`Showing ${body.data.points.length} day(s) of data.`);
  } catch (error) {
    setStatus("Server connection failed.", true);
  }
}

simulateBtn.addEventListener("click", async () => {
  simulateBtn.disabled = true;
  try {
    const response = await fetch("/api/events/simulate", { method: "POST" });
    if (!response.ok) {
      setStatus("Simulation failed.", true);
      return;
    }
    await loadMetrics();
  } catch (error) {
    setStatus("Simulation failed.", true);
  } finally {
    simulateBtn.disabled = false;
  }
});

daysSelect.addEventListener("change", loadMetrics);
loadMetrics();
