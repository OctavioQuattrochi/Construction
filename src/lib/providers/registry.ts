import type { Provider } from "./types";
import { CasaManriqueProvider } from "./casa-manrique";
import { FerroconsProvider } from "./ferrocons";
import { EasyProvider } from "./easy";
import { SodimacProvider } from "./sodimac";
import { CatalogProvider, WooStoreProvider, VtexProvider } from "./generic";

// Helpers de URL de búsqueda por plataforma.
const woo = (base: string) => (q: string) =>
  `${base}/?s=${encodeURIComponent(q)}&post_type=product`;
const presta = (base: string) => (q: string) =>
  `${base}/buscar?controller=search&s=${encodeURIComponent(q)}`;
const tienda = (base: string) => (q: string) =>
  `${base}/?q=${encodeURIComponent(q)}`;
const vtex = (base: string) => (q: string) =>
  `${base}/${encodeURIComponent(q)}?map=ft`;
const generic = (base: string) => (q: string) =>
  `${base}/?s=${encodeURIComponent(q)}`;

// Proveedores adicionales de Córdoba/Argentina.
const merlino = new VtexProvider(
  { id: "merlino", name: "Merlino", website: "https://www.merlinosrl.com.ar", region: "Córdoba", logoColor: "#e74c3c" },
  { priceFactor: 1.0, searchUrl: vtex("https://www.merlinosrl.com.ar") }
);

const deDiego = new WooStoreProvider(
  { id: "de-diego", name: "De Diego", website: "https://dediegosrl.com", region: "Córdoba", logoColor: "#2980b9" },
  { priceFactor: 0.99, searchUrl: woo("https://dediegosrl.com") }
);

const misLadrillos = new CatalogProvider(
  { id: "mis-ladrillos", name: "Corralón Mis Ladrillos", website: "https://corralonmisladrillos.com", region: "Córdoba", logoColor: "#b03a2e" },
  { priceFactor: 0.96, searchUrl: woo("https://corralonmisladrillos.com") }
);
const zarate = new CatalogProvider(
  { id: "zarate", name: "Zárate Materiales", website: "https://zaratemateriales.com.ar", region: "Córdoba", logoColor: "#2e86c1" },
  { priceFactor: 1.01, searchUrl: presta("https://zaratemateriales.com.ar") }
);
const darsie = new CatalogProvider(
  { id: "darsie", name: "Darsie", website: "https://darsie.com", region: "Córdoba", logoColor: "#d35400" },
  { priceFactor: 1.02, searchUrl: generic("https://darsie.com") }
);
const sanMiguel = new CatalogProvider(
  { id: "san-miguel", name: "Corralón San Miguel", website: "https://corralonsanmiguel.com", region: "Córdoba", logoColor: "#16a085" },
  { priceFactor: 0.98, searchUrl: presta("https://corralonsanmiguel.com") }
);
const palmarSur = new CatalogProvider(
  { id: "palmar-sur", name: "Palmar Sur", website: "https://palmar-sur.com", region: "Córdoba", logoColor: "#27ae60" },
  { priceFactor: 0.97, searchUrl: generic("https://palmar-sur.com") }
);
const disensa = new CatalogProvider(
  { id: "disensa", name: "Disensa", website: "https://www.disensa.com.ar", region: "Nacional", logoColor: "#e67e22" },
  { priceFactor: 1.03, searchUrl: (q) => `https://www.disensa.com.ar/${encodeURIComponent(q)}` }
);
const laObra = new CatalogProvider(
  { id: "la-obra", name: "La Obra Ferretería", website: "https://laobraferreteria.com", region: "Córdoba", logoColor: "#8e44ad" },
  { priceFactor: 1.05, searchUrl: tienda("https://laobraferreteria.com") }
);
const maconta = new CatalogProvider(
  { id: "maconta", name: "Maconta", website: "https://maconta.com.ar", region: "Córdoba", logoColor: "#7f8c8d" },
  { priceFactor: 1.04, searchUrl: tienda("https://maconta.com.ar") }
);
const bergese = new CatalogProvider(
  { id: "bergese", name: "Corralón Bergese Hnos.", website: "https://corralonbergesehnos.com", region: "Córdoba", logoColor: "#34495e" },
  { priceFactor: 0.97, searchUrl: generic("https://corralonbergesehnos.com") }
);
const ferretti = new CatalogProvider(
  { id: "ferretti", name: "Ferretti Materiales", website: "https://ferrettimateriales.com", region: "Río Cuarto", logoColor: "#af601a" },
  { priceFactor: 1.0, searchUrl: generic("https://ferrettimateriales.com") }
);

// Registrá un proveedor acá y el motor lo toma automáticamente.
export const providers: Provider[] = [
  new CasaManriqueProvider(),
  new FerroconsProvider(),
  new EasyProvider(),
  new SodimacProvider(),
  merlino,
  deDiego,
  misLadrillos,
  zarate,
  darsie,
  sanMiguel,
  palmarSur,
  disensa,
  laObra,
  maconta,
  bergese,
  ferretti,
];

export function getProviders(): Provider[] {
  return providers.filter((p) => p.enabled);
}

export function listProviderMeta() {
  return providers.map((p) => ({ ...p.meta, enabled: p.enabled }));
}
