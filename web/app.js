// 도구 작업실: 도구 검색·적용 메모·작업 보드 (브라우저 localStorage 저장)
const COLS = ["할 일", "진행 중", "검토", "완료"];
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
let tools = [];
let onlyApply = false;
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

async function load() {
  const res = await fetch("../data/tools.json");
  tools = await res.json();
  [...new Set(tools.map((t) => t.category))].forEach((c) => $("cat").insertAdjacentHTML("beforeend", `<option>${esc(c)}</option>`));
  $("count").textContent = `${tools.length}개 항목`;
  renderTools();
  renderBoard();
}

function renderTools() {
  const q = $("q").value.trim().toLowerCase();
  const cat = $("cat").value;
  const memos = store.get("memos", {});
  const list = tools.filter((t) =>
    (!cat || t.category === cat) &&
    (!onlyApply || t.apply || memos[t.name]) &&
    (!q || `${t.name} ${t.use} ${t.note ?? ""}`.toLowerCase().includes(q)));
  $("grid").innerHTML = list.map((t) => `
    <div class="card">
      <h3>${esc(t.name)}</h3>
      <div>${esc(t.use)}</div>
      <span class="tag">${esc(t.category)}</span><span class="tag">${esc(t.license)}</span>
      ${t.note ? `<div class="meta">⚠ ${esc(t.note)}</div>` : ""}
      ${t.apply ? `<div class="apply">적용: ${esc(t.apply)}</div>` : ""}
      <textarea data-name="${esc(t.name)}" placeholder="내 적용 메모">${esc(memos[t.name] ?? "")}</textarea>
      <button data-task="${esc(t.name)}">작업 보드에 추가</button>
    </div>`).join("") || `<div class="meta">검색 결과가 없어요.</div>`;
}

function renderBoard() {
  const tasks = store.get("tasks", []);
  $("cols").innerHTML = COLS.map((c, ci) => `
    <div class="col"><b>${c}</b> <span class="meta">${tasks.filter((t) => t.col === ci).length}</span>
      ${tasks.map((t, i) => t.col !== ci ? "" : `
        <div class="task"><div>${esc(t.title)}</div>
          ${t.done ? `<div class="meta">완료 조건: ${esc(t.done)}</div>` : ""}
          <div class="row">
            ${ci > 0 ? `<button data-move="${i}" data-d="-1">←</button>` : ""}
            ${ci < 3 ? `<button data-move="${i}" data-d="1">→</button>` : ""}
            <button data-del="${i}">삭제</button>
          </div></div>`).join("")}
    </div>`).join("");
}

function addTask(title, done = "") {
  if (!title) return;
  const tasks = store.get("tasks", []);
  tasks.push({ title, done, col: 0 });
  store.set("tasks", tasks);
  renderBoard();
}

$("q").oninput = renderTools;
$("cat").onchange = renderTools;
$("onlyApply").onclick = (e) => { onlyApply = !onlyApply; e.target.classList.toggle("on", onlyApply); renderTools(); };
$("grid").oninput = (e) => {
  if (!e.target.dataset.name) return;
  const memos = store.get("memos", {});
  memos[e.target.dataset.name] = e.target.value;
  store.set("memos", memos);
};
$("grid").onclick = (e) => { if (e.target.dataset.task) addTask(`${e.target.dataset.task} 적용`); };
$("addTask").onclick = () => { addTask($("newTask").value.trim(), $("newDone").value.trim()); $("newTask").value = $("newDone").value = ""; };
$("cols").onclick = (e) => {
  const tasks = store.get("tasks", []);
  if (e.target.dataset.move) tasks[e.target.dataset.move].col += Number(e.target.dataset.d);
  else if (e.target.dataset.del) tasks.splice(e.target.dataset.del, 1);
  else return;
  store.set("tasks", tasks);
  renderBoard();
};
const tab = (show) => { $("tools").hidden = show !== "tools"; $("board").hidden = show !== "board"; $("tabTools").classList.toggle("on", show === "tools"); $("tabBoard").classList.toggle("on", show === "board"); };
$("tabTools").onclick = () => tab("tools");
$("tabBoard").onclick = () => tab("board");
load();
