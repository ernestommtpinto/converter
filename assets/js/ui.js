const UI = {
  $: selector => document.querySelector(selector),
  $$: selector => document.querySelectorAll(selector),

  toast(message) {
    const toast = this.$("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1700);
  },

  currencyOptions() {
    return Object.entries(CURRENCIES)
      .map(([code, name]) => `<option value="${code}">${code} · ${name}</option>`)
      .join("");
  },

  unitOptions(units) {
    return Object.entries(units)
      .map(([code, value]) => `<option value="${code}">${value[0]}</option>`)
      .join("");
  },

  renderChips(values, onClick) {
    const chips = this.$("#chips");
    chips.innerHTML = values
      .map(value => `<button class="chip" data-value="${value}" type="button">${value}</button>`)
      .join("");

    this.$$("#chips .chip").forEach(button => {
      button.addEventListener("click", () => onClick(button.dataset.value));
    });
  },

  drawChart(values) {
    const chartLine = this.$("#chartLine");
    const chartFill = this.$("#chartFill");

    if (!values.length) {
      chartLine.setAttribute("d", "");
      chartFill.setAttribute("d", "");
      return;
    }

    const width = 420, height = 74, padding = 8;
    const min = Math.min(...values), max = Math.max(...values), range = max - min || 1;

    const points = values.map((value, index) => [
      padding + index * ((width - padding * 2) / (values.length - 1 || 1)),
      height - padding - ((value - min) / range) * (height - padding * 2)
    ]);

    const line = points
      .map((point, index) => `${index ? "L" : "M"} ${point[0].toFixed(1)} ${point[1].toFixed(1)}`)
      .join(" ");

    chartLine.setAttribute("d", line);
    chartFill.setAttribute("d", `${line} L ${points[points.length - 1][0]} ${height} L ${points[0][0]} ${height} Z`);
  },

  switchScreen(screenName) {
    this.$$(".screen").forEach(screen => screen.classList.remove("active"));
    this.$(`#screen-${screenName}`).classList.add("active");

    this.$$(".nav-btn").forEach(button => {
      button.classList.toggle("active", button.dataset.screen === screenName);
    });
  },

  setActiveCategory(type) {
    this.$$(".cat").forEach(button => button.classList.toggle("active", button.dataset.type === type));
  }
};
