/**
 * Tareas típicas de cada etapa de obra. Sirven para que el usuario no arranque
 * de una lista vacía: carga la plantilla y va tildando lo que se hizo.
 * El % de avance de la etapa sale de acá, en vez de tener que estimarlo.
 */
export const TASK_TEMPLATES: Record<string, string[]> = {
  "Movimiento de suelos": [
    "Limpieza y desmalezado del terreno",
    "Replanteo y niveles",
    "Excavación",
    "Compactación",
    "Retiro de material sobrante",
  ],
  Fundaciones: [
    "Excavación de zanjas / pozos",
    "Armadura de hierro colocada",
    "Hormigonado de bases o pilotines",
    "Vigas de fundación",
    "Curado del hormigón",
  ],
  Estructura: [
    "Encofrado de columnas",
    "Armadura de columnas",
    "Hormigonado de columnas",
    "Encofrado de vigas y losa",
    "Armadura de vigas y losa",
    "Hormigonado de losa",
    "Desencofrado",
  ],
  Mampostería: [
    "Muros perimetrales",
    "Muros interiores / tabiques",
    "Dinteles sobre aberturas",
    "Encadenado superior",
    "Cargas y antepechos",
  ],
  Techos: [
    "Estructura de techo",
    "Aislación térmica",
    "Cubierta colocada",
    "Zinguería y desagües",
    "Impermeabilización",
  ],
  Instalaciones: [
    "Cañerías de agua fría y caliente",
    "Desagües cloacales",
    "Desagües pluviales",
    "Cañerías de electricidad",
    "Cableado y tablero",
    "Instalación de gas",
    "Pruebas de hermeticidad",
  ],
  Revoques: [
    "Hidrófugo en muros",
    "Revoque grueso interior",
    "Revoque grueso exterior",
    "Revoque fino interior",
    "Terminación exterior",
  ],
  "Pisos y revestimientos": [
    "Contrapiso",
    "Carpeta niveladora",
    "Colocación de pisos",
    "Revestimientos de baños y cocina",
    "Zócalos",
    "Pastinado",
  ],
  Terminaciones: [
    "Colocación de aberturas",
    "Colocación de artefactos sanitarios",
    "Griferías",
    "Artefactos de iluminación",
    "Pintura interior",
    "Pintura exterior",
    "Limpieza final de obra",
  ],
};

/** Tareas sugeridas para una etapa (vacío si es una etapa personalizada). */
export function tasksFor(rubroName: string): string[] {
  return TASK_TEMPLATES[rubroName] ?? [];
}

/** % de avance a partir de las tareas tildadas. */
export function progressFromTasks(tasks: { done: boolean }[]): number {
  if (tasks.length === 0) return 0;
  return Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100);
}
