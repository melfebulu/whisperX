const STAGES = [
  { id: 1, key: "preserved", label: "原始证据已固化", desc: "查看原始文件、哈希详情与保全信息" },
  { id: 2, key: "transcribed", label: "自动转写完成", desc: "查看机器转写日志、分段与任务状态" },
  { id: 3, key: "review", label: "待人工复核", desc: "进行音频与文本联动复核和修订" },
  { id: 4, key: "confirmed", label: "已形成确认稿", desc: "查看确认稿、导出记录与审计摘要" },
];

const SAMPLE_SEGMENTS_A = [
  { id: "seg_001", speaker: "Speaker A", start: 12.3, end: 18.44, text: "我是在三月见到他的。", tags: ["低置信", "日期"] },
  { id: "seg_002", speaker: "Speaker B", start: 19.11, end: 24.18, text: "金额大概是三十万。", tags: ["金额", "需复核"] },
  { id: "seg_003", speaker: "Speaker A", start: 25.02, end: 29.1, text: "不是，是三月十五日。", tags: ["日期"] },
];

const SAMPLE_SEGMENTS_B = [
  { id: "seg_011", speaker: "Speaker A", start: 4.1, end: 9.8, text: "请说明第一次接触对方的时间。", tags: ["需复核"] },
  { id: "seg_012", speaker: "Speaker B", start: 10.0, end: 16.5, text: "大概在二零二五年十一月。", tags: ["日期"] },
  { id: "seg_013", speaker: "Speaker A", start: 17.0, end: 21.8, text: "你是否收过现金？", tags: [] },
];

const SAMPLE_SEGMENTS_C = [
  { id: "seg_021", speaker: "Speaker A", start: 8.0, end: 13.8, text: "这是第三次访谈记录。", tags: [] },
  { id: "seg_022", speaker: "Speaker B", start: 14.0, end: 20.7, text: "我确认这份记录与原始音频一致。", tags: ["确认"] },
];

const DEFAULT_REFERENCE_PROFILES = [
  {
    themes: ["日期核验", "人物接触"],
    insight: "用于核验关键接触时间、会面节点和人物出现顺序。",
  },
  {
    themes: ["金额核验", "资金流向"],
    insight: "用于标记金额、现金交付、转账路径等高风险表述。",
  },
  {
    themes: ["证言冲突", "人物关系"],
    insight: "用于对比口供表述是否存在冲突以及关键人物关联。",
  },
];

const app = {
  cases: seedCases(),
  activeCaseId: "CASE-2026-001",
  activeEvidenceId: "EV-0001",
  activeStageId: 3,
  activeSegmentId: "seg_001",
  showArchived: false,
};

function seedCases() {
  return [
    {
      id: "CASE-2026-001",
      name: "廉政调查模拟案A",
      officer: "officer_001",
      referenceMaterials: [
        buildReferenceMaterial({
          caseId: "CASE-2026-001",
          id: "MAT-0001",
          name: "案件情况分析摘要.pdf",
          uploadedAt: "2026-04-24 08:50:00",
          uploadedBy: "officer_001",
          selectedAsReference: true,
          themes: ["日期核验", "人物接触"],
          insight: "用于核验首次接触时间、会面节点与证言是否一致。",
        }),
        buildReferenceMaterial({
          caseId: "CASE-2026-001",
          id: "MAT-0002",
          name: "资金往来核查要点.docx",
          uploadedAt: "2026-04-24 08:58:00",
          uploadedBy: "officer_001",
          selectedAsReference: true,
          themes: ["金额核验", "资金流向"],
          insight: "用于识别金额、现金交付与资金流向相关的风险提示。",
        }),
        buildReferenceMaterial({
          caseId: "CASE-2026-001",
          id: "MAT-0003",
          name: "证言比对清单.docx",
          uploadedAt: "2026-04-24 09:05:00",
          uploadedBy: "officer_001",
          selectedAsReference: false,
          themes: ["证言冲突", "人物关系"],
          insight: "用于对比不同证言中的人物关系与表述冲突。",
        }),
      ],
      evidences: [
        {
          id: "EV-0001",
          name: "witness_a.wav",
          uploadedAt: "2026-04-24 09:10:00",
          uploadActor: "officer_001",
          sha256: "3f2d8be9c4c4e1b77fc2812f56d4a5cb9309aa3880553fe9a7f8df8391ac8743",
          duration: "12m 32s",
          stage: 3,
          archived: false,
          archivedAt: "",
          url: "",
          transcriptionRuns: 1,
          confirmedAt: "",
          exportedAt: "",
          segments: clone(SAMPLE_SEGMENTS_A),
          edits: [],
          version: 1,
        },
        {
          id: "EV-0002",
          name: "witness_b.wav",
          uploadedAt: "2026-04-24 09:42:00",
          uploadActor: "officer_001",
          sha256: "20ec3d237d43465f7d674ee9c1d1743f0bf6e36cc566909433b61515b2ad9f34",
          duration: "08m 14s",
          stage: 4,
          archived: false,
          archivedAt: "",
          url: "",
          transcriptionRuns: 1,
          confirmedAt: "2026-04-24 10:08:00",
          exportedAt: "",
          segments: clone(SAMPLE_SEGMENTS_B),
          edits: [
            {
              segmentId: "seg_012",
              before: "大概在二零二五年十一月。",
              after: "大概在二零二五年十一月下旬。",
              reason: "回放确认",
              at: "2026-04-24 10:06:00",
            },
          ],
          version: 2,
        },
        {
          id: "EV-0003",
          name: "witness_c.wav",
          uploadedAt: "2026-04-23 16:15:00",
          uploadActor: "officer_001",
          sha256: "8a1a8d56c9352d2bc8e3873e173b284a8c2924db39e6b0ba167014558ab91862",
          duration: "05m 06s",
          stage: 4,
          archived: true,
          archivedAt: "2026-04-24 08:50:00",
          url: "",
          transcriptionRuns: 1,
          confirmedAt: "2026-04-23 17:03:00",
          exportedAt: "2026-04-24 08:33:00",
          segments: clone(SAMPLE_SEGMENTS_C),
          edits: [],
          version: 1,
        },
      ],
      audit: [
        { t: "2026-04-24 09:10:00", actor: "system", type: "case_created", detail: "案件已创建" },
        { t: "2026-04-24 08:50:00", actor: "officer_001", type: "analysis_file_uploaded", detail: "上传案件情况分析摘要.pdf" },
        { t: "2026-04-24 08:50:10", actor: "system", type: "analysis_watermarked", detail: "MAT-0001 已写入水印记录" },
        { t: "2026-04-24 08:50:20", actor: "officer_001", type: "reference_material_selected", detail: "MAT-0001 已纳入本地风险提示参考" },
        { t: "2026-04-24 08:58:00", actor: "officer_001", type: "analysis_file_uploaded", detail: "上传资金往来核查要点.docx" },
        { t: "2026-04-24 08:58:10", actor: "system", type: "analysis_watermarked", detail: "MAT-0002 已写入水印记录" },
        { t: "2026-04-24 08:58:20", actor: "officer_001", type: "reference_material_selected", detail: "MAT-0002 已纳入本地风险提示参考" },
        { t: "2026-04-24 09:10:10", actor: "officer_001", type: "audio_uploaded", evidenceId: "EV-0001", detail: "上传 witness_a.wav" },
        { t: "2026-04-24 09:10:12", actor: "system", type: "hash_generated", evidenceId: "EV-0001", detail: "SHA-256 已写入证据元数据" },
        { t: "2026-04-24 09:11:25", actor: "system", type: "transcription_completed", evidenceId: "EV-0001", detail: "机器初稿生成完成" },
        { t: "2026-04-24 09:11:26", actor: "system", type: "analysis_reference_attached", evidenceId: "EV-0001", detail: "已关联 2 份分析材料用于风险提示" },
        { t: "2026-04-24 09:42:00", actor: "officer_001", type: "audio_uploaded", evidenceId: "EV-0002", detail: "上传 witness_b.wav" },
        { t: "2026-04-24 09:43:10", actor: "system", type: "transcription_completed", evidenceId: "EV-0002", detail: "机器初稿生成完成" },
        { t: "2026-04-24 09:43:11", actor: "system", type: "analysis_reference_attached", evidenceId: "EV-0002", detail: "已关联 2 份分析材料用于风险提示" },
        { t: "2026-04-24 10:06:00", actor: "officer_001", type: "transcript_edited", evidenceId: "EV-0002", segmentId: "seg_012", detail: "seg_012: 回放确认" },
        { t: "2026-04-24 10:08:00", actor: "officer_001", type: "review_confirmed", evidenceId: "EV-0002", detail: "确认稿已形成" },
        { t: "2026-04-24 08:33:00", actor: "officer_001", type: "evidence_exported", evidenceId: "EV-0003", detail: "证据包导出并校验" },
        { t: "2026-04-24 08:50:00", actor: "officer_001", type: "evidence_archived", evidenceId: "EV-0003", detail: "证据已归档" },
      ],
    },
    {
      id: "CASE-2026-002",
      name: "资金往来询问记录",
      officer: "officer_002",
      referenceMaterials: [
        buildReferenceMaterial({
          caseId: "CASE-2026-002",
          id: "MAT-0001",
          name: "账户流水摘要.pdf",
          uploadedAt: "2026-04-23 14:05:00",
          uploadedBy: "officer_002",
          selectedAsReference: true,
          themes: ["金额核验", "资金流向"],
          insight: "用于核验银行流水、金额区间与资金去向。",
        }),
      ],
      evidences: [
        {
          id: "EV-0001",
          name: "finance_room_a.wav",
          uploadedAt: "2026-04-23 14:20:00",
          uploadActor: "officer_002",
          sha256: "69e6786b9d8f492f1f7c9a42c7d6d2b20c7b91a4b1f7e393e9f3b5f98d3182ea",
          duration: "15m 19s",
          stage: 4,
          archived: false,
          archivedAt: "",
          url: "",
          transcriptionRuns: 1,
          confirmedAt: "2026-04-23 15:02:00",
          exportedAt: "2026-04-23 15:20:00",
          segments: clone(SAMPLE_SEGMENTS_C),
          edits: [],
          version: 1,
        },
      ],
      audit: [
        { t: "2026-04-23 14:20:00", actor: "system", type: "case_created", detail: "案件已创建" },
        { t: "2026-04-23 14:05:00", actor: "officer_002", type: "analysis_file_uploaded", detail: "上传账户流水摘要.pdf" },
        { t: "2026-04-23 14:05:10", actor: "system", type: "analysis_watermarked", detail: "MAT-0001 已写入水印记录" },
        { t: "2026-04-23 14:05:20", actor: "officer_002", type: "reference_material_selected", detail: "MAT-0001 已纳入本地风险提示参考" },
        { t: "2026-04-23 15:02:00", actor: "officer_002", type: "review_confirmed", evidenceId: "EV-0001", detail: "确认稿已形成" },
        { t: "2026-04-23 15:20:00", actor: "officer_002", type: "evidence_exported", evidenceId: "EV-0001", detail: "证据包导出并校验" },
      ],
    },
    {
      id: "CASE-2026-003",
      name: "访谈录音演示样例",
      officer: "officer_demo",
      referenceMaterials: [],
      evidences: [
        {
          id: "EV-0001",
          name: "demo_interview.wav",
          uploadedAt: "2026-04-24 11:03:00",
          uploadActor: "officer_demo",
          sha256: "aa9f450d91c6ebd6b7eabdc3416b1947f2fdbb2b3014bf448fd1b4670f9b3c11",
          duration: "06m 42s",
          stage: 2,
          archived: false,
          archivedAt: "",
          url: "",
          transcriptionRuns: 1,
          confirmedAt: "",
          exportedAt: "",
          segments: clone(SAMPLE_SEGMENTS_B),
          edits: [],
          version: 1,
        },
      ],
      audit: [
        { t: "2026-04-24 11:03:00", actor: "system", type: "case_created", detail: "案件已创建" },
        { t: "2026-04-24 11:03:05", actor: "officer_demo", type: "audio_uploaded", evidenceId: "EV-0001", detail: "上传 demo_interview.wav" },
        { t: "2026-04-24 11:03:30", actor: "system", type: "transcription_completed", evidenceId: "EV-0001", detail: "机器初稿生成完成" },
      ],
    },
    {
      id: "CASE-2026-004",
      name: "原始保全演示案",
      officer: "officer_003",
      referenceMaterials: [
        buildReferenceMaterial({
          caseId: "CASE-2026-004",
          id: "MAT-0001",
          name: "案情摘要说明.docx",
          uploadedAt: "2026-04-24 08:10:00",
          uploadedBy: "officer_003",
          selectedAsReference: true,
          themes: ["人物接触", "日期核验"],
          insight: "用于保全阶段记录后续分析所依赖的案情说明材料。",
        }),
      ],
      evidences: [
        {
          id: "EV-0001",
          name: "sealed_source.wav",
          uploadedAt: "2026-04-24 08:15:00",
          uploadActor: "officer_003",
          sha256: "52a5e85f1d87f2af2fa08d41e1c7cbb5ef53a1fe450bcf70b4f4a188fb12608a",
          duration: "03m 12s",
          stage: 1,
          archived: false,
          archivedAt: "",
          url: "",
          transcriptionRuns: 0,
          confirmedAt: "",
          exportedAt: "",
          segments: [],
          edits: [],
          version: 1,
        },
      ],
      audit: [
        { t: "2026-04-24 08:15:00", actor: "system", type: "case_created", detail: "案件已创建" },
        { t: "2026-04-24 08:10:00", actor: "officer_003", type: "analysis_file_uploaded", detail: "上传案情摘要说明.docx" },
        { t: "2026-04-24 08:10:10", actor: "system", type: "analysis_watermarked", detail: "MAT-0001 已写入水印记录" },
        { t: "2026-04-24 08:10:20", actor: "officer_003", type: "reference_material_selected", detail: "MAT-0001 已纳入本地风险提示参考" },
        { t: "2026-04-24 08:15:05", actor: "officer_003", type: "audio_uploaded", evidenceId: "EV-0001", detail: "上传 sealed_source.wav" },
        { t: "2026-04-24 08:15:08", actor: "system", type: "hash_generated", evidenceId: "EV-0001", detail: "SHA-256 已写入证据元数据" },
      ],
    },
  ];
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function buildReferenceMaterial({ caseId, id, name, uploadedAt, uploadedBy, selectedAsReference, themes, insight, url = "" }) {
  return {
    id,
    name,
    fileType: detectFileType(name),
    uploadedAt,
    uploadedBy,
    watermarkId: `WM-${caseId}-${id}`,
    selectedAsReference,
    themes,
    insight,
    url,
  };
}

function now() {
  return new Date().toLocaleString("zh-CN", { hour12: false });
}

function stageLabel(stageId) {
  return STAGES.find((item) => item.id === stageId)?.label || "未开始";
}

function currentCase() {
  return app.cases.find((item) => item.id === app.activeCaseId) || null;
}

function currentEvidence() {
  const c = currentCase();
  if (!c) return null;
  return c.evidences.find((item) => item.id === app.activeEvidenceId) || c.evidences[0] || null;
}

function caseStatus(c) {
  if (!c || !c.evidences.length) return "未上传证据";
  const visible = c.evidences.filter((item) => !item.archived);
  const pool = visible.length ? visible : c.evidences;
  if (pool.some((item) => item.stage === 3)) return "待人工复核";
  if (pool.some((item) => item.stage === 4 && !item.exportedAt)) return "已形成确认稿";
  if (pool.some((item) => item.exportedAt)) return "证据包已导出";
  if (pool.some((item) => item.stage === 2)) return "自动转写完成";
  return "原始证据已固化";
}

function shortHash(hash) {
  return hash ? `${hash.slice(0, 8)}...${hash.slice(-6)}` : "-";
}

function detectFileType(name = "") {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  return ext ? ext.toUpperCase() : "FILE";
}

function selectedReferenceMaterials(c) {
  return c?.referenceMaterials?.filter((item) => item.selectedAsReference) || [];
}

function themeMatchDetail(theme, seg) {
  const text = seg.text || "";
  switch (theme) {
    case "日期核验":
      if (seg.tags.includes("日期") || /年|月|日|上午|下午/.test(text)) {
        return {
          theme,
          rule: "时间节点核验",
          reason: "片段包含明确时间表达，需要与案情分析文件中的关键日期和会面节点进行比对。",
        };
      }
      return null;
    case "人物接触":
      if (/见到|接触|联系|会面|访谈/.test(text)) {
        return {
          theme,
          rule: "接触关系识别",
          reason: "片段出现接触、会面或联系行为，需与案件背景材料中的人物接触链核对。",
        };
      }
      return null;
    case "金额核验":
      if (seg.tags.includes("金额") || /金额|万|元|现金|打款|转账/.test(text)) {
        return {
          theme,
          rule: "金额数值比对",
          reason: "片段包含金额或现金表述，需要结合案件分析材料中的金额区间和金额口径核验。",
        };
      }
      return null;
    case "资金流向":
      if (/现金|转账|收过|汇款|打款/.test(text)) {
        return {
          theme,
          rule: "资金路径匹配",
          reason: "片段涉及现金收受或转账动作，需要对照资金流向分析材料确认路径与对象。",
        };
      }
      return null;
    case "证言冲突":
      if (/不是|确认|一致|矛盾|冲突/.test(text) || seg.tags.includes("低置信")) {
        return {
          theme,
          rule: "证言一致性检查",
          reason: "片段存在否定、确认或低置信表述，系统提示需与既有证言分析材料进行一致性复核。",
        };
      }
      return null;
    case "人物关系":
      if (/对方|他|她|证人|调查员/.test(text)) {
        return {
          theme,
          rule: "人物关联比对",
          reason: "片段涉及人物指代或身份关系，应与案件人物关系分析材料交叉验证。",
        };
      }
      return null;
    default:
      return null;
  }
}

function buildReferenceContext(c, evidence) {
  const selectedMaterials = selectedReferenceMaterials(c);
  const findings = evidence.segments.map((seg) => {
    const hits = [];
    selectedMaterials.forEach((material) => {
      material.themes.forEach((theme) => {
        const detail = themeMatchDetail(theme, seg);
        if (!detail) return;
        hits.push({
          materialId: material.id,
          materialName: material.name,
          watermarkId: material.watermarkId,
          theme: detail.theme,
          rule: detail.rule,
          reason: detail.reason,
        });
      });
    });
    return {
      segmentId: seg.id,
      hits,
      themes: [...new Set(hits.map((item) => item.theme))],
    };
  });

  const materialStats = selectedMaterials.map((material) => ({
    materialId: material.id,
    materialName: material.name,
    hitSegments: findings.filter((item) => item.hits.some((hit) => hit.materialId === material.id)).length,
    rules: [...new Set(findings.flatMap((item) => item.hits.filter((hit) => hit.materialId === material.id).map((hit) => hit.rule)))],
  }));
  return {
    selectedMaterials,
    findings,
    hitSegments: findings.filter((item) => item.themes.length).length,
    totalHits: findings.reduce((sum, item) => sum + item.hits.length, 0),
    materialStats,
  };
}

function segmentReferenceThemes(segId, referenceContext) {
  return referenceContext.findings.find((item) => item.segmentId === segId)?.themes || [];
}

function segmentReferenceHits(segId, referenceContext) {
  return referenceContext.findings.find((item) => item.segmentId === segId)?.hits || [];
}

function inferReferenceProfile(fileName, index = 0) {
  const lower = fileName.toLowerCase();
  const dynamicThemes = [];
  if (/time|timeline|date|时间|日期/.test(lower)) dynamicThemes.push("日期核验");
  if (/money|amount|cash|资金|金额|流水|transfer|转账/.test(lower)) dynamicThemes.push("金额核验", "资金流向");
  if (/witness|statement|证言|people|人物|contact|接触/.test(lower)) dynamicThemes.push("证言冲突", "人物接触");
  const deduped = [...new Set(dynamicThemes)];
  const fallback = DEFAULT_REFERENCE_PROFILES[index % DEFAULT_REFERENCE_PROFILES.length];
  return {
    themes: deduped.length ? deduped : fallback.themes,
    insight: deduped.length
      ? "根据文件名关键字推断风险分析主题，用于本地语音证据风险提示。"
      : fallback.insight,
  };
}

function fmt(v) {
  const m = Math.floor(v / 60);
  const s = Math.floor(v % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function initNav() {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      document.querySelectorAll(".nav-btn").forEach((item) => item.classList.remove("active"));
      btn.classList.add("active");
      showView(btn.dataset.view);
    });
  });
}

function showView(key) {
  document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
  const view = document.getElementById(`view-${key}`);
  if (view) view.classList.add("active");
  renderAll();
}

function openCase(caseId, evidenceId = "") {
  app.activeCaseId = caseId;
  const c = currentCase();
  const preferred = evidenceId ? c.evidences.find((item) => item.id === evidenceId) : null;
  const fallback = c.evidences.find((item) => !item.archived) || c.evidences[0] || null;
  const chosen = preferred || fallback;
  app.activeEvidenceId = chosen?.id || "";
  app.activeStageId = chosen ? chosen.stage : 1;
  app.activeSegmentId = chosen?.segments[0]?.id || "";
  const workspaceBtn = document.getElementById("workspaceNavBtn");
  workspaceBtn.disabled = !chosen && !c;
  document.querySelectorAll(".nav-btn").forEach((item) => item.classList.remove("active"));
  workspaceBtn.classList.add("active");
  showView("workspace");
}

function renderAll() {
  renderGlobal();
  renderCases();
  renderWorkspace();
}

function renderGlobal() {
  const c = currentCase();
  const e = currentEvidence();
  document.getElementById("globalCaseId").textContent = c?.id || "-";
  document.getElementById("globalCaseStatus").textContent = c ? caseStatus(c) : "未选择";
  document.getElementById("globalEvidenceId").textContent = e?.id || "-";
  document.getElementById("globalStageLabel").textContent = e ? stageLabel(app.activeStageId) : "未进入工作台";
  document.getElementById("workspaceNavBtn").disabled = !c;
}

function renderCases() {
  const body = document.getElementById("caseTableBody");
  const query = document.getElementById("caseSearch").value.trim();
  const status = document.getElementById("caseStatusFilter").value;
  const rows = app.cases.filter((item) => {
    const matchQuery = !query || [item.id, item.name, item.officer].join(" ").includes(query);
    const summary = caseStatus(item);
    const matchStatus = status === "all" || summary === status;
    return matchQuery && matchStatus;
  });

  body.innerHTML = rows
    .map(
      (item) => `<tr>
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.officer}</td>
        <td>${item.evidences.length}</td>
        <td><span class="pill">${caseStatus(item)}</span></td>
        <td><button data-open-case="${item.id}">进入案件</button></td>
      </tr>`
    )
    .join("");

  body.querySelectorAll("[data-open-case]").forEach((btn) => {
    btn.addEventListener("click", () => openCase(btn.dataset.openCase));
  });

  document.getElementById("kpiPending").textContent = app.cases.filter((item) => caseStatus(item) === "待人工复核").length;
  document.getElementById("kpiRisk").textContent = app.cases.reduce(
    (sum, item) => sum + item.evidences.reduce((inner, evidence) => inner + evidence.segments.filter((seg) => isRiskSegment(seg)).length, 0),
    0
  );
  document.getElementById("kpiArchived").textContent = app.cases.reduce(
    (sum, item) => sum + item.evidences.filter((evidence) => evidence.archived).length,
    0
  );
  document.getElementById("kpiExported").textContent = app.cases.filter((item) => item.evidences.some((evidence) => evidence.exportedAt)).length;
  renderCaseStatusViz();
}

function renderCaseStatusViz() {
  const total = app.cases.length || 1;
  const items = [
    { key: "pending", label: "待复核", value: app.cases.filter((item) => caseStatus(item) === "待人工复核").length },
    { key: "confirmed", label: "已确认", value: app.cases.filter((item) => caseStatus(item) === "已形成确认稿").length },
    { key: "exported", label: "已导出", value: app.cases.filter((item) => caseStatus(item) === "证据包已导出").length },
  ];
  document.getElementById("caseStatusViz").innerHTML = items
    .map((item) => {
      const pct = Math.round((item.value / total) * 100);
      return `<div class="bar-row">
        <span>${item.label}</span>
        <div class="bar ${item.key}"><span style="width:${pct}%"></span></div>
        <b>${item.value}</b>
      </div>`;
    })
    .join("");
}

function renderWorkspace() {
  const c = currentCase();
  if (!c) {
    document.getElementById("workspaceCaseTitle").textContent = "案件工作台";
    document.getElementById("stageContent").innerHTML = `<div class="card empty-state">请选择案件进入工作台。</div>`;
    return;
  }

  const e = currentEvidence();
  if (e && app.activeStageId > e.stage) app.activeStageId = e.stage;
  if (e && !e.segments.find((seg) => seg.id === app.activeSegmentId)) {
    app.activeSegmentId = e.segments[0]?.id || "";
  }

  document.getElementById("workspaceCaseTitle").textContent = `${c.id} ${c.name}`;
  document.getElementById("workspaceCaseSubtitle").textContent = "案件详情页包含多条语音证据，阶段入口按当前选中证据控制。";
  document.getElementById("workspaceCaseStatusChip").textContent = caseStatus(c);
  document.getElementById("workspaceCaseId").textContent = c.id;
  document.getElementById("workspaceOfficer").textContent = c.officer;
  document.getElementById("workspaceStatus").textContent = caseStatus(c);
  document.getElementById("workspaceEvidenceCount").textContent = c.evidences.length;
  document.getElementById("workspacePendingCount").textContent = c.evidences.filter((item) => item.stage === 3 && !item.archived).length;
  document.getElementById("workspaceArchivedCount").textContent = c.evidences.filter((item) => item.archived).length;
  document.getElementById("showArchivedToggle").checked = app.showArchived;

  renderReferenceMaterials(c);
  renderEvidenceTable(c, e);
  renderStageHeader(e);
  renderStageCards(e);
  renderStageContent(c, e);

  document.getElementById("caseActivityList").innerHTML = c.audit
    .slice()
    .reverse()
    .slice(0, 8)
    .map((event) => `<li><b>${event.t}</b> ${event.actor} [${event.type}] ${event.detail}</li>`)
    .join("");
}

function renderReferenceMaterials(c) {
  const selected = selectedReferenceMaterials(c);
  document.getElementById("referenceSelectedChip").textContent = `已选参考 ${selected.length} 份`;
  document.getElementById("referenceSummary").innerHTML = selected.length
    ? selected
        .map(
          (item) => `<div class="reference-pill">
            <b>${item.id}</b>
            <span>${item.name}</span>
            <small>${item.themes.join(" / ")}</small>
          </div>`
        )
        .join("")
    : `<div class="supporting-note">当前尚未选用案件情况分析材料。转写后的风险提示会退回到基础标签规则。</div>`;

  const body = document.getElementById("referenceTableBody");
  body.innerHTML = (c.referenceMaterials || [])
    .map(
      (item) => `<tr>
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.fileType}</td>
        <td>${item.uploadedAt}</td>
        <td><code>${item.watermarkId}</code></td>
        <td>${item.selectedAsReference ? '<span class="pill ok">已纳入参考</span>' : '<span class="pill">未纳入</span>'}</td>
        <td>${item.themes.join(" / ")}</td>
        <td><button data-toggle-reference="${item.id}">${item.selectedAsReference ? "取消参考" : "选为参考"}</button></td>
      </tr>`
    )
    .join("");

  body.querySelectorAll("[data-toggle-reference]").forEach((btn) => {
    btn.addEventListener("click", () => toggleReferenceMaterial(btn.dataset.toggleReference));
  });
}

function renderReferenceBasis(referenceContext) {
  if (!referenceContext.selectedMaterials.length) {
    return `<div class="supporting-note warn-note">尚未选用案件情况分析材料，当前风险提示仅基于转写标签和基础规则。</div>`;
  }

  return `<div class="analysis-card">
    <h4>风险提示依据</h4>
    <div class="reference-summary compact">
      ${referenceContext.selectedMaterials
        .map(
          (item) => `<div class="reference-pill">
            <b>${item.id}</b>
            <span>${item.name}</span>
            <small>${item.themes.join(" / ")}</small>
          </div>`
        )
        .join("")}
    </div>
    <p class="muted">当前共有 ${referenceContext.hitSegments} 个片段命中已选参考材料，共形成 ${referenceContext.totalHits} 条风险提示依据。</p>
    <div class="analysis-stat-list">
      ${referenceContext.materialStats
        .map(
          (item) => `<div class="analysis-stat">
            <b>${item.materialId}</b>
            <span>${item.materialName}</span>
            <small>命中片段 ${item.hitSegments} 个｜规则 ${item.rules.length ? item.rules.join(" / ") : "无"}</small>
          </div>`
        )
        .join("")}
    </div>
  </div>`;
}

function renderHitList(hits, emptyText = "未命中参考材料") {
  if (!hits.length) {
    return `<div class="hit-empty">${emptyText}</div>`;
  }
  return `<div class="hit-list">
    ${hits
      .map(
        (hit) => `<div class="hit-card">
          <div class="hit-card-top">
            <b>${hit.materialId}</b>
            <span>${hit.materialName}</span>
          </div>
          <div class="hit-card-meta">
            <span>主题：${hit.theme}</span>
            <span>规则：${hit.rule}</span>
          </div>
          <p>${hit.reason}</p>
        </div>`
      )
      .join("")}
  </div>`;
}

function renderEvidenceTable(c, selectedEvidence) {
  const rows = c.evidences.filter((item) => app.showArchived || !item.archived);
  const body = document.getElementById("evidenceTableBody");
  body.innerHTML = rows.length
    ? rows
        .map(
          (item) => `<tr class="${selectedEvidence?.id === item.id ? "selected-row" : ""}">
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.uploadedAt}</td>
            <td><code>${shortHash(item.sha256)}</code></td>
            <td>${item.duration}</td>
            <td><span class="pill">${stageLabel(item.stage)}</span></td>
            <td>${item.archived ? '<span class="pill archived">已归档</span>' : '<span class="pill ok">正常</span>'}</td>
            <td class="actions-cell">
              <button data-view-evidence="${item.id}">查看</button>
              <button data-archive-evidence="${item.id}" ${item.archived ? "disabled" : ""}>${item.archived ? "已归档" : "归档"}</button>
            </td>
          </tr>`
        )
        .join("")
    : `<tr><td colspan="8" class="empty-row">当前筛选下没有证据记录。</td></tr>`;

  body.querySelectorAll("[data-view-evidence]").forEach((btn) => {
    btn.addEventListener("click", () => {
      app.activeEvidenceId = btn.dataset.viewEvidence;
      const evidence = currentEvidence();
      app.activeStageId = evidence ? evidence.stage : 1;
      app.activeSegmentId = evidence?.segments[0]?.id || "";
      renderAll();
    });
  });

  body.querySelectorAll("[data-archive-evidence]").forEach((btn) => {
    btn.addEventListener("click", () => archiveEvidence(btn.dataset.archiveEvidence));
  });
}

function renderStageHeader(evidence) {
  const c = currentCase();
  const selectedRefs = selectedReferenceMaterials(c);
  document.getElementById("selectedEvidenceId").textContent = evidence?.id || "-";
  document.getElementById("selectedEvidenceStage").textContent = evidence ? stageLabel(evidence.stage) : "-";
  document.getElementById("selectedEvidenceArchive").textContent = evidence ? (evidence.archived ? "已归档" : "正常") : "-";
  if (!evidence) {
    document.getElementById("stageGuardText").textContent = "请先上传或选择一条证据。";
    return;
  }
  document.getElementById("stageGuardText").textContent = `当前证据阶段为“${stageLabel(evidence.stage)}”。已选参考材料 ${selectedRefs.length} 份，仅开放已完成或当前阶段的内容。`;
}

function renderStageCards(evidence) {
  const container = document.getElementById("stageCards");
  if (!evidence) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = STAGES.map((item) => {
    const disabled = item.id > evidence.stage;
    return `<button
      type="button"
      class="stage-card ${app.activeStageId === item.id ? "active" : ""} ${item.id <= evidence.stage ? "done" : ""}"
      data-stage-id="${item.id}"
      ${disabled ? "disabled" : ""}
    >
      <span class="stage-card-index">Step ${item.id}</span>
      <b>${item.label}</b>
      <span>${item.desc}</span>
    </button>`;
  }).join("");

  container.querySelectorAll("[data-stage-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      app.activeStageId = Number(btn.dataset.stageId);
      renderAll();
    });
  });
}

function renderStageContent(c, evidence) {
  const container = document.getElementById("stageContent");
  if (!evidence) {
    container.innerHTML = `<div class="card empty-state">当前案件还没有证据，请先上传原始音频。</div>`;
    return;
  }
  const referenceContext = buildReferenceContext(c, evidence);

  if (app.activeStageId === 1) {
    container.innerHTML = renderPreservedStage(evidence);
    bindStageCommonActions(c, evidence);
    return;
  }

  if (app.activeStageId === 2) {
    container.innerHTML = renderTranscribedStage(c, evidence, referenceContext);
    bindStageCommonActions(c, evidence);
    const rerunBtn = document.getElementById("rerunTranscriptionBtn");
    if (rerunBtn) {
      rerunBtn.addEventListener("click", () => rerunTranscription(evidence.id));
    }
    return;
  }

  if (app.activeStageId === 3) {
    container.innerHTML = renderReviewStage(evidence, referenceContext);
    bindStageCommonActions(c, evidence);
    bindReviewStage(c, evidence, referenceContext);
    return;
  }

  container.innerHTML = renderConfirmedStage(c, evidence, referenceContext);
  bindStageCommonActions(c, evidence);
  const exportBtn = document.getElementById("exportJsonBtn");
  const markExportBtn = document.getElementById("markExportBtn");
  const auditBtn = document.getElementById("viewAuditChainBtn");
  if (exportBtn) exportBtn.addEventListener("click", () => exportEvidenceBundle(c, evidence));
  if (markExportBtn) markExportBtn.addEventListener("click", () => markEvidenceExported(evidence.id));
  if (auditBtn) {
    auditBtn.addEventListener("click", () => {
      document.getElementById("evidenceAuditList")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

function bindStageCommonActions(c, evidence) {
  const archiveBtn = document.getElementById("stageArchiveBtn");
  if (archiveBtn) archiveBtn.addEventListener("click", () => archiveEvidence(evidence.id));
  const hashBtn = document.getElementById("selectHashBtn");
  if (hashBtn) {
    hashBtn.addEventListener("click", () => {
      const code = document.getElementById("fullHashValue");
      if (!code) return;
      const range = document.createRange();
      range.selectNodeContents(code);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    });
  }
}

function renderPreservedStage(evidence) {
  return `<div class="grid-2">
    <div class="card">
      <h3>Step 1 · 原始证据已固化</h3>
      <p class="muted">此阶段仅展示原始文件信息与固化证据元数据，原始证据不可删除。</p>
      ${evidence.archived ? '<div class="banner warn-banner">该证据已归档，默认不会出现在未归档列表中，但仍可查看。</div>' : ""}
      <div class="info-grid">
        <div><label>证据ID</label><b>${evidence.id}</b></div>
        <div><label>文件名</label><b>${evidence.name}</b></div>
        <div><label>上传时间</label><b>${evidence.uploadedAt}</b></div>
        <div><label>上传人</label><b>${evidence.uploadActor}</b></div>
        <div><label>音频时长</label><b>${evidence.duration}</b></div>
        <div><label>归档状态</label><b>${evidence.archived ? "已归档" : "正常"}</b></div>
      </div>
      <details class="hash-panel" open>
        <summary>查看哈希详情</summary>
        <code id="fullHashValue">${evidence.sha256}</code>
        <button id="selectHashBtn" type="button" class="ghost-btn small">选中哈希</button>
      </details>
      <div class="readonly-box">
        原始证据不可删除，仅支持归档管理。任何后续处理都基于派生结果，不会覆盖原始证据。
      </div>
    </div>
    <div class="card">
      <h3>保全操作</h3>
      <ul class="checklist">
        <li>✅ 文件元数据已固化</li>
        <li>✅ SHA-256 已写入证据记录</li>
        <li>✅ 原始证据只读策略已启用</li>
      </ul>
      <div class="row gap wrap">
        <button id="stageArchiveBtn" type="button" ${evidence.archived ? "disabled" : ""}>${evidence.archived ? "已归档" : "归档该证据"}</button>
      </div>
      <p class="muted">归档后仍可查看，不可删除原始证据元数据。</p>
    </div>
  </div>`;
}

function renderTranscribedStage(c, evidence, referenceContext) {
  const logs = c.audit
    .filter((event) => event.evidenceId === evidence.id && ["audio_uploaded", "hash_generated", "transcription_completed", "transcription_rerun", "analysis_reference_attached"].includes(event.type))
    .slice()
    .reverse();
  return `<div class="grid-2">
    <div class="card">
      <h3>Step 2 · 自动转写完成</h3>
      <p class="muted">展示机器转写结果、分段状态和任务日志。此阶段仅查看，不能直接修改原始证据。</p>
      ${renderReferenceBasis(referenceContext)}
      <div class="info-grid">
        <div><label>当前转写轮次</label><b>${evidence.transcriptionRuns}</b></div>
        <div><label>分段数量</label><b>${evidence.segments.length}</b></div>
        <div><label>当前阶段</label><b>${stageLabel(evidence.stage)}</b></div>
        <div><label>命中参考依据片段</label><b>${referenceContext.hitSegments}</b></div>
      </div>
      <div class="segment-summary">
        ${evidence.segments
          .map((seg) => {
            const referenceHits = segmentReferenceHits(seg.id, referenceContext);
            return `<div class="segment-summary-row">
              <b>${seg.id}</b>
              <span>${seg.speaker}</span>
              <span>${fmt(seg.start)} - ${fmt(seg.end)}</span>
              <span>${seg.tags.length ? seg.tags.join(" / ") : "普通片段"}</span>
              <div>${renderHitList(referenceHits, "未命中参考材料")}</div>
            </div>`;
          })
          .join("")}
      </div>
    </div>
    <div class="card">
      <h3>转写任务日志</h3>
      <ul class="timeline mini">
        ${logs.map((event) => `<li><b>${event.t}</b> [${event.type}] ${event.detail}</li>`).join("")}
      </ul>
      <div class="row gap wrap">
        <button id="rerunTranscriptionBtn" type="button" ${evidence.archived ? "disabled" : ""}>重跑转写（演示）</button>
        <button id="stageArchiveBtn" type="button" ${evidence.archived ? "disabled" : ""}>${evidence.archived ? "已归档" : "归档该证据"}</button>
      </div>
      <p class="muted">重跑转写只更新任务日志，不改动原始证据记录。</p>
    </div>
  </div>`;
}

function renderReviewStage(evidence, referenceContext) {
  const seg = activeSegment(evidence);
  const currentHits = seg ? segmentReferenceHits(seg.id, referenceContext) : [];
  return `<div class="review-stack">
    ${evidence.archived ? '<div class="card banner warn-banner">该证据已归档，目前仅允许查看，不允许继续编辑。</div>' : ""}
    <div class="grid-3">
      <div class="card">
        <h3>Step 3 · 待人工复核</h3>
        <p class="muted">点击片段或时间轴可跳转。风险片段会高亮显示。</p>
        ${renderReferenceBasis(referenceContext)}
        <audio id="reviewAudio" controls ${evidence.url ? `src="${evidence.url}"` : ""}></audio>
        <p>当前片段：<b id="currentSegmentId">${seg?.id || "-"}</b></p>
        <div class="row gap">
          <button id="riskPrevBtn" type="button">上一处风险</button>
          <button id="riskNextBtn" type="button">下一处风险</button>
        </div>
        <canvas id="timelineCanvas" width="520" height="130"></canvas>
        <p class="muted">蓝色：普通片段｜红色：风险片段｜白线：播放位置</p>
        <button id="stageArchiveBtn" type="button" ${evidence.archived ? "disabled" : ""}>${evidence.archived ? "已归档" : "归档该证据"}</button>
      </div>

      <div class="card">
        <h3>机器初稿</h3>
        <div id="segmentList" class="segment-list">
          ${evidence.segments.map((item) => renderSegmentCard(item, referenceContext)).join("")}
        </div>
      </div>

      <div class="card">
        <h3>人工复核面板</h3>
        <div class="supporting-note">
          ${currentHits.length ? "当前片段已形成以下风险提示依据链：" : "当前片段未命中已选分析材料，风险提示仅基于基础标签。"}
        </div>
        ${renderHitList(currentHits, "当前片段没有命中已选分析材料的规则。")}
        <p><b>原始文本</b></p>
        <textarea id="originText" readonly>${seg?.text || ""}</textarea>
        <p><b>修订文本</b></p>
        <textarea id="editText" ${evidence.archived ? "readonly" : ""}>${seg?.text || ""}</textarea>
        <label>修改原因
          <select id="editReason" ${evidence.archived ? "disabled" : ""}>
            <option value="">请选择</option>
            <option>回放确认</option>
            <option>口误修正</option>
            <option>补全日期</option>
            <option>更正金额</option>
            <option>其他</option>
          </select>
        </label>
        <pre id="diffPreview" class="diff">${buildDiff(seg?.text || "", seg?.text || "")}</pre>
        <button id="saveEditBtn" type="button" ${evidence.archived ? "disabled" : ""}>提交复核并形成确认稿</button>
        <p id="editToast" class="hidden success">已生成审计记录</p>
      </div>
    </div>
  </div>`;
}

function renderConfirmedStage(c, evidence, referenceContext) {
  const evidenceAudit = c.audit.filter((event) => event.evidenceId === evidence.id).slice().reverse();
  const topFindings = referenceContext.findings.filter((item) => item.hits.length);
  return `<div class="grid-2">
    <div class="card">
      <h3>Step 4 · 已形成确认稿</h3>
      ${renderReferenceBasis(referenceContext)}
      <div class="info-grid">
        <div><label>确认稿版本</label><b>v${evidence.version}</b></div>
        <div><label>确认时间</label><b>${evidence.confirmedAt || "待确认"}</b></div>
        <div><label>导出状态</label><b>${evidence.exportedAt ? "已导出" : "未导出"}</b></div>
        <div><label>参考材料</label><b>${referenceContext.selectedMaterials.length} 份</b></div>
      </div>
      <ul class="checklist">
        <li>✅ 原始音频</li>
        <li>✅ 机器初稿 JSON</li>
        <li>✅ 人工确认稿 JSON</li>
        <li>✅ 审计日志 JSON</li>
        <li>✅ 哈希清单</li>
        <li>✅ 案件情况分析参考材料清单</li>
        <li>✅ 风险提示依据链摘要</li>
      </ul>
      <div class="row gap wrap">
        <button id="exportJsonBtn" type="button">导出结构化 JSON</button>
        <button id="markExportBtn" type="button" ${evidence.exportedAt ? "disabled" : ""}>${evidence.exportedAt ? "已标记导出" : "标记已导出"}</button>
        <button id="viewAuditChainBtn" type="button" class="ghost-btn">查看审计链</button>
        <button id="stageArchiveBtn" type="button" ${evidence.archived ? "disabled" : ""}>${evidence.archived ? "已归档" : "归档该证据"}</button>
      </div>
      <p id="exportTip" class="muted">${evidence.exportedAt ? `已于 ${evidence.exportedAt} 写入导出记录。` : "导出后会写入 evidence_exported 审计事件。"}</p>
    </div>

    <div class="card">
      <h3>审计摘要</h3>
      <ul id="evidenceAuditList" class="timeline">
        ${evidenceAudit.map((event) => `<li><b>${event.t}</b> [${event.type}] ${event.actor} - ${event.detail}</li>`).join("")}
      </ul>
      <h4>风险提示依据摘要</h4>
      <div class="risk-summary-list">
        ${topFindings.length
          ? topFindings
              .map(
                (item) => `<div class="risk-summary-item">
                  <b>${item.segmentId}</b>
                  <span>命中 ${item.hits.length} 条依据</span>
                  <small>${item.hits.map((hit) => `${hit.materialId} / ${hit.rule}`).join("；")}</small>
                </div>`
              )
              .join("")
          : '<div class="hit-empty">当前确认稿没有命中参考材料的风险提示依据。</div>'}
      </div>
    </div>
  </div>`;
}

function renderSegmentCard(seg, referenceContext) {
  const referenceHits = segmentReferenceHits(seg.id, referenceContext);
  const badges = seg.tags
    .map((tag) => `<span class="badge ${isRiskTag(tag) ? "risk" : "warn"}">${tag}</span>`)
    .join("");
  const referenceBadges = [...new Set(referenceHits.map((hit) => hit.rule))]
    .map((rule) => `<span class="badge info">依据: ${rule}</span>`)
    .join("");
  return `<div class="segment ${seg.id === app.activeSegmentId ? "active" : ""}" data-seg="${seg.id}">
    <b>${seg.speaker}</b> ${fmt(seg.start)} - ${fmt(seg.end)}
    <div>${seg.text}</div>
    <div class="badges">${badges}${referenceBadges}</div>
  </div>`;
}

function activeSegment(evidence) {
  return evidence?.segments.find((seg) => seg.id === app.activeSegmentId) || evidence?.segments[0] || null;
}

function bindReviewStage(c, evidence, referenceContext) {
  const audio = document.getElementById("reviewAudio");
  const editText = document.getElementById("editText");
  const reasonSelect = document.getElementById("editReason");

  document.querySelectorAll("[data-seg]").forEach((node) => {
    node.addEventListener("click", () => {
      app.activeSegmentId = node.dataset.seg;
      const seg = activeSegment(evidence);
      if (audio) audio.currentTime = seg.start;
      renderStageContent(c, evidence);
    });
  });

  if (editText) {
    editText.addEventListener("input", () => {
      const seg = activeSegment(evidence);
      document.getElementById("diffPreview").textContent = buildDiff(seg.text, editText.value);
    });
  }

  document.getElementById("riskPrevBtn")?.addEventListener("click", () => jumpRisk(evidence, -1));
  document.getElementById("riskNextBtn")?.addEventListener("click", () => jumpRisk(evidence, 1));

  if (audio) {
    audio.addEventListener("timeupdate", (event) => drawTimeline(evidence, event.target.currentTime || 0));
  }

  const canvas = document.getElementById("timelineCanvas");
  if (canvas) {
    drawTimeline(evidence, audio?.currentTime || activeSegment(evidence)?.start || 0);
    canvas.addEventListener("click", (event) => {
      const rect = canvas.getBoundingClientRect();
      const ratio = (event.clientX - rect.left) / rect.width;
      const total = Math.max(...evidence.segments.map((seg) => seg.end), 1);
      const targetTime = ratio * total;
      const seg = evidence.segments.find((item) => targetTime >= item.start && targetTime <= item.end);
      if (!seg) return;
      app.activeSegmentId = seg.id;
      if (audio) audio.currentTime = seg.start;
      renderStageContent(c, evidence);
    });
  }

  document.getElementById("saveEditBtn")?.addEventListener("click", () => {
    const seg = activeSegment(evidence);
    const edited = editText.value;
    const reason = reasonSelect.value;
    if (!reason) {
      alert("请选择修改原因");
      return;
    }
    if (edited === seg.text) {
      alert("未检测到文本修改");
      return;
    }

    evidence.edits.push({ segmentId: seg.id, before: seg.text, after: edited, reason, at: now() });
    pushAudit(c, {
      actor: c.officer,
      type: "transcript_edited",
      evidenceId: evidence.id,
      segmentId: seg.id,
      detail: `${seg.id}: ${reason}`,
    });

    seg.text = edited;
    evidence.stage = 4;
    evidence.version += 1;
    evidence.confirmedAt = now();
    pushAudit(c, {
      actor: c.officer,
      type: "review_confirmed",
      evidenceId: evidence.id,
      detail: "确认稿已形成",
    });

    app.activeStageId = 4;
    const tip = document.getElementById("editToast");
    if (tip) {
      tip.classList.remove("hidden");
      setTimeout(() => tip.classList.add("hidden"), 1200);
    }
    renderAll();
  });
}

function buildDiff(before, after) {
  if (before === after) return "（无差异）";
  return `- ${before}\n+ ${after}`;
}

function drawTimeline(evidence, currentTime = 0) {
  const canvas = document.getElementById("timelineCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#111827";
  ctx.fillRect(0, 0, w, h);

  const total = Math.max(...evidence.segments.map((seg) => seg.end), 1);
  evidence.segments.forEach((seg) => {
    const x = (seg.start / total) * w;
    const segW = Math.max(2, ((seg.end - seg.start) / total) * w);
    ctx.fillStyle = isRiskSegment(seg) ? "#dc2626" : "#2563eb";
    ctx.fillRect(x, 26, segW, 58);
    if (seg.id === app.activeSegmentId) {
      ctx.strokeStyle = "#f8fafc";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, 26, segW, 58);
    }
  });

  const playX = (currentTime / total) * w;
  ctx.strokeStyle = "#f8fafc";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(playX, 14);
  ctx.lineTo(playX, h - 12);
  ctx.stroke();

  ctx.fillStyle = "#e5e7eb";
  ctx.font = "12px sans-serif";
  ctx.fillText("00:00", 8, h - 6);
  ctx.fillText(fmt(total), w - 46, h - 6);
}

function jumpRisk(evidence, direction) {
  const risks = evidence.segments.filter((seg) => isRiskSegment(seg));
  if (!risks.length) return;
  const index = risks.findIndex((seg) => seg.id === app.activeSegmentId);
  const nextIndex = direction > 0 ? (index + 1 + risks.length) % risks.length : (index - 1 + risks.length) % risks.length;
  app.activeSegmentId = risks[nextIndex].id;
  renderStageContent(currentCase(), evidence);
}

function isRiskTag(tag) {
  return tag.includes("低") || tag.includes("复核");
}

function isRiskSegment(seg) {
  return seg.tags.some((tag) => isRiskTag(tag));
}

function nextReferenceId(c) {
  return `MAT-${String((c.referenceMaterials?.length || 0) + 1).padStart(4, "0")}`;
}

async function handleReferenceUpload(file) {
  const c = currentCase();
  if (!c) return;
  const id = nextReferenceId(c);
  const profile = inferReferenceProfile(file.name, c.referenceMaterials.length);
  const url = URL.createObjectURL(file);
  const material = buildReferenceMaterial({
    caseId: c.id,
    id,
    name: file.name,
    uploadedAt: now(),
    uploadedBy: c.officer,
    selectedAsReference: false,
    themes: profile.themes,
    insight: profile.insight,
    url,
  });
  c.referenceMaterials.unshift(material);
  pushAudit(c, { actor: c.officer, type: "analysis_file_uploaded", detail: `上传 ${file.name}` });
  pushAudit(c, { actor: "system", type: "analysis_watermarked", detail: `${id} 已写入水印记录` });
  renderAll();
}

function toggleReferenceMaterial(materialId) {
  const c = currentCase();
  const material = c?.referenceMaterials.find((item) => item.id === materialId);
  if (!material) return;
  material.selectedAsReference = !material.selectedAsReference;
  pushAudit(c, {
    actor: c.officer,
    type: material.selectedAsReference ? "reference_material_selected" : "reference_material_unselected",
    detail: `${material.id} ${material.selectedAsReference ? "已纳入" : "已移出"}本地风险提示参考`,
  });
  renderAll();
}

async function handleAudioUpload(file) {
  const c = currentCase();
  if (!c) return;
  const sha256 = await hashFile(file);
  const url = URL.createObjectURL(file);
  const durationSeconds = await getDuration(url);
  const evidenceId = nextEvidenceId(c);
  const evidence = {
    id: evidenceId,
    name: file.name,
    uploadedAt: now(),
    uploadActor: c.officer,
    sha256,
    duration: `${Math.floor(durationSeconds / 60)}m ${String(Math.round(durationSeconds % 60)).padStart(2, "0")}s`,
    stage: 3,
    archived: false,
    archivedAt: "",
    url,
    transcriptionRuns: 1,
    confirmedAt: "",
    exportedAt: "",
    segments: clone(SAMPLE_SEGMENTS_A).map((seg, index) => ({
      ...seg,
      id: `seg_${String(index + 1).padStart(3, "0")}`,
    })),
    edits: [],
    version: 1,
  };
  c.evidences.unshift(evidence);
  pushAudit(c, { actor: c.officer, type: "audio_uploaded", evidenceId, detail: `上传 ${file.name}` });
  pushAudit(c, { actor: "system", type: "hash_generated", evidenceId, detail: `SHA-256 ${sha256.slice(0, 12)}...` });
  pushAudit(c, { actor: "system", type: "transcription_completed", evidenceId, detail: "机器初稿生成完成" });
  if (selectedReferenceMaterials(c).length) {
    pushAudit(c, {
      actor: "system",
      type: "analysis_reference_attached",
      evidenceId,
      detail: `已关联 ${selectedReferenceMaterials(c).length} 份分析材料用于风险提示`,
    });
  }
  app.activeEvidenceId = evidenceId;
  app.activeStageId = 3;
  app.activeSegmentId = evidence.segments[0]?.id || "";
  renderAll();
}

function nextEvidenceId(c) {
  return `EV-${String(c.evidences.length + 1).padStart(4, "0")}`;
}

async function hashFile(file) {
  const buf = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return [...new Uint8Array(digest)].map((item) => item.toString(16).padStart(2, "0")).join("");
}

function getDuration(url) {
  return new Promise((resolve) => {
    const audio = document.createElement("audio");
    audio.src = url;
    audio.onloadedmetadata = () => resolve(audio.duration || 0);
  });
}

function archiveEvidence(evidenceId) {
  const c = currentCase();
  const evidence = c?.evidences.find((item) => item.id === evidenceId);
  if (!evidence || evidence.archived) return;
  const ok = window.confirm("归档后原始证据仍可查看，但默认会从列表中隐藏。是否继续？");
  if (!ok) return;
  evidence.archived = true;
  evidence.archivedAt = now();
  app.showArchived = true;
  pushAudit(c, { actor: c.officer, type: "evidence_archived", evidenceId, detail: "证据已归档" });
  renderAll();
}

function rerunTranscription(evidenceId) {
  const c = currentCase();
  const evidence = c?.evidences.find((item) => item.id === evidenceId);
  if (!evidence || evidence.archived) return;
  evidence.transcriptionRuns += 1;
  if (evidence.stage < 2) evidence.stage = 2;
  pushAudit(c, { actor: "system", type: "transcription_rerun", evidenceId, detail: `已重新执行第 ${evidence.transcriptionRuns} 轮转写` });
  renderAll();
}

function markEvidenceExported(evidenceId) {
  const c = currentCase();
  const evidence = c?.evidences.find((item) => item.id === evidenceId);
  if (!evidence || evidence.exportedAt) return;
  evidence.exportedAt = now();
  pushAudit(c, { actor: c.officer, type: "evidence_exported", evidenceId, detail: "证据包导出并校验" });
  renderAll();
}

function exportEvidenceBundle(c, evidence) {
  const referenceContext = buildReferenceContext(c, evidence);
  const payload = {
    case_id: c.id,
    case_name: c.name,
    officer: c.officer,
    reference_materials: c.referenceMaterials,
    selected_reference_materials: selectedReferenceMaterials(c),
    risk_reference_context: referenceContext,
    evidence: {
      id: evidence.id,
      name: evidence.name,
      uploaded_at: evidence.uploadedAt,
      sha256: evidence.sha256,
      duration: evidence.duration,
      stage: stageLabel(evidence.stage),
      archived: evidence.archived,
      archived_at: evidence.archivedAt,
      confirmed_at: evidence.confirmedAt,
      exported_at: evidence.exportedAt,
    },
    segments: evidence.segments,
    edits: evidence.edits,
    audit: c.audit.filter((event) => event.evidenceId === evidence.id),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${c.id}_${evidence.id}_evidence_bundle.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function pushAudit(c, payload) {
  c.audit.push({ t: now(), ...payload });
}

function bindEvents() {
  document.getElementById("caseSearch").addEventListener("input", renderCases);
  document.getElementById("caseStatusFilter").addEventListener("change", renderCases);
  document.getElementById("showArchivedToggle").addEventListener("change", (event) => {
    app.showArchived = event.target.checked;
    renderAll();
  });
  document.getElementById("backToCasesBtn").addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach((item) => item.classList.remove("active"));
    document.querySelector('[data-view="cases"]').classList.add("active");
    showView("cases");
  });

  document.getElementById("createCaseBtn").addEventListener("click", () => {
    const next = app.cases.length + 1;
    const id = `CASE-2026-${String(next).padStart(3, "0")}`;
    app.cases.push({
      id,
      name: `演示案件 ${next}`,
      officer: "officer_demo",
      referenceMaterials: [],
      evidences: [],
      audit: [{ t: now(), actor: "system", type: "case_created", detail: "案件已创建" }],
    });
    openCase(id);
  });

  document.getElementById("workspaceAudioInput").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    handleAudioUpload(file).finally(() => {
      event.target.value = "";
    });
  });

  document.getElementById("referenceFileInput").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    handleReferenceUpload(file).finally(() => {
      event.target.value = "";
    });
  });
}

initNav();
bindEvents();
renderAll();
