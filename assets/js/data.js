const CATEGORIES = [
  {
    id: "currency",
    name: "Moedas",
    subtitle: "Câmbio em tempo real",
    icon: "bi-currency-exchange",
    className: "bg-currency",
    base: "EUR",
    units: {
      EUR: { name: "Euro" },
      USD: { name: "Dólar Americano" },
      GBP: { name: "Libra Esterlina" },
      BRL: { name: "Real Brasileiro" },
      CAD: { name: "Dólar Canadiano" },
      CHF: { name: "Franco Suíço" },
      JPY: { name: "Iene Japonês" },
      AUD: { name: "Dólar Australiano" },
      INR: { name: "Rupia Indiana" }
    }
  },
  {
    id: "length",
    name: "Comprimento",
    subtitle: "Distância e tamanho",
    icon: "bi-rulers",
    className: "bg-length",
    base: "m",
    units: {
      mm: { name: "Milímetro", factor: 0.001 },
      cm: { name: "Centímetro", factor: 0.01 },
      m: { name: "Metro", factor: 1 },
      km: { name: "Quilómetro", factor: 1000 },
      in: { name: "Polegada", factor: 0.0254 },
      ft: { name: "Pé", factor: 0.3048 },
      yd: { name: "Jarda", factor: 0.9144 },
      mi: { name: "Milha", factor: 1609.344 }
    }
  },
  {
    id: "weight",
    name: "Peso",
    subtitle: "Massa e peso",
    icon: "bi-luggage",
    className: "bg-weight",
    base: "kg",
    units: {
      mg: { name: "Miligrama", factor: 0.000001 },
      g: { name: "Grama", factor: 0.001 },
      kg: { name: "Quilograma", factor: 1 },
      t: { name: "Tonelada", factor: 1000 },
      oz: { name: "Onça", factor: 0.028349523125 },
      lb: { name: "Libra", factor: 0.45359237 }
    }
  },
  {
    id: "temperature",
    name: "Temperatura",
    subtitle: "Celsius, Fahrenheit e Kelvin",
    icon: "bi-thermometer-half",
    className: "bg-temperature",
    base: "c",
    units: {
      c: { name: "Celsius" },
      f: { name: "Fahrenheit" },
      k: { name: "Kelvin" }
    }
  },
  {
    id: "area",
    name: "Área",
    subtitle: "Superfícies e espaços",
    icon: "bi-bounding-box",
    className: "bg-area",
    base: "m2",
    units: {
      cm2: { name: "Centímetro quadrado", factor: 0.0001 },
      m2: { name: "Metro quadrado", factor: 1 },
      km2: { name: "Quilómetro quadrado", factor: 1000000 },
      ha: { name: "Hectare", factor: 10000 },
      acre: { name: "Acre", factor: 4046.8564224 }
    }
  }
];
