// ==========================================
// METROOPS CONTROL ROOM OPERATOR CONSOLE
// Frontend prototype using simulated data
// ==========================================

// TRAIN DATA
const trains = [
  {
    id: "T-104",
    location: "City Station",
    destination: "Central",
    speed: 42,
    status: "Normal"
  },
  {
    id: "T-108",
    location: "Airport Station",
    destination: "Central",
    speed: 0,
    status: "Fault"
  },
  {
    id: "T-112",
    location: "Market Station",
    destination: "South",
    speed: 18,
    status: "Delayed"
  },
  {
    id: "T-115",
    location: "North Station",
    destination: "Airport",
    speed: 45,
    status: "Normal"
  }
];

// FAULT ALERTS
const alerts = [
  {
    id: "ALT-108",
    trainId: "T-108",
    title: "Signal Fault Detected",
    location: "Airport Station",
    severity: "Critical",
    acknowledged: false,
    resolved: false
  },
  {
    id: "ALT-112",
    trainId: "T-112",
    title: "Train Delay Detected",
    location: "Market Station",
    severity: "Warning",
    acknowledged: false,
    resolved: false
  }
];

// PASSENGER INCIDENTS
let incidents = [
  {
    id: "INC-001",
    title: "Medical Assistance",
    type: "Medical emergency",
    location: "City Station",
    severity: "Medium",
    assistance: "",
    passenger: "",
    description: "Passenger assistance requested",
    status: "Open",
    createdAt: new Date(),
    dispatched: false
  }
];

let resolvedToday = 0;
let toastTimer;

// ELEMENT SELECTOR
const $ = id => document.getElementById(id);

// HTML ESCAPE
const esc = s =>
  String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));

// TOAST MESSAGE
function toast(msg) {
  $("toast").textContent = msg;
  $("toast").classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    $("toast").classList.remove("show");
  }, 2700);
}

// LIVE CLOCK
function clock() {
  $("clock").textContent = new Date().toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }
  );
}

// ==========================================
// TRAIN MONITORING
// ==========================================

function trainTable() {

  return trains.map(t => `
    <tr>
      <td><b>${t.id}</b></td>

      <td>${t.location}</td>

      <td>${t.destination}</td>

      <td id="speed-${t.id}">
        ${t.speed} km/h
      </td>

      <td>
        <span
          id="status-${t.id}"
          class="chip ${t.status.toLowerCase()}">
          ${t.status}
        </span>
      </td>

      <td>
        <button class="mini" data-view="${t.id}">
          View
        </button>

        ${
          t.status === "Fault"
            ? `<button class="mini" data-fix="${t.id}">
                Resolve
               </button>`
            : ""
        }
      </td>
    </tr>
  `).join("");
}

// RENDER TRAIN TABLES
function renderTrains() {
  $("monitorTrainRows").innerHTML = trainTable();
}

// ==========================================
// FAULT ALERT MANAGEMENT
// ==========================================

function renderAlerts() {

  const active = alerts.filter(a => !a.resolved);

  const html = active.length

    ? active.map(a => `
      <div class="alert-item">

        <div class="alert-icon ${
          a.severity === "Critical" ? "critical" : ""
        }">
          !
        </div>

        <div>

          <h4>${a.title}</h4>

          <p>
            Train ${a.trainId} · ${a.location}
          </p>

          <p>
            ${a.severity} ·
            ${a.acknowledged
              ? "Acknowledged"
              : "Requires attention"}
          </p>

          <div class="actions">

            ${
              !a.acknowledged
                ? `<button class="mini" data-ack="${a.id}">
                    Acknowledge
                   </button>`
                : `<span class="chip ack">
                    Acknowledged
                   </span>`
            }

            ${
              trains.find(t => t.id === a.trainId)?.status === "Fault"
                ? `<button class="mini" data-fix="${a.trainId}">
                    Resolve fault
                   </button>`
                : ""
            }

          </div>

        </div>

      </div>
    `).join("")

    : '<p class="empty">✓ All operational alerts have been resolved.</p>';

  $("allAlertList").innerHTML = html;

  if ($("alertCount")) {
    $("alertCount").textContent = active.length + " ACTIVE";
  }

  $("allAlertCount").textContent = active.length + " ACTIVE";

  $("navFaultCount").textContent = active.length;
}

// ACKNOWLEDGE ALERT
function acknowledge(id) {

  const a = alerts.find(x => x.id === id);

  if (!a || a.resolved) return;

  a.acknowledged = true;

  toast(
    "Alert acknowledged. The fault remains active until resolved."
  );

  update();
}

// RESOLVE TRAIN FAULT
function resolveTrain(id) {

  const t = trains.find(x => x.id === id);

  if (!t) return;

  t.status = "Normal";
  t.speed = 35;

  const a = alerts.find(
    x => x.trainId === id && !x.resolved
  );

  if (a) {
    a.resolved = true;
    a.acknowledged = true;
  }

  toast(id + " fault resolved. Status updated to Normal.");

  update();
}

// REFRESH
function refresh() {

  update();

  toast("Train monitoring data refreshed.");
}

// ==========================================
// PASSENGER INCIDENT MANAGEMENT
// ==========================================

// OPEN INCIDENT FORM
function openModal() {

  $("incidentModal").classList.add("open");

  $("incidentModal").setAttribute("aria-hidden", "false");

  $("incidentLocation").focus();
}

// CLOSE INCIDENT FORM
function closeModal() {

  $("incidentModal").classList.remove("open");

  $("incidentModal").setAttribute("aria-hidden", "true");

  $("incidentForm").reset();
}

// CREATE NEW INCIDENT
function createIncident(e) {

  e.preventDefault();

  const station = $("incidentLocation").value;
  const type = $("incidentType").value;
  const severity = $("incidentSeverity").value;
  const assistance = $("incidentAssistance").value;
  const description = $("incidentDescription").value.trim();

  if (
    !station ||
    !type ||
    !severity ||
    !assistance ||
    !description
  ) {
    toast("Complete all required fields.");
    return;
  }

  incidents.push({

    id: "INC-" + String(Date.now()).slice(-6),

    title:
      type === "Medical emergency"
        ? "Medical Assistance"
        : type,

    type: type,
    location: station,
    severity: severity,
    assistance: assistance,
    passenger: $("passengerName").value.trim(),
    description: description,
    status: "Open",
    createdAt: new Date(),
    dispatched: false

  });

  closeModal();

  update();

  location.hash = "incidents";

  toast("New passenger incident created.");
}

// RENDER INCIDENT REGISTER
function renderIncidents() {

  const active = incidents.filter(
    i => i.status !== "Resolved"
  );

  const dispatched = incidents.filter(
    i => i.dispatched && i.status !== "Resolved"
  ).length;

  $("incidentList").innerHTML = incidents.length

    ? incidents.slice().reverse().map(i => `

      <article class="incident-card">

        <div class="incident-top">

          <div class="incident-left">

            <div class="incident-icon">✚</div>

            <div>
              <h4>${esc(i.title)}</h4>

              <p>
                ${esc(i.location)} ·
                ${esc(i.description)}
              </p>

              <p>
                ${i.id} ·
                ${i.createdAt.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </p>
            </div>

          </div>

          <span class="chip ${
            i.status === "Resolved"
              ? "normal"
              : i.status === "Open" && i.severity === "Critical"
                ? "fault"
                : i.status === "Open"
                  ? "delayed"
                  : "ack"
          }">
            ${esc(i.status)}
          </span>

        </div>

        <div class="incident-meta">
          <span>Severity: ${esc(i.severity)}</span>
          <span>Type: ${esc(i.type)}</span>
          <span>Assistance: ${esc(i.assistance || "Not selected")}</span>

          ${
            i.passenger
              ? `<span>Passenger: ${esc(i.passenger)}</span>`
              : ""
          }
        </div>

        ${
          i.status !== "Resolved" && !i.dispatched
            ? `
              <label class="assistance-picker">
                Select medical assistance

                <select data-assistance="${esc(i.id)}">
                  <option value="">Choose assistance</option>

                  <option value="First Aid Team" ${i.assistance === "First Aid Team" ? "selected" : ""}>
                    First Aid Team
                  </option>

                  <option value="Ambulance" ${i.assistance === "Ambulance" ? "selected" : ""}>
                    Ambulance
                  </option>

                  <option value="Medical Doctor" ${i.assistance === "Medical Doctor" ? "selected" : ""}>
                    Medical Doctor
                  </option>

                  <option value="Emergency Response Team" ${i.assistance === "Emergency Response Team" ? "selected" : ""}>
                    Emergency Response Team
                  </option>
                </select>
              </label>
            `
            : ""
        }

        ${
          i.dispatched && i.status !== "Resolved"
            ? `<p class="dispatch-note">
                ✓ ${esc(i.assistance)} dispatch recorded (simulated)
               </p>`
            : ""
        }

        <div class="actions">

          ${
            i.status !== "Resolved" && !i.dispatched
              ? `<button class="mini" data-dispatch="${esc(i.id)}" ${!i.assistance ? "disabled" : ""}>
                  Dispatch Assistance
                 </button>`
              : ""
          }

          ${
            i.status === "Dispatched"
              ? `<button class="mini" data-progress="${esc(i.id)}">
                  Mark In Progress
                 </button>`
              : ""
          }

          ${
            i.status !== "Resolved"
              ? `<button class="mini" data-resolve-incident="${esc(i.id)}">
                  Mark Resolved
                 </button>`
              : `<span class="chip normal">✓ Closed</span>`
          }

        </div>

      </article>

    `).join("")

    : '<p class="empty">No passenger incidents have been reported.</p>';

  $("activeIncidentCount").textContent = active.length;
  $("incidentActiveSummary").textContent = active.length;
  $("incidentDispatchSummary").textContent = dispatched;
  $("incidentResolvedSummary").textContent = resolvedToday;
  $("incidentPanelCount").textContent = active.length + " ACTIVE";
  $("navIncidentCount").textContent = active.length;
}

// SAVE THE SELECTED ASSISTANCE FOR AN INCIDENT
document.addEventListener("change", e => {

  const select = e.target.closest("[data-assistance]");

  if (!select) return;

  const incident = incidents.find(
    i => i.id === select.dataset.assistance
  );

  if (!incident || incident.status === "Resolved" || incident.dispatched) {
    return;
  }

  incident.assistance = select.value;

  renderIncidents();

  if (incident.assistance) {
    toast(incident.assistance + " selected.");
  }
});

// DISPATCH ASSISTANCE
function dispatch(id) {

  const i = incidents.find(x => x.id === id);

  if (!i || i.status === "Resolved" || i.dispatched) return;

  if (!i.assistance) {
    toast("Select an assistance team before dispatching.");
    return;
  }

  i.dispatched = true;
  i.status = "Dispatched";

  update();

  toast(i.assistance + " dispatch recorded successfully (simulated).");
}

// MARK INCIDENT IN PROGRESS
function progress(id) {

  const i = incidents.find(x => x.id === id);

  if (!i || !i.dispatched) return;

  i.status = "In Progress";

  update();

  toast("Incident marked In Progress.");
}

// RESOLVE INCIDENT
function resolveIncident(id) {

  const i = incidents.find(x => x.id === id);

  if (!i || i.status === "Resolved") return;

  i.status = "Resolved";

  resolvedToday++;

  update();

  toast("Incident marked as resolved.");
}

// ==========================================
// NETWORK MAP
// ==========================================

function updateMap() {

  trains
    .filter(t =>
      ["T-104", "T-108", "T-112"].includes(t.id)
    )
    .forEach(t => {

      const marker = $("marker-" + t.id);

      if (marker) {

        marker.setAttribute(
          "class",
          "train-marker " +
          t.status.toLowerCase() +
          "-marker"
        );

      }

    });
}

// ==========================================
// DASHBOARD UPDATE
// ==========================================

function update() {

  const issues = trains.filter(
    t => t.status === "Fault" || t.status === "Delayed"
  ).length;

  $("activeTrainCount").textContent = "24";

  $("normalCount").textContent = 24 - issues;

  $("activeIssueCount").textContent = issues;

  $("networkTitle").textContent = issues
    ? "Operational Issues Detected"
    : "All Systems Operational";

  $("networkMessage").textContent = issues
    ? issues + " active train issue(s) require operator attention."
    : "Metro network monitoring is active. All monitored trains are normal.";

  renderTrains();
  renderAlerts();
  renderIncidents();
  updateMap();
}

// ==========================================
// NAVIGATION
// ==========================================

function nav() {

  let page = location.hash.slice(1) || "overview";

  if (!document.getElementById(page)) {
    page = "overview";
  }

  // Keep every dashboard section visible on the page.
  document.querySelectorAll(".page").forEach(section => {
    section.style.display = "block";
  });

  // Highlight the selected sidebar item.
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle("active", link.dataset.page === page);
  });

  const names = {
    overview: "Dashboard",
    monitoring: "Train Monitoring",
    alerts: "Fault Alerts",
    incidents: "Passenger Incidents",
    shift: "Shift Management"
  };

  $("crumb").textContent = names[page] || "Dashboard";
  $("sidebar").classList.remove("open");
}

// ==========================================
// BUTTON EVENT HANDLERS
// ==========================================

document.addEventListener("click", e => {

  const ack = e.target.closest("[data-ack]");
  const fix = e.target.closest("[data-fix]");
  const view = e.target.closest("[data-view]");
  const dis = e.target.closest("[data-dispatch]");
  const prog = e.target.closest("[data-progress]");
  const res = e.target.closest("[data-resolve-incident]");

  if (ack) {
    acknowledge(ack.dataset.ack);
  }

  if (fix) {
    resolveTrain(fix.dataset.fix);
  }

  if (view) {

    const t = trains.find(
      x => x.id === view.dataset.view
    );

    if (t) {
      toast(
        `${t.id}: ${t.location} → ${t.destination}, ${t.speed} km/h, ${t.status}`
      );
    }
  }

  if (dis) {
    dispatch(dis.dataset.dispatch);
  }

  if (prog) {
    progress(prog.dataset.progress);
  }

  if (res) {
    resolveIncident(res.dataset.resolveIncident);
  }
});

// ==========================================
// INITIALIZE APPLICATION
// ==========================================

$("reportIncidentBtn").addEventListener(
  "click",
  openModal
);

$("closeIncidentModal").addEventListener(
  "click",
  closeModal
);

$("cancelIncident").addEventListener(
  "click",
  closeModal
);

$("incidentForm").addEventListener(
  "submit",
  createIncident
);

// Optional button: safely check whether it exists.
const overviewRefreshButton = $("overviewRefresh");

if (overviewRefreshButton) {
  overviewRefreshButton.addEventListener("click", refresh);
}

$("refreshTrains").addEventListener(
  "click",
  refresh
);

$("menuToggle").addEventListener(
  "click",
  () => $("sidebar").classList.toggle("open")
);

$("incidentModal").addEventListener("click", e => {

  if (e.target === $("incidentModal")) {
    closeModal();
  }

});

document.addEventListener("keydown", e => {

  if (e.key === "Escape") {
    closeModal();
  }

});

window.addEventListener("hashchange", nav);

// START CLOCK
clock();

setInterval(clock, 1000);

// INITIAL DASHBOARD RENDER
update();

nav();