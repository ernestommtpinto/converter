const CATEGORIES = [
  {
    id: "currency", name: "Currency", subtitle: "Exchange rates", icon: "bi-currency-exchange", className: "bg-currency", base: "EUR",
    units: {
      EUR: { name: "Euro" }, USD: { name: "US Dollar" }, GBP: { name: "British Pound" },
      BRL: { name: "Brazilian Real" }, CAD: { name: "Canadian Dollar" }, CHF: { name: "Swiss Franc" },
      JPY: { name: "Japanese Yen" }, AUD: { name: "Australian Dollar" }, INR: { name: "Indian Rupee" }
    }
  },
  {
    id: "length", name: "Length", subtitle: "Distance and size", icon: "bi-rulers", className: "bg-length", base: "m",
    units: {
      mm: { name: "Millimetre", factor: 0.001 }, cm: { name: "Centimetre", factor: 0.01 },
      dm: { name: "Decimetre", factor: 0.1 }, m: { name: "Metre", factor: 1 },
      km: { name: "Kilometre", factor: 1000 }, in: { name: "Inches", factor: 0.0254 },
      ft: { name: "Feet", factor: 0.3048 }, yd: { name: "Yards", factor: 0.9144 },
      mi: { name: "Miles", factor: 1609.344 }, nmi: { name: "Nautical Mile", factor: 1852 }
    }
  },
  {
    id: "weight", name: "Weight", subtitle: "Mass units", icon: "bi-luggage", className: "bg-weight", base: "kg",
    units: {
      mg: { name: "Milligram", factor: 0.000001 }, g: { name: "Gram", factor: 0.001 },
      kg: { name: "Kilogram", factor: 1 }, t: { name: "Tonne", factor: 1000 },
      oz: { name: "Ounce", factor: 0.028349523125 }, lb: { name: "Pound", factor: 0.45359237 }
    }
  },
  {
    id: "temperature", name: "Temperature", subtitle: "Heat scales", icon: "bi-thermometer-half", className: "bg-temperature", base: "c",
    units: { c: { name: "Celsius" }, f: { name: "Fahrenheit" }, k: { name: "Kelvin" } }
  },
  {
    id: "area", name: "Area", subtitle: "Surface units", icon: "bi-bounding-box", className: "bg-area", base: "m2",
    units: {
      mm2: { name: "Square Millimetre", factor: 0.000001 }, cm2: { name: "Square Centimetre", factor: 0.0001 },
      m2: { name: "Square Metre", factor: 1 }, km2: { name: "Square Kilometre", factor: 1000000 },
      ha: { name: "Hectare", factor: 10000 }, acre: { name: "Acre", factor: 4046.8564224 }
    }
  }
];
