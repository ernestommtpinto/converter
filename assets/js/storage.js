const Store = {
  key: "converto_history",

  getHistory() {
    return JSON.parse(localStorage.getItem(this.key) || "[]");
  },

  addHistory(item) {
    const list = this.getHistory();

    if (list[0]?.input === item.input && list[0]?.output === item.output) return;

    list.unshift({
      ...item,
      date: new Date().toLocaleString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit"
      })
    });

    localStorage.setItem(this.key, JSON.stringify(list.slice(0, 30)));
  },

  clearHistory() {
    localStorage.removeItem(this.key);
  }
};
