const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

const state = { category: CATEGORIES[0], filter: "all", pickerTarget: "to" };
const fmt = new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 6 });
const moneyFmt = new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 2 });

document.addEventListener("DOMContentLoaded", init);

function init() {
  renderCategories();
  openCategory(CATEGORIES[0], false);
  renderHistory();
  renderRecent();
  bindEvents();
}

function bindEvents() {
  $("#backBtn").addEventListener("click", showHome);
  $("#viewHistoryBtn").addEventListener("click", showHistory);
  $("#swapBtn").addEventListener("click", swapUnits);
  $("#themeBtn").addEventListener("click", () => toast("Tema clean ativo"));

  $("#fromUnit").addEventListener("change", () => { updatePickerCards(); convert(); });
  $("#toUnit").addEventListener("change", () => { updatePickerCards(); convert(); });
  $("#amountInput").addEventListener("input", convert);
  $("#unitSearch").addEventListener("input", renderUnitList);
  $("#resultText").addEventListener("click", copyResult);

  $("#fromPicker").addEventListener("click", () => openPicker("from"));
  $("#toPicker").addEventListener("click", () => openPicker("to"));
  $("#pickerBackdrop").addEventListener("click", closePicker);
  $("#pickerClose").addEventListener("click", closePicker);
  $("#pickerSearch").addEventListener("input", renderPickerOptions);

  $$(".bottom-nav button").forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      if (tab === "home") showHome();
      if (tab === "history") showHistory();
      if (tab === "convert") showConverter();
      if (tab === "favorites") toast("Favoritos em breve");
    });
  });

  $$(".history-filter button").forEach(btn => {
    btn.addEventListener("click", () => {
      state.filter = btn.dataset.filter;
      $$(".history-filter button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderHistory();
    });
  });
}

function renderCategories() {
  $("#categoryGrid").innerHTML = CATEGORIES.map(cat => `
    <button class="category-card ${cat.className}" data-id="${cat.id}" type="button">
      <i class="bi ${cat.icon}"></i>
      <strong>${cat.name}</strong>
      <small>${cat.subtitle}</small>
      <span class="arrow"><i class="bi bi-chevron-right"></i></span>
    </button>
  `).join("");

  $$(".category-card").forEach(card => {
    card.addEventListener("click", () => {
      const cat = CATEGORIES.find(item => item.id === card.dataset.id);
      openCategory(cat, true);
    });
  });
}

function openCategory(category, navigate = true) {
  state.category = category;
  $("#pageTitle").textContent = category.name;
  $("#pageSubtitle").textContent = "Select unit to convert";
  $("#categoryName").textContent = category.name;
  $("#categoryBadge").innerHTML = `<i class="bi ${category.icon}"></i>`;

  const options = Object.entries(category.units)
    .map(([code, unit]) => `<option value="${code}">${unit.name} (${code})</option>`)
    .join("");

  $("#fromUnit").innerHTML = options;
  $("#toUnit").innerHTML = options;

  const keys = Object.keys(category.units);
  $("#fromUnit").value = category.base;
  $("#toUnit").value = keys.find(k => k !== category.base) || category.base;

  updatePickerCards();
  renderUnitList();
  convert(false);
  if (navigate) showConverter();
}

function showHome() {
  $("#homeScreen").classList.remove("d-none");
  $("#converterScreen").classList.add("d-none");
  $("#historyScreen").classList.add("d-none");
  setActiveNav("home");
  $("#pageTitle").textContent = "UnitMax";
  $("#pageSubtitle").textContent = "Convert any unit";
  renderRecent();
}

function showConverter() {
  $("#homeScreen").classList.add("d-none");
  $("#converterScreen").classList.remove("d-none");
  $("#historyScreen").classList.add("d-none");
  setActiveNav("convert");
  $("#pageTitle").textContent = state.category.name;
  $("#pageSubtitle").textContent = "Select unit to convert";
}

function showHistory() {
  $("#homeScreen").classList.add("d-none");
  $("#converterScreen").classList.add("d-none");
  $("#historyScreen").classList.remove("d-none");
  setActiveNav("history");
  $("#pageTitle").textContent = "Histórico";
  $("#pageSubtitle").textContent = "Recent conversions";
  renderHistory();
}

function setActiveNav(tab) {
  $$(".bottom-nav button").forEach(btn => btn.classList.toggle("active", btn.dataset.tab === tab));
}

async function convert(save = true) {
  const amount = Number(String($("#amountInput").value).replace(",", ".") || 0);
  const from = $("#fromUnit").value;
  const to = $("#toUnit").value;
  const category = state.category;

  if (category.id === "currency") {
    await convertCurrency(amount, from, to, save);
    return;
  }

  let result;
  if (category.id === "temperature") result = convertTemperature(amount, from, to);
  else result = amount * category.units[from].factor / category.units[to].factor;

  $("#resultText").textContent = `${fmt.format(result)} ${to}`;
  $("#formulaText").textContent = `${amount} ${from} = ${fmt.format(result)} ${to}`;

  if (save) {
    Store.addHistory({ category: category.id, label: category.name, input: `${amount} ${from}`, output: `${fmt.format(result)} ${to}` });
    renderRecent();
  }
}

async function convertCurrency(amount, from, to, save = true) {
  if (from === to) {
    $("#resultText").textContent = `${moneyFmt.format(amount)} ${to}`;
    $("#formulaText").textContent = "Mesma moeda";
    return;
  }

  $("#resultText").textContent = "...";
  $("#formulaText").textContent = "A consultar API...";

  try {
    const data = await CurrencyAPI.getRate(from, to, amount);
    const output = `${moneyFmt.format(data.result)} ${to}`;

    $("#resultText").textContent = output;
    $("#formulaText").textContent = `1 ${from} = ${fmt.format(data.rate)} ${to} · ${data.source}`;

    if (save) {
      Store.addHistory({ category: "currency", label: "Currency", input: `${amount} ${from}`, output });
      renderRecent();
    }
  } catch (error) {
    $("#resultText").textContent = "Erro";
    $("#formulaText").textContent = "Falha ao obter taxa. Confirma internet ou tenta outra moeda.";
  }
}

function convertTemperature(value, from, to) {
  let celsius;
  if (from === "c") celsius = value;
  if (from === "f") celsius = (value - 32) * 5 / 9;
  if (from === "k") celsius = value - 273.15;
  if (to === "c") return celsius;
  if (to === "f") return celsius * 9 / 5 + 32;
  if (to === "k") return celsius + 273.15;
  return value;
}

function swapUnits() {
  const old = $("#fromUnit").value;
  $("#fromUnit").value = $("#toUnit").value;
  $("#toUnit").value = old;
  updatePickerCards();
  convert();
}

function renderUnitList() {
  const query = ($("#unitSearch").value || "").toLowerCase();
  const units = Object.entries(state.category.units)
    .filter(([code, unit]) => unit.name.toLowerCase().includes(query) || code.toLowerCase().includes(query));

  $("#unitList").innerHTML = units.map(([code, unit]) => `
    <button class="unit-item" data-code="${code}" type="button">
      <b>${unit.name}</b><span>${code}</span>
    </button>
  `).join("");

  $$(".unit-item").forEach(item => {
    item.addEventListener("click", () => {
      $("#toUnit").value = item.dataset.code;
      updatePickerCards();
      convert();
      toast(`${item.dataset.code} selecionado`);
    });
  });
}

function renderRecent() {
  const list = Store.getHistory().slice(0, 4);
  $("#recentList").innerHTML = list.length ? list.map(item => `
    <div class="history-item">
      <div><b>${item.input} → <strong>${item.output}</strong></b><br><small>${item.label} · ${item.date}</small></div>
      <i class="bi bi-chevron-right"></i>
    </div>
  `).join("") : `<div class="empty">Ainda não tens conversões.</div>`;
}

function renderHistory() {
  let list = Store.getHistory();
  if (state.filter !== "all") list = list.filter(item => item.category === state.filter);

  $("#historyList").innerHTML = list.length ? list.map(item => `
    <div class="history-item">
      <div><b>${item.input} → <strong>${item.output}</strong></b><br><small>${item.label} · ${item.date}</small></div>
      <i class="bi bi-star"></i>
    </div>
  `).join("") : `<div class="empty">Sem histórico nesta categoria.</div>`;
}

function copyResult() {
  const text = $("#resultText").textContent;
  navigator.clipboard.writeText(text).then(() => toast("Resultado copiado"));
}

function getUnitLabel(code) {
  const unit = state.category.units[code];
  return unit ? unit.name : code;
}

function updatePickerCards() {
  const from = $("#fromUnit").value;
  const to = $("#toUnit").value;

  $("#fromPicker strong").textContent = from;
  $("#fromPicker small").textContent = getUnitLabel(from);

  $("#toPicker strong").textContent = to;
  $("#toPicker small").textContent = getUnitLabel(to);
}

function openPicker(target) {
  state.pickerTarget = target;
  $("#pickerTitle").textContent = target === "from" ? "Selecionar origem" : "Selecionar destino";
  $("#pickerSearch").value = "";
  $("#pickerModal").classList.remove("d-none");
  renderPickerOptions();
  setTimeout(() => $("#pickerSearch").focus(), 120);
}

function closePicker() {
  $("#pickerModal").classList.add("d-none");
}

function renderPickerOptions() {
  const query = ($("#pickerSearch").value || "").toLowerCase();
  const selected = state.pickerTarget === "from" ? $("#fromUnit").value : $("#toUnit").value;

  const options = Object.entries(state.category.units)
    .filter(([code, unit]) => unit.name.toLowerCase().includes(query) || code.toLowerCase().includes(query));

  $("#pickerOptions").innerHTML = options.map(([code, unit]) => `
    <button class="picker-option ${code === selected ? "active" : ""}" data-code="${code}" type="button">
      <div>
        <b>${unit.name}</b>
        <span>${state.category.name}</span>
      </div>
      <div class="picker-code">${code}</div>
    </button>
  `).join("");

  $$(".picker-option").forEach(button => {
    button.addEventListener("click", () => {
      const select = state.pickerTarget === "from" ? $("#fromUnit") : $("#toUnit");
      select.value = button.dataset.code;
      updatePickerCards();
      convert();
      closePicker();
    });
  });
}


function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 1600);
}
