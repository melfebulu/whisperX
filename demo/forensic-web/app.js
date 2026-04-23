const app = {
  cases: [
    {
      id: "CASE-2026-001",
      name: "廉政调查模拟案A",
      officer: "officer_001",
      status: "待人工复核",
      evidence: null,
      segments: [
        { id: "seg_001", speaker: "Speaker A", start: 12.3, end: 18.44, text: "我是在三月见到他的。", tags: ["低置信", "日期"] },
        { id: "seg_002", speaker: "Speaker B", start: 19.11, end: 24.18, text: "金额大概是三十万。", tags: ["金额", "需复核"] },
      ],
      edits: [],
      audit: [
        { t: now(), actor: "system", type: "case_created", detail: "案件已创建" },
      ],
    },
  ],
  activeCaseId: "CASE-2026-001",
  activeSegmentId: "seg_001",
};

function now() {
  return new Date().toLocaleString("zh-CN", { hour12: false });
}

function currentCase() {
  return app.cases.find((c) => c.id === app.activeCaseId);
}

function initNav() {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      showView(btn.dataset.view);
    });
  });
}

function showView(key) {
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  document.getElementById(`view-${key}`).classList.add("active");
  renderAll();
}

function renderAll() {
  renderGlobal();
  renderCases();
  renderDetail();
  renderReview();
  renderAudit();
}

function renderGlobal() {
  const c = currentCase();
  document.getElementById("globalCaseId").textContent = c.id;
  document.getElementById("globalCaseStatus").textContent = c.status;
  document.getElementById("globalExportStatus").textContent = c.status === "证据包已导出" ? "已导出" : "未导出";
}

function renderCases() {
  const body = document.getElementById("caseTableBody");
  const query = document.getElementById("caseSearch").value?.trim() || "";
  const status = document.getElementById("caseStatusFilter").value;
  const rows = app.cases.filter((c) => {
    const qOk = !query || [c.id, c.name, c.officer].join(" ").includes(query);
    const sOk = status === "all" || c.status === status;
    return qOk && sOk;
  });

  body.innerHTML = rows
    .map(
      (c) => `<tr>
      <td>${c.id}</td>
      <td>${c.name}</td>
      <td>${c.officer}</td>
      <td>${c.evidence ? 1 : 0}</td>
      <td>${c.status}</td>
      <td><button data-open="${c.id}">进入案件</button></td>
    </tr>`
    )
    .join("");

  body.querySelectorAll("button[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      app.activeCaseId = btn.dataset.open;
      showView("detail");
      document.querySelector('[data-view="detail"]').click();
    });
  });

  document.getElementById("kpiPending").textContent = app.cases.filter((c) => c.status === "待人工复核").length;
  document.getElementById("kpiRisk").textContent = app.cases.reduce((sum, c) => sum + c.segments.filter((s) => s.tags.includes("低置信")).length, 0);
  document.getElementById("kpiToConfirm").textContent = app.cases.filter((c) => c.status === "已形成确认稿").length;
  document.getElementById("kpiExported").textContent = app.cases.filter((c) => c.status === "证据包已导出").length;
  renderCaseStatusViz();
}

function renderDetail() {
  const c = currentCase();
  document.getElementById("detailCaseName").textContent = `${c.id} ${c.name}`;
  document.getElementById("detailOfficer").textContent = c.officer;
  document.getElementById("detailStatus").textContent = c.status;

  const stepper = document.getElementById("processStepper");
  const steps = ["原始证据已固化", "自动转写完成", "待人工复核", "已形成确认稿"];
  const idx = Math.max(0, steps.indexOf(c.status));
  stepper.innerHTML = steps.map((s, i) => `<div class="step ${i <= idx ? "done" : ""}">${s}</div>`).join("");

  const events = c.audit.slice(-6).reverse();
  document.getElementById("recentEvents").innerHTML = events
    .map((e) => `<li><b>${e.t}</b> ${e.actor} ${e.type} - ${e.detail}</li>`)
    .join("");

  const panel = document.getElementById("evidencePanel");
  if (!c.evidence) {
    panel.classList.add("hidden");
  } else {
    panel.classList.remove("hidden");
    document.getElementById("evidenceName").textContent = c.evidence.name;
    document.getElementById("evidenceDuration").textContent = c.evidence.duration;
    document.getElementById("evidenceHash").textContent = c.evidence.sha256;
    document.getElementById("audioPlayer").src = c.evidence.url;
  }
}

function renderReview() {
  const c = currentCase();
  const audio = document.getElementById("reviewAudio");
  if (c.evidence) audio.src = c.evidence.url;

  const list = document.getElementById("segmentList");
  list.innerHTML = c.segments
    .map((s) => {
      const badges = s.tags
        .map((t) => `<span class="badge ${t.includes("低") || t.includes("复核") ? "risk" : "warn"}">${t}</span>`)
        .join("");
      return `<div class="segment ${s.id === app.activeSegmentId ? "active" : ""}" data-seg="${s.id}">
        <b>${s.speaker}</b> ${fmt(s.start)} - ${fmt(s.end)}
        <div>${s.text}</div>
        <div class="badges">${badges}</div>
      </div>`;
    })
    .join("");

  list.querySelectorAll(".segment").forEach((el) => {
    el.addEventListener("click", () => {
      app.activeSegmentId = el.dataset.seg;
      const seg = c.segments.find((s) => s.id === app.activeSegmentId);
      audio.currentTime = seg.start;
      audio.play().catch(() => {});
      renderReview();
    });
  });

  const seg = c.segments.find((s) => s.id === app.activeSegmentId) || c.segments[0];
  if (!seg) return;
  document.getElementById("currentSegmentId").textContent = seg.id;
  document.getElementById("originText").value = seg.text;
  if (!document.getElementById("editText").dataset.touched) {
    document.getElementById("editText").value = seg.text;
  }
  document.getElementById("diffPreview").textContent = buildDiff(seg.text, document.getElementById("editText").value);
  drawTimeline(c, audio.currentTime || seg.start);
}

function renderAudit() {
  const c = currentCase();
  document.getElementById("auditList").innerHTML = c.audit
    .slice()
    .reverse()
    .map((e) => `<li><b>${e.t}</b> [${e.type}] ${e.actor} - ${e.detail}</li>`)
    .join("");
}

function fmt(v) {
  const m = Math.floor(v / 60);
  const s = Math.floor(v % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function buildDiff(before, after) {
  if (before === after) return "（无差异）";
  return `- ${before}\n+ ${after}`;
}

function renderCaseStatusViz() {
  const total = app.cases.length || 1;
  const pending = app.cases.filter((c) => c.status === "待人工复核").length;
  const confirmed = app.cases.filter((c) => c.status === "已形成确认稿").length;
  const exported = app.cases.filter((c) => c.status === "证据包已导出").length;
  const items = [
    { key: "pending", label: "待复核", value: pending },
    { key: "confirmed", label: "已确认", value: confirmed },
    { key: "exported", label: "已导出", value: exported },
  ];
  document.getElementById("caseStatusViz").innerHTML = items
    .map((i) => {
      const pct = Math.round((i.value / total) * 100);
      return `<div class="bar-row"><span>${i.label}</span><div class="bar ${i.key}"><span style="width:${pct}%"></span></div><b>${i.value}</b></div>`;
    })
    .join("");
}

function drawTimeline(c, currentTime = 0) {
  const canvas = document.getElementById("timelineCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const total = Math.max(...c.segments.map((s) => s.end), 1);

  ctx.fillStyle = "#111827";
  ctx.fillRect(0, 0, w, h);

  c.segments.forEach((s) => {
    const x = (s.start / total) * w;
    const segW = Math.max(2, ((s.end - s.start) / total) * w);
    const isRisk = s.tags.some((t) => t.includes("低") || t.includes("复核"));
    ctx.fillStyle = isRisk ? "#dc2626" : "#1d4ed8";
    ctx.fillRect(x, 24, segW, 60);
    if (s.id === app.activeSegmentId) {
      ctx.strokeStyle = "#f8fafc";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, 24, segW, 60);
    }
  });

  const playX = (currentTime / total) * w;
  ctx.strokeStyle = "#f8fafc";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(playX, 15);
  ctx.lineTo(playX, h - 12);
  ctx.stroke();

  ctx.fillStyle = "#e5e7eb";
  ctx.font = "12px sans-serif";
  ctx.fillText(`00:00`, 8, h - 4);
  ctx.fillText(fmt(total), w - 48, h - 4);
}

function jumpRisk(direction) {
  const c = currentCase();
  const risks = c.segments.filter((s) => s.tags.some((t) => t.includes("低") || t.includes("复核")));
  if (!risks.length) return;
  const idx = risks.findIndex((s) => s.id === app.activeSegmentId);
  const nextIdx = direction > 0 ? (idx + 1 + risks.length) % risks.length : (idx - 1 + risks.length) % risks.length;
  app.activeSegmentId = risks[nextIdx].id;
  const audio = document.getElementById("reviewAudio");
  audio.currentTime = risks[nextIdx].start;
  audio.play().catch(() => {});
  renderReview();
}

async function handleAudioUpload(file) {
  const c = currentCase();
  const sha256 = await hashFile(file);
  const url = URL.createObjectURL(file);
  const duration = await getDuration(url);

  c.evidence = {
    name: file.name,
    duration: `${duration.toFixed(1)} 秒`,
    sha256,
    url,
  };

  c.status = "自动转写完成";
  c.audit.push({ t: now(), actor: c.officer, type: "audio_uploaded", detail: `上传 ${file.name}` });
  c.audit.push({ t: now(), actor: "system", type: "hash_generated", detail: `SHA-256 ${sha256.slice(0, 12)}...` });
  c.audit.push({ t: now(), actor: "system", type: "transcription_completed", detail: "机器初稿生成完成" });
  c.status = "待人工复核";

  renderAll();
}

async function hashFile(file) {
  const buf = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getDuration(url) {
  return new Promise((resolve) => {
    const a = document.createElement("audio");
    a.src = url;
    a.onloadedmetadata = () => resolve(a.duration || 0);
  });
}

function bindEvents() {
  document.getElementById("caseSearch").addEventListener("input", renderCases);
  document.getElementById("caseStatusFilter").addEventListener("change", renderCases);

  document.getElementById("createCaseBtn").addEventListener("click", () => {
    const id = `CASE-2026-${String(app.cases.length + 1).padStart(3, "0")}`;
    app.cases.push({
      id,
      name: `演示案件 ${app.cases.length + 1}`,
      officer: "officer_demo",
      status: "待人工复核",
      evidence: null,
      segments: [{ id: "seg_001", speaker: "Speaker A", start: 4, end: 9, text: "请陈述你当时看到的情况。", tags: ["需复核"] }],
      edits: [],
      audit: [{ t: now(), actor: "system", type: "case_created", detail: "案件已创建" }],
    });
    renderAll();
  });

  document.getElementById("audioInput").addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (file) handleAudioUpload(file);
  });

  const editText = document.getElementById("editText");
  editText.addEventListener("input", () => {
    editText.dataset.touched = "1";
    const c = currentCase();
    const seg = c.segments.find((s) => s.id === app.activeSegmentId);
    document.getElementById("diffPreview").textContent = buildDiff(seg.text, editText.value);
  });

  document.getElementById("riskPrevBtn").addEventListener("click", () => jumpRisk(-1));
  document.getElementById("riskNextBtn").addEventListener("click", () => jumpRisk(1));
  document.getElementById("reviewAudio").addEventListener("timeupdate", (e) => {
    drawTimeline(currentCase(), e.target.currentTime || 0);
  });
  document.getElementById("timelineCanvas").addEventListener("click", (e) => {
    const c = currentCase();
    const rect = e.target.getBoundingClientRect();
    const clickRatio = (e.clientX - rect.left) / rect.width;
    const total = Math.max(...c.segments.map((s) => s.end), 1);
    const t = clickRatio * total;
    const seg = c.segments.find((s) => t >= s.start && t <= s.end);
    if (!seg) return;
    app.activeSegmentId = seg.id;
    const audio = document.getElementById("reviewAudio");
    audio.currentTime = seg.start;
    audio.play().catch(() => {});
    renderReview();
  });

  document.getElementById("saveEditBtn").addEventListener("click", () => {
    const c = currentCase();
    const seg = c.segments.find((s) => s.id === app.activeSegmentId);
    const reason = document.getElementById("editReason").value;
    const edited = document.getElementById("editText").value;
    if (!reason) return alert("请选择修改原因");
    if (edited === seg.text) return alert("未检测到文本修改");

    c.edits.push({ segmentId: seg.id, before: seg.text, after: edited, reason, at: now() });
    c.audit.push({ t: now(), actor: c.officer, type: "transcript_edited", detail: `${seg.id}: ${reason}` });
    seg.text = edited;
    c.status = "已形成确认稿";

    const tip = document.getElementById("editToast");
    tip.classList.remove("hidden");
    setTimeout(() => tip.classList.add("hidden"), 1400);

    document.getElementById("editText").dataset.touched = "";
    renderAll();
  });

  document.getElementById("exportJsonBtn").addEventListener("click", () => {
    const c = currentCase();
    const payload = {
      case_id: c.id,
      status: c.status,
      evidence: c.evidence,
      segments: c.segments,
      edits: c.edits,
      audit: c.audit,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${c.id}_evidence_bundle.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById("markExportBtn").addEventListener("click", () => {
    const c = currentCase();
    c.status = "证据包已导出";
    c.audit.push({ t: now(), actor: c.officer, type: "evidence_exported", detail: "证据包导出并校验" });
    document.getElementById("exportTip").textContent = "证据包生成成功，校验摘要已写入。";
    renderAll();
  });
}

initNav();
bindEvents();
renderAll();
