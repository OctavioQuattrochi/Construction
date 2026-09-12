/**
 * Contenido del Centro de Conocimiento.
 *
 * Los artículos viven acá (y no incrustados en seed.ts) porque son contenido
 * largo que se edita seguido: separarlos mantiene el seed legible.
 *
 * Criterio de redacción: escrito para quien construye en Córdoba/Argentina,
 * con terminología local, decisiones concretas y las razones detrás de cada
 * recomendación. Nada de relleno.
 *
 * El tiempo de lectura NO se declara acá: lo calcula el seed desde el texto
 * (readingTime), así nunca puede quedar inflado respecto del contenido real.
 */
export const articles = [
  {
    title: "Cómo elegir el cemento correcto para cada parte de tu obra",
    slug: "elegir-cemento-correcto",
    excerpt:
      "No todos los cementos sirven para lo mismo. Te explicamos las diferencias entre CPC, CPN y CPF, qué significa el número que va al lado y cuándo usar cada uno.",
    categorySlug: "materiales",
    coverImage:
      "https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?auto=format&fit=crop&w=1400&q=80",
    tags: "cemento,materiales,estructura,hormigón",
    featured: true,
    content: `## El error que se paga caro

Uno de los errores más comunes en obra es pedir "una bolsa de cemento" sin mirar qué dice la etiqueta. En Argentina conviven varios tipos y cada uno está pensado para un uso distinto. Usar el equivocado no siempre se nota el primer día: se nota dos años después, cuando aparece una fisura en una viga o un contrapiso se levanta.

La buena noticia es que entender la etiqueta lleva cinco minutos y evita problemas que después cuestan cientos de miles de pesos en reparaciones.

## Cómo leer la bolsa

En la bolsa vas a encontrar una sigla y un número. Por ejemplo: **CPC40** o **CPN50**.

- **La sigla** te dice el tipo de cemento, es decir, con qué se mezcló el clínker.
- **El número** es la resistencia característica a los 28 días, en megapascales (MPa). Un CPC40 alcanza al menos 40 MPa de resistencia a compresión a los 28 días.

También vas a ver la fecha de fabricación. Guardala en la memoria: es tan importante como el tipo.

### Los tres tipos que vas a encontrar

**CPC — Cemento Portland Compuesto**

Es el más usado en obra general en Argentina y el que vas a encontrar en cualquier corralón. Lleva clínker más una combinación de adiciones (escoria, puzolana, filler calcáreo). Tiene muy buena relación entre costo y desempeño, desarrolla resistencia de forma progresiva y genera menos calor de hidratación que un portland normal, lo que ayuda en volúmenes grandes.

*Usalo para:* estructuras en general, mampostería, revoques, contrapisos. Es el caballo de batalla de la obra.

**CPN — Cemento Portland Normal**

Es el más "puro": clínker y yeso, con muy pocas adiciones. Desarrolla resistencia inicial más rápido, lo que sirve cuando necesitás desencofrar antes o cuando hacés frío y el fragüe se ralentiza.

*Usalo para:* estructuras exigentes, premoldeados, hormigones de alta resistencia, y cuando el cronograma de desencofrado es ajustado.

**CPF — Cemento Portland con Filler**

Lleva una proporción mayor de filler calcáreo. Es el más económico y rinde bien donde no hay responsabilidad estructural.

*Usalo para:* contrapisos, carpetas, rellenos, trabajos no estructurales.

*No lo uses para:* columnas, vigas, losas ni ningún elemento que trabaje a compresión o flexión.

## Recomendación práctica por elemento

| Elemento | Cemento sugerido |
|---|---|
| Bases, columnas, vigas, losas | CPC40 o CPN40 |
| Mampostería (mezcla de asiento) | CPC30/40 + cal |
| Revoque grueso | CPC + cal, o cemento de albañilería |
| Contrapiso | CPF o CPC30 |
| Carpeta | CPC30/40 |
| Premoldeados / desencofrado rápido | CPN |

> **Regla de oro:** si el elemento sostiene algo, no ahorres en el cemento. La diferencia entre un CPF y un CPC en una losa son unos pocos miles de pesos por bolsa; la diferencia en una reparación estructural son millones.

## La fecha de fabricación importa más de lo que creés

El cemento es higroscópico: absorbe humedad del aire. A medida que pasa el tiempo, va reaccionando con la humedad ambiente y pierde capacidad de desarrollar resistencia.

- **Hasta 30 días:** ideal.
- **30 a 60 días:** aceptable si estuvo bien almacenado.
- **Más de 60 días:** empezá a desconfiar.
- **Bolsa dura, apelmazada, con grumos que no se deshacen con la mano:** no la uses en nada estructural.

Una prueba de campo simple: meté la mano en la bolsa abierta. El cemento sano se siente suelto y frío, y los grumos se deshacen con solo apretarlos. Si encontrás terrones duros como piedra, ese cemento ya reaccionó.

## Cómo guardarlo para que no se arruine

Esto es lo más barato que podés hacer para no tirar plata:

1. **Sobre pallets**, nunca apoyado directo en el piso. El contrapiso transmite humedad por capilaridad.
2. **Separado de las paredes** al menos 20 cm, sobre todo si son muros exteriores.
3. **Cubierto con film o lona**, incluso bajo techo. La humedad ambiente de Córdoba en verano es suficiente para arruinar bolsas en pocas semanas.
4. **Máximo 10 bolsas apiladas.** El peso compacta las de abajo y acelera el apelmazamiento.
5. **Primero entra, primero sale.** Usá siempre las bolsas más viejas.

## Cuánto cemento vas a necesitar

Depende de qué estés haciendo y de la dosificación. Como referencia rápida para hormigón elaborado en obra:

- **H-17 (contrapisos, pisos):** ~300 kg de cemento por m³ → 6 bolsas por m³.
- **H-21 (uso estructural general):** ~350 kg por m³ → 7 bolsas por m³.
- **H-30 (estructuras exigentes):** ~400 kg por m³ → 8 bolsas por m³.

Para mampostería con ladrillo común, calculá aproximadamente 1 bolsa cada 3 m² de muro de 15 cm.

Si querés el número exacto para tu caso, la [calculadora de materiales](/calculadoras) hace la cuenta con las dosificaciones estándar y te dice cuántas bolsas, cuánta arena y cuánto agregado necesitás.

## Un comentario sobre el hormigón elaborado

Si tu obra necesita más de 3 o 4 m³ de hormigón en una sola tirada —una losa, una platea— casi siempre conviene comprarlo elaborado y que llegue en camión.

No es solo comodidad. El hormigón elaborado viene con dosificación controlada, agregados lavados y granulometría verificada, y podés pedir el remito con la resistencia especificada. Hacer 5 m³ a pala en obra, con arena que no sabés bien de dónde salió, es la receta clásica para un hormigón que en el papel es H-21 y en la realidad no llega a H-13.

Pedí siempre el **remito** y guardalo. Es tu respaldo si algo falla.

## En resumen

- Mirá la sigla y el número antes de comprar.
- **CPC** para casi todo, **CPN** cuando necesitás resistencia inicial, **CPF** solo para lo no estructural.
- Revisá la fecha de fabricación: más de 60 días, sospechá.
- Guardalo sobre pallets, separado de la pared y tapado.
- Para volúmenes grandes, hormigón elaborado con remito.

Si tenés dudas sobre qué usar en un elemento puntual de tu obra, [consultanos](/contacto): es el tipo de decisión donde una respuesta de dos minutos te ahorra un problema de años.`,
  },
  {
    title: "Humedad en paredes: causas reales y cómo resolverla de raíz",
    slug: "humedad-en-paredes-soluciones",
    excerpt:
      "La humedad no se tapa con pintura. Aprendé a identificar si es ascendente, de filtración o de condensación, y cuál es la solución real para cada una.",
    categorySlug: "impermeabilizacion",
    coverImage:
      "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?auto=format&fit=crop&w=1400&q=80",
    tags: "humedad,impermeabilización,patologías,revoque",
    featured: true,
    content: `## Pintar la mancha es tirar la plata

Es la escena más repetida en cualquier casa de Córdoba: aparece una mancha, se compra pintura "antihumedad", se pinta, y a los cuatro meses la mancha volvió más grande.

El problema es simple: la pintura es una terminación, no una solución. Si el agua sigue llegando a la pared, va a volver a salir. Lo primero, siempre, es identificar **de dónde viene el agua**. Hay tres tipos de humedad y cada uno tiene una causa y una solución completamente distintas.

## 1. Humedad ascendente

### Cómo la reconocés

- Aparece en la **parte baja** de la pared, desde el zócalo hacia arriba.
- Llega hasta una altura relativamente pareja, normalmente entre 40 cm y 1,20 m.
- La pintura se ampolla y el revoque se desgrana como si fuera arena.
- Suelen aparecer **eflorescencias**: un polvillo blanco, salitroso, que es la sal que el agua arrastró desde el suelo.
- Empeora en épocas de lluvia y no depende de que llueva ese día.

### Por qué pasa

El agua del suelo sube por los poros del muro por capilaridad, igual que el café sube por un terrón de azúcar. Pasa cuando la **capa aisladora horizontal** (el "cajón hidrófugo" sobre el cimiento) no se hizo, se hizo mal, o se cortó con el tiempo.

En construcciones anteriores a los años 60 es directamente habitual que no exista.

### Cómo se resuelve de verdad

**Opción A — Barrera química (la más usada hoy)**

Se perfora la pared en la base, cada 10-12 cm, con una inclinación de unos 30°, y se inyecta un producto a base de silanos/siloxanos que forma una barrera impermeable dentro del muro.

- No requiere romper la estructura.
- Se puede hacer con la casa habitada.
- Es la opción razonable en la mayoría de los casos.

**Opción B — Corte físico**

Se corta el muro por tramos y se inserta una lámina impermeable. Es más invasivo y caro, y se reserva para muros muy deteriorados.

**Siempre, además:** hay que **picar el revoque afectado** hasta unos 50 cm por encima de donde llega la mancha, dejar secar el muro (semanas, no días) y rehacer el revoque con hidrófugo en la mezcla.

> Si hacés la barrera pero no picás el revoque, la sal que ya quedó adentro va a seguir arruinando la pintura durante años.

## 2. Humedad de filtración

### Cómo la reconocés

- Aparece en **manchas localizadas**, no en una franja pareja.
- Se relaciona directamente con la lluvia: aparece o empeora cuando llueve.
- Puede estar en cualquier altura de la pared, incluso en el techo.
- Frecuente en muros que dan al exterior, bajo ventanas, en encuentros de techo y pared, y cerca de bajadas pluviales.

### Por qué pasa

El agua entra desde afuera por una falla concreta: un revoque exterior fisurado, una membrana vencida, una zinguería mal resuelta, un premarco sin sellar, una junta de dilatación abierta, un caño perdiendo.

### Cómo se resuelve

Acá no hay receta única: **hay que encontrar el punto de entrada**. Y suele no estar donde aparece la mancha, porque el agua corre por dentro del muro antes de salir.

Lugares para revisar, en orden de probabilidad:

1. **Encuentro de techo y pared.** Es el número uno. Membrana mal terminada o babeta inexistente.
2. **Debajo de ventanas.** Falta de goterón o alféizar sin pendiente hacia afuera.
3. **Perímetro de aberturas.** Sellado vencido entre el marco y la mampostería.
4. **Fisuras en el revoque exterior.** Una fisura de 0,3 mm alcanza para que entre agua.
5. **Bajadas pluviales y canaletas.** Rotas, desbordadas o descargando contra el muro.
6. **Cañerías embutidas.** Si la mancha no depende de la lluvia, sospechá de una pérdida.

Una vez identificado el punto: reparar **ahí**, y recién después reparar la cara interior.

## 3. Humedad de condensación

### Cómo la reconocés

- Aparece en **invierno**, y mejora sola en verano.
- Se concentra en las **esquinas**, detrás de muebles, en el encuentro de muros exteriores, y sobre todo en baños y cocinas.
- Aparece **moho negro** en puntos, más que manchas de agua.
- Los vidrios amanecen empañados o directamente chorreando.

### Por qué pasa

No entra agua desde ningún lado: el agua **ya está adentro**, en forma de vapor. La generamos nosotros al cocinar, bañarnos, secar ropa y respirar. Cuando ese vapor toca una superficie fría —un muro exterior sin aislación, un puente térmico— se condensa y se vuelve líquido.

Es un problema de **aislación y ventilación**, no de impermeabilización. Por eso ningún producto impermeabilizante lo resuelve.

### Cómo se resuelve

**Ventilar** (lo más barato y lo más efectivo)
- 10 minutos de ventilación cruzada por la mañana bajan muchísimo la humedad interior.
- Extractor en el baño, y usarlo durante y después de bañarse.
- No secar ropa adentro sin ventilación.

**Calefaccionar de forma pareja.** Las casas que se calientan solo un rato y solo en un ambiente condensan más: los muros quedan fríos y son la superficie donde el vapor elige condensarse.

**Aislar térmicamente.** Es la solución de fondo. Aislación en cubierta (donde más se pierde), y si es posible aislación en muros exteriores. Además de eliminar la condensación, baja la factura de gas.

**Eliminar puentes térmicos.** Vigas y columnas de hormigón que atraviesan el muro son más frías que el resto: son el lugar clásico donde aparece el moho en línea recta.

## Tabla rápida de diagnóstico

| Señal | Ascendente | Filtración | Condensación |
|---|---|---|---|
| Franja pareja desde el zócalo | ✓ | | |
| Mancha localizada | | ✓ | |
| Empeora cuando llueve | parcial | ✓ | |
| Empeora en invierno | | | ✓ |
| Polvillo blanco (salitre) | ✓ | a veces | |
| Moho negro en esquinas | | | ✓ |
| Vidrios empañados | | | ✓ |

## Lo que no funciona (aunque te lo vendan)

- **Pintura antihumedad sobre humedad activa.** Sella la cara interior; el agua se acumula atrás y termina desprendiendo el revoque completo.
- **Revoque impermeable sobre humedad ascendente sin barrera.** El agua sube más alto hasta encontrar por dónde salir.
- **Membrana líquida en interiores.** No ataca ninguna de las tres causas.
- **Deshumidificador como solución permanente** para condensación. Ayuda, pero es tratar el síntoma.

## Cuándo llamar a un profesional

Llamá si:
- La humedad afecta elementos estructurales (vigas, columnas, losa).
- Hay fisuras junto a la humedad.
- Ya intentaste una reparación y volvió.
- Vas a comprar la propiedad y querés saber a qué te estás exponiendo.

Un diagnóstico equivocado no es solo plata perdida en la reparación: es plata perdida **y** el problema sigue avanzando. En [inspección y diagnóstico](/contacto) identificamos la causa real antes de que rompas nada.`,
  },
  {
    title: "Fundaciones: por qué el estudio de suelo no es un gasto opcional",
    slug: "fundaciones-y-estudio-de-suelo",
    excerpt:
      "Zapatas, pilotines o platea: la decisión no se toma por costumbre ni por lo que hizo el vecino. Se toma sabiendo qué hay abajo.",
    categorySlug: "estructura",
    coverImage:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80",
    tags: "fundaciones,estudio de suelo,estructura,hormigón",
    featured: false,
    content: `## Lo único que no se puede arreglar después

En una obra casi todo tiene arreglo. Un revoque se pica y se rehace. Una instalación se vuelve a pasar. Un piso se levanta. Pero la fundación queda abajo de todo, cargando la casa entera, y cuando falla no hay reparación barata: hay recalce, submuración, y a veces demolición.

Por eso es el único rubro donde ahorrar es sistemáticamente mal negocio. Y sin embargo es donde más se improvisa.

## Qué hace realmente una fundación

La fundación tiene un trabajo simple de enunciar: **repartir el peso de la casa sobre el suelo** de manera que el suelo pueda soportarlo sin hundirse de forma despareja.

Las dos palabras clave son *repartir* y *despareja*.

- Si el suelo no soporta la carga, la casa **asienta**.
- Si asienta parejo, muchas veces no pasa nada grave.
- Si asienta **despareja** —un sector más que otro—, la estructura se deforma y aparecen fisuras diagonales, puertas que no cierran y, en casos serios, riesgo estructural.

El asentamiento diferencial es el enemigo real.

## Por qué el suelo de Córdoba merece atención

Buena parte de Córdoba tiene suelo **loéssico**: un limo fino, de origen eólico, que en estado seco parece firme y confiable. El problema es que muchos de estos suelos son **colapsables**: cuando se saturan de agua, su estructura interna se desmorona y pierden volumen de golpe.

Eso explica una escena típica: una casa que estuvo diez años perfecta y de pronto, después de un verano de lluvias intensas o de una pérdida de agua no detectada, empieza a fisurarse.

No es que la casa "se movió". Es que el suelo debajo colapsó al mojarse.

Esto convierte dos cosas en críticas en Córdoba:
1. **Saber qué suelo tenés** antes de decidir la fundación.
2. **Que el agua no llegue nunca al suelo de fundación**: desagües bien resueltos, veredas perimetrales con pendiente, cañerías sin pérdidas.

## El estudio de suelo: qué es y cuánto cuesta

Un estudio de suelo consiste en hacer perforaciones en el terreno, extraer muestras a distintas profundidades y ensayarlas en laboratorio. El informe te dice:

- El perfil del suelo capa por capa.
- La **tensión admisible** (cuánta carga soporta, en kg/cm²) a cada profundidad.
- La profundidad recomendada de fundación.
- Presencia de napa freática.
- Si el suelo es colapsable o expansivo.
- El tipo de fundación recomendado.

**Cuánto cuesta:** para una vivienda unifamiliar, típicamente entre el **0,2% y el 0,5% del costo total de la obra**. Es de los ítems más baratos del presupuesto.

**Cuánto cuesta no hacerlo:** un recalce de fundaciones en una casa ya construida puede superar el 15% del valor de la obra, con la casa inhabitable durante el trabajo.

La cuenta se hace sola.

## Los tres tipos de fundación que vas a evaluar

### Zapatas corridas

Una franja continua de hormigón armado debajo de los muros portantes.

- **Cuándo:** suelo firme a poca profundidad, vivienda de una o dos plantas con muros portantes.
- **Ventaja:** económica y simple de ejecutar.
- **Límite:** no sirve si el estrato resistente está profundo.

### Bases aisladas y pilotines

Bases puntuales bajo cada columna, o pilotines (perforaciones rellenas de hormigón armado) que bajan hasta el estrato resistente, vinculados por vigas de fundación.

- **Cuándo:** estructura independiente de hormigón, o suelo superficial flojo con estrato firme más abajo.
- **Ventaja:** atraviesan el suelo malo y apoyan donde el suelo sirve.
- **Clave:** las **vigas de encadenado inferior** que unen las bases no son opcionales. Son las que hacen que la estructura trabaje en conjunto.

### Platea de fundación

Una losa de hormigón armado bajo toda la superficie de la casa.

- **Cuándo:** suelo de baja capacidad portante y relativamente uniforme, o cuando se busca rapidez de ejecución.
- **Ventaja:** reparte la carga sobre toda la superficie, lo que reduce mucho la presión sobre el suelo, y resiste bien los asentamientos diferenciales.
- **Atención:** requiere una base de apoyo bien preparada y compactada, y armadura calculada. Una platea mal armada es una losa fisurada de punta a punta.

## Errores que se repiten

**1. Copiar la fundación del vecino.** Dos lotes linderos pueden tener perfiles distintos, sobre todo si uno fue relleno. El suelo no respeta las medianeras.

**2. Fundar sobre relleno.** Muchos lotes urbanos tienen relleno de nivelación en el primer metro. El relleno no es suelo natural y no tiene capacidad portante confiable. Hay que **atravesarlo** y apoyar en terreno natural.

**3. Fundar demasiado superficial.** La primera capa de suelo cambia de volumen con la humedad y la temperatura. Como criterio general, no fundar a menos de **1 metro** de profundidad, y siempre por debajo de la capa activa.

**4. Hormigonar contra tierra suelta.** La excavación tiene que estar limpia, sin tierra desmoronada en el fondo. Ese material suelto se comprime y genera asentamiento.

**5. Olvidar el encadenado inferior.** Sin vigas que vinculen las bases, cada base trabaja sola y cualquier diferencia de asentamiento se traduce en fisuras.

**6. Armadura sin recubrimiento.** El hierro tiene que quedar separado del suelo por al menos 5 cm de hormigón (usá separadores, no piedritas). Sin ese recubrimiento el hierro se oxida, se expande y revienta el hormigón desde adentro.

## Señales de que una fundación está fallando

Si ya tenés la casa construida, estas son las señales a las que prestar atención:

- **Fisuras diagonales** que arrancan en las esquinas de puertas y ventanas.
- Fisuras que **atraviesan** el muro (se ven de los dos lados).
- Fisuras **más anchas en un extremo** que en el otro.
- Puertas y ventanas que dejaron de cerrar.
- Pisos que perdieron el nivel.
- Separación entre el muro y el contrapiso.

Una fisura fina, vertical y estable suele ser retracción del revoque y no es grave. Una fisura diagonal, pasante y que **crece con el tiempo** es otra cosa y requiere evaluación profesional.

Un truco de campo para saber si está activa: pegá un testigo de yeso cruzando la fisura y marcá la fecha. Si el testigo se corta en las semanas siguientes, la fisura sigue moviéndose.

## En resumen

- El estudio de suelo cuesta menos del 0,5% de la obra y define el rubro que no se puede arreglar.
- En Córdoba, el suelo loéssico colapsable hace que el manejo del agua sea tan importante como la fundación misma.
- Zapatas, pilotines o platea: la elección la define el informe de suelo, no la costumbre.
- Encadenado inferior, recubrimiento de armadura y excavación limpia no son detalles.

Si estás por arrancar y tenés dudas sobre qué fundación corresponde en tu terreno, es exactamente el momento de [consultar](/contacto). Después de hormigonar, las opciones se reducen mucho.`,
  },
  {
    title: "Ladrillo hueco, ladrillo común o bloque de hormigón: cuál conviene",
    slug: "ladrillo-hueco-vs-bloque-hormigon",
    excerpt:
      "Comparamos los tres cerramientos más usados en Córdoba por costo, aislación, peso, velocidad de ejecución y en qué caso conviene cada uno.",
    categorySlug: "materiales",
    coverImage:
      "https://images.unsplash.com/photo-1590986601464-2fc3f21acdc0?auto=format&fit=crop&w=1400&q=80",
    tags: "ladrillo,bloque,mampostería,materiales,aislación",
    featured: false,
    content: `## No hay un ganador absoluto

La pregunta "¿qué es mejor, ladrillo o bloque?" no tiene una respuesta única, porque cada uno gana en una categoría distinta. Lo que sí se puede hacer es entender en qué gana cada uno y elegir según lo que tu obra necesita.

Vamos a comparar los tres cerramientos más usados en Córdoba.

## Ladrillo común (macizo)

El ladrillo de tierra cocida de toda la vida, hecho en cortadas de la zona.

**A favor**
- **Masa térmica alta:** acumula calor y lo devuelve con retraso. En el clima de Córdoba, con amplitud térmica grande entre día y noche, esto se siente: la casa se mantiene más estable.
- Muy buena adherencia con el revoque.
- Permite amurar en cualquier punto sin tacos especiales.
- Excelente comportamiento acústico.
- Si viene de una cortada local, el costo de flete es bajo.

**En contra**
- **Es lento.** Piezas chicas, muchas juntas, mucha mano de obra.
- **Consume mucha mezcla.**
- **Pesa mucho**, lo que carga más la estructura y la fundación.
- Calidad variable entre cortadas: dimensiones desparejas y resistencia irregular.
- Por sí solo no aísla bien: para cumplir exigencias térmicas necesita muro doble o aislación agregada.

**Conviene cuando:** buscás masa térmica e inercia, hay buena provisión local, o el proyecto lo pide por estética (ladrillo a la vista).

## Ladrillo hueco cerámico

El bloque cerámico con perforaciones, en espesores de 8, 12 y 18 cm.

**A favor**
- **Rápido de colocar:** piezas grandes, menos juntas.
- **Liviano:** menos carga sobre estructura y fundación.
- **Mejor aislación térmica** que el macizo gracias a las cámaras de aire.
- Consumo de mezcla bajo.
- Buena relación costo/m² de muro terminado.

**En contra**
- **No es portante** en las versiones comunes: necesita estructura independiente de hormigón.
- Amurar requiere tacos especiales o brocas sin percusión; colgar un mueble pesado exige previsión.
- Se rompe con facilidad en obra si se lo maltrata.
- Las paredes de 8 cm transmiten bastante sonido.

**Conviene cuando:** tenés estructura independiente y querés cerrar rápido con buen comportamiento térmico. Es el más elegido hoy en vivienda en Córdoba.

## Bloque de hormigón

Bloques de 13, 19 y 20 cm, huecos, que pueden ir armados y llenos.

**A favor**
- **Puede ser portante** si se arma y se llena: en viviendas de una planta permite prescindir de estructura tradicional.
- **Muy rápido:** pieza grande, modulación clara.
- Dimensiones **precisas y regulares**, lo que reduce el espesor de revoque.
- Permite pasar instalaciones por los huecos verticales sin canaletear.
- Buen costo por m² de muro.

**En contra**
- **Aislación térmica pobre** si el hueco queda vacío y sin aislación. Es su punto débil.
- **Alta retracción por fragüe:** si se coloca un bloque "verde" (recién hecho), aparecen fisuras. Exigí bloques con al menos 28 días de curado.
- Superficie poco absorbente: requiere buena preparación para que agarre el revoque.
- Necesita más control de ejecución (armaduras, llenado de huecos).

**Conviene cuando:** buscás velocidad y economía, o querés muro portante armado en una planta. Siempre resolviendo la aislación aparte.

## Tabla comparativa

| Criterio | Común | Hueco cerámico | Bloque hormigón |
|---|---|---|---|
| Velocidad de ejecución | Baja | Alta | Muy alta |
| Costo por m² de muro | Medio | Medio | Bajo |
| Aislación térmica | Media | Buena | Baja |
| Aislación acústica | Muy buena | Media | Media |
| Masa térmica / inercia | Muy alta | Media | Media |
| Peso sobre estructura | Alto | Bajo | Medio |
| Puede ser portante | Sí | No (común) | Sí (armado) |
| Facilidad para amurar | Muy fácil | Requiere tacos | Media |
| Consumo de mezcla | Alto | Bajo | Bajo |

## El error de comparar solo el precio del ladrillo

Es la trampa clásica. El precio por unidad no te dice nada: lo que importa es el **costo del metro cuadrado de muro terminado**, que incluye:

1. Cantidad de piezas por m².
2. Mezcla de asiento consumida.
3. **Mano de obra** (suele ser el rubro más grande).
4. Espesor de revoque necesario.
5. Aislación adicional si hace falta.

Un ladrillo común más barato por unidad puede terminar siendo el muro más caro, porque necesita el triple de piezas, el doble de mezcla y bastante más jornal.

Para hacer esta cuenta con precios reales de proveedores de Córdoba, podés usar el [comparador de precios](/comparador) y la [calculadora de mampostería](/calculadoras), que te dice cuántas piezas y cuánta mezcla necesitás por m².

## Sobre la aislación térmica: lo que casi nadie considera

Ninguno de los tres, solo, da un muro térmicamente bueno para los estándares actuales.

Las soluciones habituales:
- **Muro doble con cámara de aire** (y mejor aún, con aislante dentro de la cámara).
- **EIFS / aislación exterior** con placas de EPS y revoque sobre malla.
- **Bloques con aislante inyectado** en los huecos.

La aislación en cubierta es todavía más importante que la de muros: por el techo se va la mayor parte del calor. Si el presupuesto obliga a elegir, aislá el techo primero.

## Recomendación práctica

- **Vivienda con estructura de hormigón, foco en velocidad y confort:** ladrillo hueco cerámico de 18.
- **Presupuesto ajustado, una planta, querés portante:** bloque de hormigón armado, resolviendo aislación aparte.
- **Buscás inercia térmica, aislación acústica o ladrillo a la vista:** ladrillo común, idealmente en muro doble.

Y en los tres casos: **exigí material curado**, verificá dimensiones al recibir y no aceptes piezas rotas más allá de un porcentaje razonable.`,
  },
  {
    title: "Impermeabilización de techos: qué sistema elegir y cada cuánto mantenerlo",
    slug: "impermeabilizacion-de-techos",
    excerpt:
      "Membrana asfáltica, membrana líquida o poliuretano proyectado. Qué dura cada uno, cuánto sale y cuál es el error que arruina cualquier sistema.",
    categorySlug: "impermeabilizacion",
    coverImage:
      "https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=1400&q=80",
    tags: "impermeabilización,techos,membrana,humedad,mantenimiento",
    featured: false,
    content: `## El techo es donde más barato se previene y más caro se repara

Una filtración de techo no se queda en el techo. Moja la losa, arruina el cielorraso, baja por los muros, ataca las instalaciones eléctricas y, si persiste, corroe la armadura de la losa. Lo que empezó como una membrana vencida de bajo costo termina en una reparación estructural.

La buena noticia: la impermeabilización es uno de los pocos rubros donde el mantenimiento preventivo es barato, simple y funciona.

## Lo primero: la pendiente

Antes de hablar de productos, hay que hablar de **pendiente**, porque es el error que arruina cualquier sistema por bueno que sea.

**Ningún impermeabilizante está diseñado para tener agua encima de forma permanente.** Todos asumen que el agua escurre.

- Pendiente mínima recomendada en losa plana: **1,5% a 2%** (1,5 a 2 cm por metro).
- Hacia desagües correctamente ubicados y dimensionados.
- Sin zonas donde el agua quede estancada.

Si después de una lluvia quedan charcos en tu techo que tardan horas en irse, ahí vas a tener la próxima filtración, sin importar qué membrana pusiste. La pendiente se corrige con una **carpeta de pendiente** antes de impermeabilizar.

> Diagnóstico casero: subí al techo el día después de una lluvia. Donde veas agua acumulada o la marca de suciedad que deja el charco al secarse, tenés un problema de pendiente.

## Los sistemas más usados

### Membrana asfáltica en rollo

La clásica: rollos de asfalto modificado con armadura de poliéster, con terminación en aluminio (geotextil aluminizado) o para pintar.

**Duración esperada:** 5 a 10 años según calidad, espesor y exposición. Las de 4 mm con buen film de aluminio están en el extremo alto; las económicas de 3 mm, en el bajo.

**A favor**
- Espesor uniforme y garantizado por fábrica.
- Buena resistencia mecánica.
- Costo por m² competitivo.
- El aluminio refleja radiación y baja la temperatura de la losa.

**En contra**
- Las **uniones son el punto débil**: dependen de la mano de obra con soplete.
- Requiere solape correcto (mínimo 10 cm) y babetas bien resueltas en los encuentros.
- Si se aplica sobre superficie sucia o húmeda, no adhiere.

**Clave de ejecución:** imprimación asfáltica previa, superficie limpia y seca, solapes sellados, y subir la membrana por los muros al menos **20-30 cm** rematando en una babeta.

### Membrana líquida (acrílica o poliuretánica)

Se aplica con rodillo o pincel, en varias manos, formando un film continuo.

**Duración esperada:** 3 a 5 años las acrílicas comunes; 5 a 8 las poliuretánicas de calidad.

**A favor**
- **Sin uniones:** es un manto continuo, lo que elimina el punto débil de los rollos.
- Se adapta perfecto a formas complejas, chimeneas, caños, encuentros.
- Fácil de aplicar y de reparar.
- Ideal para **mantenimiento** sobre membrana existente en buen estado.

**En contra**
- El espesor depende del aplicador: es fácil quedarse corto. Hay que respetar el rendimiento en litros/m² que indica el fabricante, no "hasta que se vea cubierto".
- Menor resistencia al tránsito.
- Requiere refuerzo con malla de poliéster en fisuras, encuentros y perímetros.

**Clave de ejecución:** respetar el consumo indicado, aplicar en manos cruzadas (una en cada sentido) y usar malla en todos los encuentros.

### Poliuretano proyectado (espuma + protección)

Se proyecta espuma de poliuretano y se la protege con una membrana líquida poliuretánica.

**Duración esperada:** 10 a 15 años con mantenimiento de la capa de protección.

**A favor**
- **Impermeabiliza y aísla térmicamente al mismo tiempo.** Es su gran ventaja: baja mucho la temperatura interior en verano.
- Manto totalmente continuo, sin juntas.
- Muy liviano.
- Se adapta a cualquier geometría.

**En contra**
- Costo inicial más alto.
- Requiere equipo y personal especializado.
- **La espuma se degrada con los rayos UV:** la capa de protección no es opcional y hay que renovarla cada 5 años aproximadamente.

**Conviene cuando:** el techo recibe mucho sol, la temperatura interior es un problema, y podés absorber la inversión inicial a cambio de ahorro en climatización.

## Comparación rápida

| Sistema | Duración | Costo inicial | Aísla térmicamente | Punto débil |
|---|---|---|---|---|
| Membrana asfáltica | 5-10 años | Medio | Poco (el aluminio refleja) | Las uniones |
| Membrana líquida | 3-8 años | Bajo | No | El espesor aplicado |
| Poliuretano proyectado | 10-15 años | Alto | Sí, mucho | Necesita protección UV |

## Los puntos donde realmente entra el agua

En la práctica, casi ninguna filtración empieza en el medio del paño. Empieza en:

1. **Encuentro de losa y muro (babeta).** El número uno por lejos. La membrana tiene que subir por el muro y rematar embutida o con perfil, nunca simplemente pegada al revoque.
2. **Desagües.** Alrededor de la rejilla, donde la membrana se corta. Necesita refuerzo y una pieza específica.
3. **Caños y conductos que atraviesan la losa.** Cada penetración es un agujero que hay que resolver con refuerzo y sellado elástico.
4. **Encuentro con claraboyas y lucernarios.**
5. **Juntas de dilatación.** Requieren tratamiento específico con fuelle.
6. **Muretes y parapetos.** La coronación necesita albardilla con goterón y pendiente hacia adentro del techo.

Cuando revises un presupuesto de impermeabilización, fijate si **estos puntos están detallados**. Un presupuesto que solo dice "membrana asfáltica, X m²" está cotizando el paño fácil e ignorando lo que realmente falla.

## Plan de mantenimiento

Esto es lo que evita las reparaciones caras:

**Dos veces al año** (idealmente antes y después de la temporada de lluvias):
- Limpiar desagües, canaletas y rejillas. Las hojas tapando un desagüe generan una pileta sobre la losa.
- Revisar visualmente el estado general.

**Una vez al año:**
- Revisar todos los encuentros, babetas y perímetros.
- Buscar ampollas, cortes, solapes abiertos o zonas donde se ve la armadura de la membrana.
- Verificar que no haya crecido vegetación (una raíz atraviesa cualquier membrana).

**Cada 3-5 años:**
- Renovar la capa de pintura protectora o dar una mano de membrana líquida sobre el sistema existente si está sano.

Una mano de membrana líquida preventiva cada tres años cuesta una fracción de rehacer todo el sistema, y multiplica la vida útil del conjunto.

## Errores frecuentes

- **Impermeabilizar sobre superficie húmeda.** El vapor queda atrapado, forma ampollas y despega el sistema.
- **Poner membrana nueva sobre una vieja en mal estado.** Si la de abajo está despegada, la nueva se despega con ella. Hay que retirar lo que no adhiere.
- **No subir la membrana por los muros.** Es el error más común y el que más filtraciones causa.
- **Olvidar la pendiente.** Ya lo dijimos, pero es el que más se repite.
- **Transitar el techo sin protección.** Si vas a caminar por ahí, necesitás una capa de protección (baldosas, solado flotante).

## En resumen

- Antes que el producto, resolvé la **pendiente**.
- El sistema se elige por presupuesto, exposición al sol y si necesitás aislación térmica.
- Las filtraciones nacen en **encuentros y desagües**, no en el medio del paño.
- Dos limpiezas y una revisión al año extienden muchísimo la vida útil.

Si ya tenés una filtración y no sabés de dónde viene, el rastreo del punto de entrada es un trabajo de diagnóstico: [escribinos](/contacto) antes de gastar en una reparación a ciegas.`,
  },
  {
    title: "Cómo presupuestar tu obra sin sorpresas (y por qué siempre se pasa)",
    slug: "presupuestar-obra-sin-sorpresas",
    excerpt:
      "La estructura de un presupuesto real, cómo se reparte el costo por etapa, qué imprevistos dejar previstos y cómo manejar la inflación sin perder el control.",
    categorySlug: "costos",
    coverImage:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=80",
    tags: "presupuesto,costos,planificación,inflación,obra",
    featured: true,
    content: `## Por qué casi todas las obras se pasan de presupuesto

No es mala suerte ni son los albañiles. Las obras se pasan por cuatro razones que se repiten siempre:

1. **El presupuesto inicial estaba incompleto.** Cotizó lo evidente (materiales, mano de obra) y omitió lo que no se ve.
2. **No había margen para imprevistos.** Y en obra los imprevistos no son excepciones: son parte del proceso.
3. **Se hicieron cambios durante la ejecución** sin registrar cuánto costaban.
4. **La inflación** licuó el presupuesto mientras la obra avanzaba.

Las cuatro son manejables si se anticipan. Este artículo es sobre cómo hacerlo.

## Cómo se reparte el costo de una obra

Estos son órdenes de magnitud típicos para una vivienda en Argentina. Tu caso va a variar, pero sirven para detectar si a un presupuesto le falta algo grueso:

| Etapa | % aproximado |
|---|---|
| Movimiento de suelos | 2-3% |
| Fundaciones | 6-8% |
| Estructura | 12-15% |
| Mampostería | 10-12% |
| Techos | 8-10% |
| Instalaciones (agua, cloaca, electricidad, gas) | 12-15% |
| Revoques | 8-10% |
| Pisos y revestimientos | 10-13% |
| Terminaciones (aberturas, pintura, artefactos) | 15-20% |

Dos observaciones que sorprenden a mucha gente:

- **Las terminaciones son el rubro más grande.** Aberturas, griferías, artefactos, pintura y equipamiento pesan más que la estructura. Y son justo donde más fácil se dispara el gasto, porque es donde uno "ve" la casa y se tienta.
- **Las instalaciones pesan tanto como la estructura.** Suelen subestimarse groseramente en los presupuestos caseros.

## Lo que casi nunca está en el presupuesto (y hay que agregar)

Esta es la lista de los olvidos clásicos. Revisá si tu presupuesto los incluye:

**Antes de empezar**
- Estudio de suelo.
- Honorarios profesionales (proyecto, dirección técnica).
- Derechos de construcción municipales y visados de colegios profesionales.
- Aportes previsionales de la obra.
- Conexiones de servicios: agua, cloaca, electricidad, gas. **Estas pueden ser muy caras** y casi nunca se cotizan al principio.

**Durante la obra**
- Alquiler de andamios, encofrados, equipos.
- Contenedores y retiro de escombros.
- Energía y agua de obra.
- Seguros y ART del personal.
- Cerco de obra y seguridad.
- Fletes (sí, suman).

**Después**
- Limpieza final de obra.
- Veredas y cordón.
- Movimiento de suelo exterior, parquización.
- Cerco perimetral.
- Final de obra municipal y plano conforme a obra.

Sumados, estos ítems pueden representar entre el **15% y el 25%** del costo. Si no están, el presupuesto no está incompleto por un poco: está incompleto por mucho.

## El fondo de imprevistos

**Regla práctica: reservá entre el 10% y el 15% del total del presupuesto para imprevistos.** Si es obra nueva sobre terreno conocido, 10% puede alcanzar. Si es una refacción o ampliación sobre construcción existente, no bajes del 15% y considerá 20%.

¿Por qué más en refacciones? Porque hasta que no abrís un muro no sabés qué hay adentro. Instalaciones que no figuraban en ningún plano, estructuras que no son lo que parecían, humedades ocultas.

Ese fondo no es "plata de más". Es parte del presupuesto. Si no lo usás, mejorás las terminaciones al final.

## Cómo manejar la inflación

Este es el punto que hace difícil presupuestar en Argentina. Algunas estrategias que funcionan:

**1. Presupuestá en cantidades, no solo en pesos.**

Un presupuesto que dice "$X para la estructura" envejece en semanas. Un presupuesto que dice "180 bolsas de cemento, 4.200 kg de hierro, 22 m³ de arena" sigue siendo válido: solo hay que actualizar precios unitarios. Esto es lo que te permite saber si te pasaste **de verdad** o si solo cambió el precio.

**2. Comprá por anticipado lo que no se deteriora y ocupa poco.**

El hierro es el caso típico: no se vence, no pierde propiedades si se guarda bien y suele ajustar fuerte. Comprarlo al inicio de la obra es una cobertura razonable. El cemento **no** entra en esta lógica: se vence.

**3. Separá inflación de cambios de alcance.**

Esta distinción es la más importante para no perder el control. Cuando el presupuesto sube, siempre tenés que poder responder: ¿subió porque los precios subieron, o porque pedí cosas que no estaban?

Son dos conversaciones distintas. La primera es del contexto; la segunda es una decisión tuya. Mezclarlas hace imposible gestionar la obra.

En [Mi Obra](/mi-obra) esto está resuelto de fábrica: se congela el presupuesto original como línea base y cada aumento se registra como un ajuste con su motivo (inflación, cambio pedido, corrección). En cualquier momento ves cuánto subió por cada causa.

**4. Fijá el presupuesto en una unidad estable si podés.**

Algunos presupuestos se manejan en dólares o en cantidad de bolsas de cemento equivalentes. Tiene sentido si tus ingresos también están en esa unidad; si no, solo estás trasladando el riesgo.

## Cómo pedir un presupuesto que se pueda comparar

El error habitual es pedir "un presupuesto para hacer la casa" y recibir tres números sueltos imposibles de comparar.

Pedí que venga:

1. **Discriminado por rubro**, con las etapas de la tabla de arriba.
2. **Con cómputo de materiales**: cantidades, no solo importes.
3. **Con alcance explícito**: qué incluye y, sobre todo, **qué no incluye**.
4. **Con plazo por etapa.**
5. **Con forma de pago y criterio de actualización.** Este punto es crítico en Argentina: ¿cómo se actualizan los montos pendientes? Dejarlo sin definir es garantía de conflicto.
6. **Con validez indicada.** Un presupuesto sin fecha de validez no significa nada.

Si un presupuesto es notoriamente más barato que los otros dos, **no es una ganga: es un presupuesto incompleto**. Pedí que te muestren dónde está la diferencia. Casi siempre está en lo que no incluye, o en una calidad de material distinta.

## Cómo controlar durante la ejecución

Presupuestar bien es la mitad del trabajo. La otra mitad es no perder el hilo mientras la obra avanza.

**Registrá cada gasto en el momento.** No a fin de mes, no "después lo anoto". A fin de mes ya no te acordás.

**Compará gasto contra avance, no gasto contra total.** El dato importante no es "gasté el 40% del presupuesto", es "gasté el 40% y la obra avanzó un 25%". Esa brecha es la alerta temprana.

**Registrá los cambios cuando suceden**, con su costo y su impacto en el plazo. La frase "después lo vemos" es la que hace explotar los presupuestos.

**Revisá una vez por semana.** Quince minutos. Las desviaciones detectadas temprano se corrigen; las detectadas al final solo se lamentan.

## Herramientas para hacerlo concreto

- Las [calculadoras de materiales](/calculadoras) te dan el cómputo de cantidades por etapa.
- El [comparador de precios](/comparador) te da precios reales de proveedores de Córdoba para valorizar esas cantidades.
- [Mi Obra](/mi-obra) junta las dos cosas: presupuesto por etapa, línea base congelada, registro de gastos, avance real y la alerta de gasto contra avance.

## En resumen

- Usá la distribución por rubro para detectar omisiones gruesas.
- Agregá lo que nunca se cotiza: honorarios, permisos, conexiones, fletes, limpieza, vereda.
- Reservá 10-15% para imprevistos (20% si es refacción).
- Presupuestá en **cantidades** además de pesos.
- Separá siempre lo que subió por inflación de lo que subió porque pediste cambios.
- Controlá gasto **contra avance**, todas las semanas.

Si querés que revisemos un presupuesto que te pasaron antes de firmarlo, es una de las consultas más frecuentes que recibimos y de las que más plata ahorra: [escribinos](/contacto).`,
  },
];
