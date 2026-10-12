class ScenarioContext {
  constructor() {
    this.values = new Map();
  }

  set(key, value) {
    if (typeof key !== 'string' || key.length === 0) {
      throw new TypeError('Scenario context keys must be non-empty strings');
    }
    this.values.set(key, value);
  }

  get(key) {
    return this.values.get(key);
  }
}

module.exports = ScenarioContext;
