import type { Provider } from "./types";
import { CasaManriqueProvider } from "./casa-manrique";
import { FerroconsProvider } from "./ferrocons";
import { EasyProvider } from "./easy";
import { SodimacProvider } from "./sodimac";

// Register a supplier here and the comparison engine picks it up automatically.
// No other file needs to change to add a provider.
export const providers: Provider[] = [
  new CasaManriqueProvider(),
  new FerroconsProvider(),
  new EasyProvider(),
  new SodimacProvider(),
];

export function getProviders(): Provider[] {
  return providers.filter((p) => p.enabled);
}

export function listProviderMeta() {
  return providers.map((p) => ({ ...p.meta, enabled: p.enabled }));
}
