'use client';
import { useEffect, useRef, useState } from 'react';

// ── TIPOS ────────────────────────────────────────────────────────────────────
interface KBEntry {
  id: string;
  keywords: string[];
  question: string;
  answer: string;
  buttons?: { label: string; action: string }[];
}
interface Message {
  from: 'bot' | 'user';
  text: string;
  buttons?: { label: string; action: string }[];
}

// ── CONSTANTES ───────────────────────────────────────────────────────────────
const WA = 'https://wa.me/34606598156';
const CTAs = {
  wa:    { label: '💬 WhatsApp', action: 'whatsapp' },
  tel:   { label: '📞 Llamar', action: 'telefono' },
  visit: { label: '📍 Visitarnos', action: 'ubicacion' },
  map:   { label: '🗺️ Cómo llegar', action: 'mapa' },
};

// ── BASE DE CONOCIMIENTO COMPLETA ────────────────────────────────────────────
// Extraída del documento chatbot_floristeria_natura.docx
const KB: KBEntry[] = [
  // ── INFORMACIÓN GENERAL ──
  {
    id: 'saludo',
    keywords: ['hola','buenas','buenos dias','buenas tardes','buenas noches','hey','saludos','inicio','empezar','ayuda','hi'],
    question: 'Saludo inicial',
    answer: '¡Hola! 👋 Soy el asistente de **Floristería Natura**. Puedo ayudarte con plantas, flores, cuidados, riegos, servicios y mucho más. ¿Qué necesitas?',
    buttons: [{ label:'🌸 Servicios', action:'servicios'},{label:'🌿 Plantas', action:'plantas'},{label:'🕐 Horarios', action:'horarios'},{label:'💰 Precios', action:'precios'}],
  },
  {
    id: 'servicios',
    keywords: ['servicio','que haceis','que ofreceis','que vendeis','catalogo','productos','tienda','venta'],
    question: '¿Qué servicios ofrecéis?',
    answer: 'En **Floristería Natura** ofrecemos:\n\n🌸 Flores frescas y ramos personalizados\n💐 Ramos de novia a medida\n🌿 Plantas de interior y exterior\n🪴 Composiciones en cesta o cristal\n🎀 Letras decorativas con flores\n⚰️ Coronas y centros funerarios\n💒 Decoración de bodas, comuniones, eventos\n🌹 Cúpulas de flor preservada (estilo Bella y la Bestia)\n🍬 Bomboneras y cajas sombrereras\n🚗 Entrega a domicilio en Reinosa y comarcas',
    buttons: [CTAs.wa, CTAs.tel],
  },
  {
    id: 'horarios',
    keywords: ['horario','hora','cuando abren','cuando cierran','abierto','cerrado','abren','cierran','domingo','sabado','lunes','viernes'],
    question: '¿Cuál es el horario?',
    answer: 'Nuestro horario es:\n\n🕐 **Lunes a Viernes** — 9:30 a 14:00 y 17:00 a 20:00\n🕐 **Sábados** — 9:30 a 14:00\n🔴 **Domingos y festivos** — cerrado (salvo encargo previo)\n\nEn fechas especiales como San Valentín, Día de la Madre o Navidad podemos ampliar el horario. ¡Consúltanos!',
    buttons: [CTAs.tel, CTAs.wa],
  },
  {
    id: 'ubicacion',
    keywords: ['donde','ubicacion','direccion','llegar','mapa','reinosa','calle peligros','cantabria','sitio','encontrar'],
    question: '¿Dónde estáis?',
    answer: 'Nos encontramos en:\n\n📍 **Calle Peligros, 2**\n📍 **39200 Reinosa, Cantabria**\n\nEstamos en el centro de Reinosa, muy fácil de encontrar. ¡Te esperamos con los brazos abiertos!',
    buttons: [CTAs.map, CTAs.tel],
  },
  {
    id: 'contacto',
    keywords: ['telefono','llamar','numero','contacto','contactar','email','correo','web','whatsapp','movil'],
    question: '¿Cómo puedo contactar?',
    answer: 'Puedes contactarnos por:\n\n📞 **Teléfono fijo:** 942 752 691\n📱 **Móvil / WhatsApp:** 606 598 156\n📧 **Email:** terear@hotmail.es\n🌐 **Web:** www.floresyplantasnatura.es\n\n¡Estaremos encantadas de atenderte!',
    buttons: [CTAs.tel, CTAs.wa],
  },
  {
    id: 'precios',
    keywords: ['precio','cuanto cuesta','cuanto vale','tarifa','coste','presupuesto','caro','barato','cobra'],
    question: '¿Cuáles son los precios?',
    answer: 'Precios orientativos:\n\n🚗 Entrega en **Reinosa** — 2,50 €\n🚗 Entrega fuera — según kilometraje\n⚰️ **Coronas funerarias** — desde 210 €\n⚰️ **Centros funerarios** — desde 60 €\n💐 Ramos de novia, letras, bodas — presupuesto personalizado\n\nPara cualquier consulta sin compromiso, llámanos o escríbenos.',
    buttons: [CTAs.tel, CTAs.wa],
  },
  {
    id: 'entrega',
    keywords: ['entrega','domicilio','envio','llevar','mandar','reparto','traer','envian','llevan','mandan'],
    question: '¿Hacéis entrega a domicilio?',
    answer: 'Sí, hacemos **entrega a domicilio**:\n\n🚗 En **Reinosa** — 2,50 €\n🚗 En el **resto de comarcas** — según kilometraje\n\nPuedes pedir por teléfono o WhatsApp y pagar por **Bizum**. ¡Muy cómodo!',
    buttons: [CTAs.wa, CTAs.tel],
  },
  {
    id: 'pago',
    keywords: ['bizum','pago','pagar','metodo pago','transferencia','tarjeta','efectivo','como pago'],
    question: '¿Cómo se puede pagar?',
    answer: 'Aceptamos varios métodos de pago:\n\n💳 **Bizum** — ideal para pedidos a distancia\n💵 **Efectivo** — en tienda\n\nPara pedidos por teléfono o WhatsApp puedes pagar por Bizum antes de la entrega.',
    buttons: [CTAs.wa],
  },

  // ── EVENTOS ──
  {
    id: 'bodas',
    keywords: ['boda','novia','ramo novia','nupcial','ceremonia','matrimonio','casar','boda decoracion','iglesia','salon'],
    question: '¿Hacéis decoración de bodas?',
    answer: 'Para **bodas** lo hacemos todo con mimo:\n\n💐 Ramos de novia totalmente personalizados\n🌸 Decoración de la ceremonia e iglesia\n🏛️ Decoración de salones y mesas\n🌹 Centros de mesa\n\n¡Más de 25 años de experiencia en bodas especiales! Pídenos presupuesto sin compromiso.',
    buttons: [CTAs.wa, CTAs.tel],
  },
  {
    id: 'eventos',
    keywords: ['evento','comunion','bautizo','cumpleanos','aniversario','decorar','celebracion','corporativo','empresa'],
    question: '¿Hacéis decoración de eventos?',
    answer: 'Decoramos todo tipo de **eventos**:\n\n💒 Bodas y ceremonias\n🙏 Comuniones y bautizos\n🎂 Cumpleaños y aniversarios\n🏢 Eventos corporativos\n\nNos adaptamos a tu estilo, espacio y presupuesto.',
    buttons: [CTAs.wa, CTAs.tel],
  },
  {
    id: 'funeral',
    keywords: ['funeral','corona','coronas','difunto','fallecido','despedida','condolencia','tanatorio','funeraria','luto'],
    question: '¿Tenéis flores para funeral?',
    answer: 'Para **flores de despedida** preparamos con todo el cuidado y sensibilidad:\n\n⚰️ **Coronas** — desde 210 €\n⚰️ **Centros** — desde 60 €\n💐 **Ramos** — varios tamaños\n\nEntendemos que son momentos difíciles. Puedes llamarnos con urgencia si lo necesitas.',
    buttons: [CTAs.tel, CTAs.wa],
  },

  // ── PRODUCTOS ESPECIALES ──
  {
    id: 'cupula',
    keywords: ['cupula','preservada','bella y la bestia','rosa preservada','flores preservadas','cristal rosa','regalo romantico'],
    question: '¿Qué son las cúpulas de flor preservada?',
    answer: '🌹 Las **cúpulas de flor preservada** son una de nuestras creaciones más especiales. Contienen flores preservadas (generalmente una rosa) que mantienen su aspecto fresco durante **años** sin necesidad de agua ni cuidados.\n\nRecuerdan a la famosa escena de *La Bella y la Bestia*. Son el regalo perfecto para ocasiones especiales.',
    buttons: [CTAs.wa, CTAs.tel],
  },
  {
    id: 'letras',
    keywords: ['letra','letras flores','letras con flores','inicial','decoracion letras','nombre flores'],
    question: '¿Hacéis letras con flores?',
    answer: '🎀 Sí, creamos **letras decorativas con flores** totalmente personalizadas. Perfectas para bodas, comuniones, cumpleaños y decoración del hogar.\n\nIndícanos la letra, palabra o nombre y te hacemos un presupuesto.',
    buttons: [CTAs.wa],
  },
  {
    id: 'bomboneras',
    keywords: ['bombonera','sombrerera','cajita','caja flores','detalles boda','regalo flores caja'],
    question: '¿Tenéis bomboneras o sombrereras?',
    answer: '🍬 Sí, hacemos **bomboneras y cajas sombrereras** rellenas de flores y detalles decorativos. Son ideales como regalo o como centro de mesa en eventos.\n\nPregúntanos por los diseños disponibles.',
    buttons: [CTAs.wa, CTAs.tel],
  },
  {
    id: 'ramo_personalizado',
    keywords: ['ramo personalizado','ramo encargo','flores encargo','hacer ramo','crear ramo','ramo especial','diseno ramo'],
    question: '¿Podéis hacer un ramo personalizado?',
    answer: '¡Absolutamente! En Floristería Natura hacemos todos nuestros ramos de forma **artesanal y personalizada**.\n\nCuéntanos la ocasión, los colores preferidos, el presupuesto y cualquier preferencia, y lo creamos especialmente para ti. 🌸',
    buttons: [CTAs.wa, CTAs.tel],
  },

  // ── PLANTAS DE INTERIOR ──
  {
    id: 'plantas_interior',
    keywords: ['planta interior','plantas interior','planta casa','para casa','dentro casa','interior'],
    question: '¿Qué plantas de interior tenéis?',
    answer: 'Tenemos una amplia selección de **plantas de interior**:\n\n🌸 Orquídeas (Phalaenopsis)\n🌳 Bonsáis\n💚 Pothos — muy resistente\n🌿 Espatifilo / Cuna de Moisés\n🟢 Zamioculcas (ZZ Plant)\n🌱 Planta del dinero (Pilea)\n🍃 Ficus benjamina\n🌺 Anturio\n🪴 Calathea\n🌵 Suculentas y cactus\n\n¡Pásate y te asesoramos según tu espacio y nivel de cuidado!',
    buttons: [CTAs.visit, CTAs.wa],
  },
  {
    id: 'orquidea',
    keywords: ['orquidea','orquídea','phalaenopsis','orquideas','cuido orquidea','orquidea no florece','orquidea muerta'],
    question: '¿Cómo cuido mi orquídea?',
    answer: '🌸 **Orquídea (Phalaenopsis):**\n\n💡 **Luz:** Brillante indirecta. Nunca sol directo.\n💧 **Riego:** 1 vez/semana en verano, cada 10-15 días en invierno. Método inmersión: sumergir la maceta 10 min y escurrir bien.\n🌡️ **Temperatura:** 18–28°C. No menos de 10°C.\n💨 **Humedad:** Le encanta. Pulverizar raíces o bandeja con piedras y agua.\n🌿 **Abono:** Fertilizante específico cada 15-20 días en primavera-verano.\n\n**No florece:** necesita diferencia de temperatura noche/día de al menos 5°C.',
    buttons: [CTAs.visit, CTAs.wa],
  },
  {
    id: 'bonsai',
    keywords: ['bonsai','bonsái','arbol miniatura','cuidar bonsai','regar bonsai','podar bonsai'],
    question: '¿Cómo cuido mi bonsái?',
    answer: '🌳 **Bonsái:**\n\n💡 **Luz:** Mucha luz. Los de interior (Ficus, Carmona) toleran sombra parcial.\n💧 **Riego:** Cuando la capa superficial de tierra esté seca. En verano puede ser diario. Usar agua sin cal.\n🌡️ **Temperatura:** Ficus: 15-30°C | Olmo chino: 5-25°C | Junípero: aguanta heladas.\n✂️ **Poda:** En primavera. El alambrado da forma (retirar en 2-3 meses).\n🪴 **Trasplante:** Cada 2 años en primavera, con tierra akadama.',
    buttons: [CTAs.visit, CTAs.wa],
  },
  {
    id: 'pothos',
    keywords: ['pothos','epipremnum','planta resistente','facil cuidar','poca luz','planta oficina','purifica aire'],
    question: '¿Cómo cuido el Pothos?',
    answer: '💚 **Pothos (Epipremnum aureum):**\n\nUna de las plantas más **resistentes y fáciles**. Purifica el aire.\n\n💡 **Luz:** Se adapta a poca luz, aunque crece mejor con luz indirecta.\n💧 **Riego:** Cuando la capa superior esté seca. Cada 7-10 días en verano, cada 15 en invierno.\n🌡️ **Temperatura:** 15–30°C. No menos de 10°C.\n\n⚠️ Hojas amarillas = exceso de riego. Hojas arrugadas = falta de agua o luz.',
    buttons: [CTAs.visit],
  },
  {
    id: 'zamioculcas',
    keywords: ['zamioculcas','zz plant','planta olvido','poca luz planta','indestructible','oficina planta'],
    question: '¿Cómo cuido la Zamioculcas?',
    answer: '🟢 **Zamioculcas (ZZ Plant):**\n\nIdeal para hogares con poca luz. Prácticamente **indestructible**.\n\n💡 **Luz:** Tolera poca luz. Nunca sol directo.\n💧 **Riego:** Muy escaso. Cada 2-3 semanas en verano, una vez al mes en invierno.\n🌡️ **Temperatura:** 15–26°C. No tolera heladas.',
    buttons: [CTAs.visit],
  },
  {
    id: 'suculentas',
    keywords: ['suculenta','suculentas','cactus','crassula','jade','aloe','olvidar regar','sin agua'],
    question: '¿Cómo cuido suculentas y cactus?',
    answer: '🌵 **Suculentas y Cactus:**\n\nPerfectas para quien se olvida de regar.\n\n💡 **Luz:** Mucha luz, incluso sol directo. Ventanas sur o suroeste.\n💧 **Riego:** Muy poco. En verano: cada 2-3 semanas. En invierno: casi nada (una vez al mes). Nunca dejar agua en el platillo.\n🌡️ **Temperatura:** 10–30°C. Algunos cactus aguantan heladas breves.\n\n**Planta Jade:** especialmente en Reinosa, proteger en invierno.',
    buttons: [CTAs.visit],
  },
  {
    id: 'espatifilo',
    keywords: ['espatifilo','cuna de moises','spathiphyllum','flor blanca','purifica','paz lily'],
    question: '¿Cómo cuido el Espatifilo?',
    answer: '🌺 **Espatifilo (Cuna de Moisés):**\n\nPlanta purificadora con flores blancas elegantes.\n\n💡 **Luz:** Tolera poca luz. Prospera con luz indirecta.\n💧 **Riego:** Moderado-frecuente. Suelo ligeramente húmedo. Cada 5-7 días en verano.\n🌡️ **Temperatura:** 18–30°C. No tolera fríos por debajo de 15°C.\n\n⚠️ Si las hojas se doblan, está pidiendo agua.',
    buttons: [CTAs.visit],
  },
  {
    id: 'calathea',
    keywords: ['calathea','planta respira','mueve hojas','hojas dibujos','tropical interior'],
    question: '¿Cómo cuido la Calathea?',
    answer: '🍃 **Calathea:**\n\nConocida como la planta que "respira" porque mueve las hojas según la luz del día.\n\n💡 **Luz:** Indirecta o sombra parcial. El sol directo decolora las hojas.\n💧 **Riego:** Moderado. Suelo húmedo sin encharcamiento. Usar agua sin cal o reposada.\n🌡️ **Temperatura:** 18–27°C. No tolera corrientes de aire ni fríos.',
    buttons: [CTAs.visit],
  },
  {
    id: 'anturio',
    keywords: ['anturio','anthurium','flor roja','planta roja','espata roja'],
    question: '¿Cómo cuido el Anturio?',
    answer: '🌺 **Anturio (Anthurium):**\n\nEspatas rojas o rosas muy llamativas. Puede florecer durante meses.\n\n💡 **Luz:** Indirecta brillante. El sol directo quema las hojas.\n💧 **Riego:** Cada 7-10 días. El sustrato debe secarse entre riegos pero no completamente.\n🌡️ **Temperatura:** 18–28°C. Sensible al frío y las corrientes.',
    buttons: [CTAs.visit],
  },

  // ── PLANTAS DE EXTERIOR ──
  {
    id: 'plantas_exterior',
    keywords: ['planta exterior','plantas exterior','jardin','terraza','balcon','fuera','exterior'],
    question: '¿Qué plantas de exterior tenéis?',
    answer: 'Tenemos una amplia selección de **plantas de exterior**:\n\n🌸 Geranios (perfectos para Cantabria)\n💜 Lavanda (muy resistente)\n🌹 Rosales (cientos de variedades)\n💙 Hortensias (ideales para el clima húmedo)\n🌸 Camelias (floración invernal)\n🌺 Plantas de temporada: pensamientos, dalias, crisantemos...\n\n¡Perfectas para jardines, terrazas y balcones de Reinosa!',
    buttons: [CTAs.visit, CTAs.wa],
  },
  {
    id: 'geranios',
    keywords: ['geranio','geranios','invierno geranio','reinosa geranio','frio geranio'],
    question: '¿Cómo cuido los geranios en Reinosa?',
    answer: '🌸 **Geranios en Reinosa:**\n\nReinosa tiene inviernos fríos con posibles heladas. Los geranios son semirresistentes y pueden dañarse por debajo de -2°C.\n\n💡 **Luz:** Sol pleno o semisombra.\n💧 **Riego:** Moderado. Dejar secar entre riegos. No mojar las flores.\n🌡️ **Invierno:** Meter en lugar fresco y luminoso (porche cubierto o interior) de diciembre a febrero.',
    buttons: [CTAs.visit],
  },
  {
    id: 'hortensias',
    keywords: ['hortensia','hortensias','azul rosa hortensia','color hortensia','cantabria hortensia'],
    question: '¿Cómo cuido las hortensias?',
    answer: '💙 **Hortensias:**\n\nPerfectas para el **clima húmedo de Cantabria**.\n\n💡 **Luz:** Semisombra. Sol de mañana.\n💧 **Riego:** Abundante, cada 2-3 días en verano.\n🌡️ **Temperatura:** Resistentes, aguantan hasta -10°C.\n\n🔵 **Color azul:** suelos ácidos (añade sulfato de aluminio)\n🌸 **Color rosa:** suelos alcalinos (añade cal)',
    buttons: [CTAs.visit],
  },
  {
    id: 'lavanda',
    keywords: ['lavanda','lavandula','lavanda cuidados','aromatica','morada'],
    question: '¿Cómo cuido la lavanda?',
    answer: '💜 **Lavanda:**\n\nAromática mediterránea muy resistente, perfecta para Reinosa.\n\n💡 **Luz:** Sol pleno. Necesita mucha luz para florecer.\n💧 **Riego:** Muy escaso. Resistente a la sequía. En verano cada 10-15 días.\n🌡️ **Temperatura:** Muy resistente: aguanta desde -10°C hasta 35°C.\n✂️ **Poda:** Tras la floración en agosto-septiembre.',
    buttons: [CTAs.visit],
  },
  {
    id: 'rosales',
    keywords: ['rosal','rosales','rosa exterior','podar rosal','plagas rosal','pulgon rosal'],
    question: '¿Cómo cuido los rosales?',
    answer: '🌹 **Rosales:**\n\n💡 **Luz:** Sol pleno, mínimo 6 horas diarias.\n💧 **Riego:** Cada 3-4 días en verano. Regar en la base, nunca mojar las hojas.\n🌡️ **Temperatura:** Resiste heladas moderadas (-5°C a -10°C). En Reinosa proteger el tallo en invierno con paja.\n✂️ **Poda:** Febrero-marzo, antes del brotado.\n🐛 **Plagas:** Pulgones (jabón potásico), oídio (fungicida azufre), araña roja (aumentar humedad).',
    buttons: [CTAs.visit],
  },

  // ── RIEGO ──
  {
    id: 'riego_general',
    keywords: ['riego','regar','cuando regar','cuanto regar','frecuencia riego','como regar','demasiada agua','poca agua'],
    question: '¿Cómo sé cuándo regar?',
    answer: '💧 **Cómo saber cuándo regar:**\n\n👆 Introduce el dedo 2-3 cm en la tierra: si está húmeda, espera; si está seca, riega.\n🌿 Hojas lacias o amarillas en exceso → revisar riego.\n⚖️ Levanta la maceta: cuando pesa poco y la tierra está seca, hay que regar.\n\n**Problemas frecuentes:**\n🟡 Hojas amarillas y blandas = exceso de riego\n🟡 Hojas amarillas y crujientes = falta de agua\n🟤 Manchas marrones en bordes = agua con cal o baja humedad',
    buttons: [CTAs.visit],
  },
  {
    id: 'riego_tecnicas',
    keywords: ['inmersion','riego inmersion','riego base','pulverizar','agua riego','calidad agua','agua cal'],
    question: '¿Qué técnica de riego debo usar?',
    answer: '💧 **Técnicas de riego:**\n\n🪣 **Inmersión** (orquídeas): sumergir la maceta 10-15 min, escurrir bien.\n🌊 **Por la base** (plantas propensas a hongos): verter agua en el platillo, vaciar el exceso a los 30 min.\n🚿 **Superficial normal**: el más común, verter cerca del tallo.\n💨 **Pulverización foliar**: aumenta la humedad ambiental (orquídeas, calatheas, helechos).\n\n⚠️ Usar agua a temperatura ambiente. Si el agua es muy calcárea, dejarla reposar 24h o usar agua de lluvia.',
    buttons: [],
  },

  // ── PLAGAS Y ENFERMEDADES ──
  {
    id: 'plagas',
    keywords: ['plaga','plagas','bicho','insecto','pulgon','mosca blanca','cochinilla','araña roja','trips','enfermedad planta'],
    question: '¿Cómo trato las plagas?',
    answer: '🐛 **Plagas más comunes:**\n\n🟢 **Pulgón** — jabón potásico, aceite de neem\n🟡 **Mosca blanca** — trampas amarillas, imidacloprid\n🔴 **Araña roja** — aumentar humedad, acaricida\n🩶 **Cochinilla algodonosa** — alcohol con bastoncillo, jabón potásico\n🌿 **Trips** — insecticida, trampas azules\n\n💡 **Prevención:** Revisar plantas nuevas, buena ventilación, no mojar hojas, aislar plantas afectadas.',
    buttons: [CTAs.visit, CTAs.wa],
  },
  {
    id: 'hongos',
    keywords: ['hongo','oidio','polvo blanco','moho','botritis','pudricion','raices negras','enfermedad fungica','cenicilla'],
    question: '¿Cómo trato los hongos en plantas?',
    answer: '🍄 **Enfermedades fúngicas comunes:**\n\n⚪ **Oídio** (polvo blanco harinoso) — fungicida de azufre o bicarbonato sódico\n💀 **Pudrición de raíz** (raíces negras) — reducir riego, retirar raíces dañadas\n🟤 **Botritis** (moho gris) — reducir humedad, fungicida de cobre\n🟠 **Roya** (pústulas naranjas) — fungicida sistémico, evitar mojar hojas\n\n💡 Mantener buena ventilación y no mojar las hojas al regar.',
    buttons: [CTAs.visit],
  },

  // ── FLORES CORTADAS ──
  {
    id: 'flores_cortadas',
    keywords: ['ramo dura','conservar ramo','flores duran mas','vida ramo','flores marchitas','mantener flores','jarrón','agua flores'],
    question: '¿Cómo conservo un ramo de flores?',
    answer: '✂️ **Cómo prolongar la vida de un ramo:**\n\n1. Cortar los tallos **en diagonal (45°)** con tijeras limpias\n2. Eliminar las hojas por debajo de la línea de agua\n3. Cambiar el agua **cada 2 días**\n4. Añadir el sobre de nutrientes que viene con el ramo\n5. Alejar del calor, sol directo y frutas maduras\n\n🌹 **Duración por flor:**\n• Rosas: 7-14 días\n• Crisantemos: 14-21 días\n• Lilium: 10-14 días\n• Tulipanes: 5-7 días\n• Orquídeas cortadas: 14-21 días',
    buttons: [CTAs.wa],
  },

  // ── REGALO / OCASIÓN ──
  {
    id: 'regalo_ocasion',
    keywords: ['que regalo','que compro','para regalar','regalo flores','regalo planta','regalo cumpleanos','regalo aniversario','regalo madre','que recomiendas','recomendacion'],
    question: '¿Qué me recomendáis para regalar?',
    answer: '🎁 **Recomendaciones por ocasión:**\n\n💕 **San Valentín/Aniversario** — Rosas rojas, orquídeas, cúpula preservada\n👩 **Día de la Madre** — Orquídeas, composición variada, geranios\n🎂 **Cumpleaños** — Ramo de flores variadas o planta de interior\n💒 **Boda** — Ramo de novia personalizado\n🙏 **Comunión/Bautizo** — Centros de mesa blancos\n🏥 **Get well soon** — Plantas fáciles o ramos suaves\n⚰️ **Pésame** — Coronas o centros en tonos neutros\n🏢 **Inauguración** — Plantas verdes grandes o bambú de la suerte',
    buttons: [CTAs.wa, CTAs.tel],
  },
  {
    id: 'principiante',
    keywords: ['principiante','facil','no sé cuidar','primera planta','no se me dan bien','que planta facil','olvidar regar','poco tiempo'],
    question: '¿Qué planta me recomendáis si soy principiante?',
    answer: '🌱 **Perfectas para principiantes:**\n\n💚 **Pothos** — muy resistente, se adapta a poca luz\n🟢 **Zamioculcas** — aguanta el olvido del riego\n🌵 **Suculentas** — riego escasísimo\n🌺 **Espatifilo** — bonito y fácil\n🌿 **Sansevieria** (Lengua de suegra) — mínimo mantenimiento\n\n¡Pasa por la tienda y te asesoramos personalmente según tu casa y estilo de vida!',
    buttons: [CTAs.visit, CTAs.wa],
  },
  {
    id: 'mascotas',
    keywords: ['mascotas','perro','gato','toxico','toxica','planta peligrosa','planta segura','mascota planta'],
    question: '¿Qué plantas son seguras para mascotas?',
    answer: '🐾 **Plantas tóxicas para mascotas (cuidado):**\n\n🔴 Lilium — MUY TÓXICO para gatos (fallo renal)\n🟠 Pothos — irritación bucal\n🟠 Dieffenbachia — inflamación oral\n🟡 Poinsettia — irritación leve\n🟠 Ficus — irritación piel y digestiva\n\n✅ **Plantas seguras:**\n• Orquídea Phalaenopsis\n• Calathea\n• Maranta\n• Peperomia\n• Tillandsia\n• Haworthia y Echeveria (suculentas)\n\nSiempre consulta con tu veterinario ante cualquier duda.',
    buttons: [CTAs.visit, CTAs.wa],
  },

  // ── TEMPORADA ──
  {
    id: 'temporada',
    keywords: ['temporada','mes','cuando','que hay ahora','disponible','navidad','san valentin','dia madre','todos santos','primavera','verano','otono','invierno'],
    question: '¿Qué flores hay según la temporada?',
    answer: '📅 **Flores por época del año:**\n\n❄️ **Enero-Febrero:** Tulipanes, rosas, mimosas, anémonas\n🌸 **Marzo-Abril:** Tulipanes, narcisos, fresias, jacintos\n☀️ **Mayo-Junio:** Peonías, rosas, lavanda, orquídeas\n🌻 **Julio-Agosto:** Girasoles, dalias, zinnias\n🍂 **Sep-Octubre:** Dalias, cosmos, gerberas, crisantemos\n🎄 **Nov-Diciembre:** Amarilis, Poinsettia, rosas\n\n🌹 **San Valentín (14 feb):** Rosas rojas, tulipanes\n👩 **Día de la Madre:** Orquídeas, ramos variados\n✝️ **Todos los Santos:** Crisantemos, coronas',
    buttons: [CTAs.visit, CTAs.wa],
  },

  // ── TRASPLANTE Y SUSTRATO ──
  {
    id: 'trasplante',
    keywords: ['trasplantar','trasplante','cambiar maceta','maceta grande','cuando trasplantar','sustrato','tierra planta','akadama'],
    question: '¿Cuándo y cómo trasplantar?',
    answer: '🪴 **Trasplante:**\n\n**¿Cuándo?** Cuando las raíces salen por los agujeros o la tierra no drena bien. Mejor en **primavera**.\n\n**¿Cómo?**\n1. Elegir maceta solo 2-3 cm más grande\n2. Añadir grava en el fondo para drenaje\n3. Usar sustrato específico para el tipo de planta\n4. No abonar hasta pasadas 4-6 semanas\n\n**Sustratos:**\n• Universal → plantas de interior genéricas\n• Cactus/suculentas → alta permeabilidad\n• Orquídeas → corteza de pino\n• Bonsái → akadama\n• Ácido → azaleas, camelias, hortensias',
    buttons: [CTAs.visit],
  },

  // ── ABONO ──
  {
    id: 'abono',
    keywords: ['abono','abonar','fertilizar','fertilizante','nutrientes planta','cuando abonar'],
    question: '¿Cuándo y cómo abonar?',
    answer: '🌱 **Abono:**\n\n✅ Abonar en **primavera y verano** (temporada de crecimiento).\n❌ No abonar en otoño-invierno (planta en reposo).\n❌ No abonar recién trasplantada (esperar 4-6 semanas).\n\n**Tipos:**\n💧 **Líquido** — acción rápida, se añade al agua de riego\n🪨 **Granulado de liberación lenta** — dura 3-6 meses, muy práctico\n🌿 **Orgánico (compost)** — ideal para exterior',
    buttons: [CTAs.visit],
  },

  // ── DESPEDIDA ──
  {
    id: 'gracias',
    keywords: ['gracias','muchas gracias','perfecto','genial','ok','entendido','de acuerdo','muy bien','chao','adios','hasta luego'],
    question: 'Despedida',
    answer: '¡De nada! 😊 Ha sido un placer ayudarte. Si tienes cualquier otra duda, aquí estaré. También puedes visitarnos o contactarnos directamente:',
    buttons: [CTAs.wa, CTAs.tel, CTAs.visit],
  },
];

// ── MOTOR DE BÚSQUEDA INTELIGENTE ────────────────────────────────────────────

function norm(s: string): string {
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(s: string): string[] {
  return norm(s).split(' ').filter(t => t.length > 2);
}

// Calcular puntuación de coincidencia entre input y entrada KB
function score(input: string, entry: KBEntry): number {
  const inputNorm = norm(input);
  const inputTokens = tokenize(input);
  let total = 0;

  for (const kw of entry.keywords) {
    const kwNorm = norm(kw);
    // Coincidencia exacta de frase → máxima puntuación
    if (inputNorm.includes(kwNorm)) {
      total += kwNorm.includes(' ') ? 12 : 8;
      continue;
    }
    // Coincidencia de tokens individuales
    const kwTokens = tokenize(kw);
    const matches = kwTokens.filter(t => inputTokens.some(it => it.includes(t) || t.includes(it)));
    if (matches.length > 0) {
      total += (matches.length / kwTokens.length) * 5;
    }
  }

  // Bonus si el input contiene palabras del id
  if (inputNorm.includes(norm(entry.id.replace(/_/g, ' ')))) total += 4;

  return total;
}

function getResponse(input: string): { answer: string; buttons?: { label: string; action: string }[] } {
  if (!input.trim()) return { answer: FALLBACK, buttons: FALLBACK_BTNS };

  // Puntuar todas las entradas
  const scored = KB.map(e => ({ entry: e, score: score(input, e) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0 || scored[0].score < 3) {
    return { answer: FALLBACK, buttons: FALLBACK_BTNS };
  }

  const best = scored[0].entry;
  return { answer: best.answer, buttons: best.buttons };
}

const FALLBACK = 'No tengo información exacta sobre eso 😊 Pero nuestro equipo sabrá ayudarte enseguida:';
const FALLBACK_BTNS = [
  { label: '💬 WhatsApp', action: 'whatsapp' },
  { label: '📞 Llamar', action: 'telefono' },
];

// ── ACCIONES ─────────────────────────────────────────────────────────────────
function handleAction(action: string): string | null {
  if (action === 'whatsapp') { window.open(WA, '_blank'); return null; }
  if (action === 'telefono') { window.open('tel:+34606598156'); return null; }
  if (action === 'mapa') { window.open('https://maps.google.com/?q=Calle+Peligros+2,+39200+Reinosa,+Cantabria', '_blank'); return null; }
  if (action === 'ubicacion') return 'donde estais';
  return action;
}

// ── RENDER TEXTO CON MARKDOWN BÁSICO ────────────────────────────────────────
function renderText(text: string) {
  return text.split('\n').map((line, i) => {
    const html = line
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');
    return <p key={i} style={{ margin: '1px 0', lineHeight: '1.55' }} dangerouslySetInnerHTML={{ __html: html || '&nbsp;' }} />;
  });
}

// ── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    from: 'bot',
    text: '¡Hola! 👋 Soy el asistente de **Floristería Natura**. Puedo ayudarte con plantas, cuidados, flores, servicios y mucho más. ¿Qué necesitas?',
    buttons: [
      { label: '🌸 Servicios', action: 'servicios' },
      { label: '🌿 Plantas', action: 'plantas interior' },
      { label: '🕐 Horarios', action: 'horarios' },
      { label: '💰 Precios', action: 'precios' },
    ],
  }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [pulse, setPulse] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open, messages]);

  useEffect(() => { const t = setTimeout(() => setPulse(true), 5000); return () => clearTimeout(t); }, []);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text: text.trim() }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const { answer, buttons } = getResponse(text);
      setMessages(prev => [...prev, { from: 'bot', text: answer, buttons }]);
      setTyping(false);
    }, 500 + Math.random() * 300);
  };

  const handleButton = (btn: { label: string; action: string }) => {
    const redirect = handleAction(btn.action);
    if (redirect) send(redirect);
  };

  const S = {
    btn: {
      position: 'fixed' as const, bottom: '24px', right: '24px', zIndex: 9998,
      width: '56px', height: '56px', borderRadius: '50%',
      background: 'linear-gradient(135deg,#B8860B,#D4A017)', border: 'none',
      boxShadow: '0 4px 20px rgba(184,134,11,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', transition: 'transform 0.2s,box-shadow 0.2s',
    },
    window: {
      position: 'fixed' as const, bottom: '92px', right: '24px', zIndex: 9997,
      width: '340px', maxWidth: 'calc(100vw - 32px)', maxHeight: '540px',
      background: '#FFFFFF', borderRadius: '16px',
      boxShadow: '0 8px 40px rgba(26,18,8,0.18)',
      display: 'flex', flexDirection: 'column' as const, overflow: 'hidden',
      opacity: open ? 1 : 0,
      transform: open ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.97)',
      pointerEvents: (open ? 'all' : 'none') as 'all' | 'none',
      transition: 'opacity 0.22s ease,transform 0.22s ease',
    },
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => { setOpen(v => !v); setPulse(false); }}
        aria-label={open ? 'Cerrar chat' : 'Abrir chat de ayuda'}
        style={S.btn}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform='scale(1.08)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform='scale(1)'; }}
      >
        {pulse && !open && (
          <span style={{ position:'absolute', inset:0, borderRadius:'50%', background:'rgba(184,134,11,0.3)', animation:'chatPulse 1.8s ease-out infinite' }} />
        )}
        {open
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FAF6EE" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FAF6EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        }
      </button>

      {/* Ventana */}
      <div style={S.window}>
        {/* Header */}
        <div style={{ background:'linear-gradient(135deg,#B8860B,#D4A017)', padding:'14px 16px', display:'flex', alignItems:'center', gap:'10px', flexShrink:0 }}>
          <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem' }}>🌿</div>
          <div style={{ flex:1 }}>
            <p style={{ margin:0, color:'#FAF6EE', fontFamily:'Jost,sans-serif', fontWeight:500, fontSize:'0.9rem' }}>Natura · Asistente</p>
            <p style={{ margin:0, color:'rgba(250,246,238,0.7)', fontFamily:'Jost,sans-serif', fontSize:'0.72rem' }}>{typing ? 'Escribiendo...' : 'En línea'}</p>
          </div>
          <a href={WA} target="_blank" rel="noopener noreferrer" title="Hablar con persona" style={{ display:'flex', alignItems:'center', justifyContent:'center', width:'30px', height:'30px', borderRadius:'50%', background:'rgba(255,255,255,0.15)', flexShrink:0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#FAF6EE"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.118 1.529 5.845L.057 23.885l6.23-1.635A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 01-5.031-1.38l-.36-.214-3.742.981 1-3.642-.235-.374A9.861 9.861 0 012.118 12C2.118 6.533 6.533 2.118 12 2.118S21.882 6.533 21.882 12 17.467 21.882 12 21.882z"/></svg>
          </a>
        </div>

        {/* Mensajes */}
        <div style={{ flex:1, overflowY:'auto', padding:'14px 12px', display:'flex', flexDirection:'column', gap:'10px', background:'#FAF6EE' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display:'flex', flexDirection:'column', alignItems: msg.from==='user' ? 'flex-end' : 'flex-start', gap:'6px' }}>
              <div style={{
                maxWidth:'88%', padding:'9px 12px',
                borderRadius: msg.from==='user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                background: msg.from==='user' ? 'linear-gradient(135deg,#B8860B,#D4A017)' : '#FFFFFF',
                boxShadow:'0 1px 4px rgba(26,18,8,0.08)',
                fontSize:'0.82rem', color: msg.from==='user' ? '#FAF6EE' : '#1A1208',
                fontFamily:'Jost,sans-serif',
              }}>
                {renderText(msg.text)}
              </div>
              {msg.buttons && msg.from==='bot' && i===messages.length-1 && (
                <div style={{ display:'flex', flexWrap:'wrap', gap:'5px', maxWidth:'88%' }}>
                  {msg.buttons.map((btn, bi) => (
                    <button key={bi} onClick={() => handleButton(btn)}
                      style={{ padding:'5px 10px', fontSize:'0.73rem', fontFamily:'Jost,sans-serif', background:'#FFFFFF', border:'1px solid rgba(184,134,11,0.3)', color:'#B8860B', borderRadius:'20px', cursor:'pointer', whiteSpace:'nowrap', transition:'background 0.15s,color 0.15s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='#B8860B'; (e.currentTarget as HTMLElement).style.color='#FAF6EE'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='#FFFFFF'; (e.currentTarget as HTMLElement).style.color='#B8860B'; }}
                    >{btn.label}</button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {typing && (
            <div style={{ display:'flex' }}>
              <div style={{ padding:'10px 14px', borderRadius:'14px 14px 14px 2px', background:'#FFFFFF', boxShadow:'0 1px 4px rgba(26,18,8,0.08)', display:'flex', gap:'4px', alignItems:'center' }}>
                {[0,1,2].map(i => <span key={i} style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#B8860B', opacity:0.5, animation:'chatDot 1.2s ease-in-out infinite', animationDelay:`${i*0.2}s`, display:'inline-block' }}/>)}
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* Input */}
        <div style={{ padding:'10px 12px', borderTop:'1px solid rgba(184,134,11,0.1)', background:'#FFFFFF', display:'flex', gap:'8px', flexShrink:0 }}>
          <input
            ref={inputRef} value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key==='Enter') send(input); }}
            placeholder="Escribe tu pregunta..."
            style={{ flex:1, border:'1px solid rgba(184,134,11,0.2)', borderRadius:'20px', padding:'8px 14px', fontSize:'0.82rem', fontFamily:'Jost,sans-serif', outline:'none', background:'#FAF6EE', color:'#1A1208' }}
          />
          <button onClick={() => send(input)} disabled={!input.trim()}
            style={{ width:'36px', height:'36px', borderRadius:'50%', background: input.trim() ? 'linear-gradient(135deg,#B8860B,#D4A017)' : 'rgba(184,134,11,0.15)', border:'none', cursor: input.trim() ? 'pointer' : 'default', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'background 0.2s' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={input.trim() ? '#FAF6EE' : '#B8860B'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes chatPulse { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(1.9);opacity:0} }
        @keyframes chatDot { 0%,80%,100%{transform:scale(0.7);opacity:0.4} 40%{transform:scale(1);opacity:1} }
      `}</style>
    </>
  );
}
