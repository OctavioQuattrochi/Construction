// Minimal, safe Markdown → HTML renderer for article bodies.
// Input is HTML-escaped first, then a subset of Markdown is applied. Sufficient
// for headings, emphasis, lists, blockquotes, links and paragraphs.

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Sólo se permiten enlaces http(s), mailto/tel y rutas internas (/ o #).
 * Un href con esquema `javascript:`, `data:`, etc. renderizaría un enlace
 * ejecutable (XSS almacenado en el cuerpo del artículo), así que se descarta y
 * el enlace se muestra como texto plano.
 */
function safeHref(raw: string): string | null {
  const href = raw.trim();
  if (/^(https?:\/\/|mailto:|tel:)/i.test(href)) return href;
  if (/^[/#]/.test(href)) return href; // ruta interna o ancla
  // El escapeHtml previo ya convirtió < > &; acá sólo rechazamos esquemas.
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return null; // cualquier otro esquema
  return href; // relativo sin esquema (ej. "guia.html")
}

function inline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '<code class="md-code">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, href) => {
      const safe = safeHref(href);
      if (!safe) return label; // esquema peligroso: sólo el texto, sin enlace
      const external = /^https?:/i.test(safe);
      return `<a href="${safe}" class="md-link"${
        external ? ' target="_blank" rel="noopener noreferrer"' : ""
      }>${label}</a>`;
    });
}

export function markdownToHtml(md: string): string {
  const lines = escapeHtml(md.replace(/\r\n/g, "\n")).split("\n");
  const html: string[] = [];
  let i = 0;

  const flushList = (buffer: string[], ordered: boolean) => {
    if (!buffer.length) return;
    const tag = ordered ? "ol" : "ul";
    html.push(
      `<${tag} class="md-list">${buffer
        .map((li) => `<li>${inline(li)}</li>`)
        .join("")}</${tag}>`
    );
  };

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    // Headings
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1].length;
      html.push(`<h${level} class="md-h${level}">${inline(h[2])}</h${level}>`);
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith(">")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      html.push(`<blockquote class="md-quote">${inline(buf.join(" "))}</blockquote>`);
      continue;
    }

    // Tabla: una fila de encabezado seguida de la línea separadora |---|---|
    if (
      line.trim().startsWith("|") &&
      i + 1 < lines.length &&
      /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])
    ) {
      const cells = (row: string) =>
        row
          .trim()
          .replace(/^\||\|$/g, "")
          .split("|")
          .map((c) => c.trim());

      const head = cells(line);
      i += 2; // saltear encabezado y separador
      const body: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        body.push(cells(lines[i]));
        i++;
      }

      const thead = `<thead><tr>${head
        .map((c) => `<th>${inline(c)}</th>`)
        .join("")}</tr></thead>`;
      const tbody = `<tbody>${body
        .map(
          (r) =>
            `<tr>${head
              .map((_, n) => `<td>${inline(r[n] ?? "")}</td>`)
              .join("")}</tr>`
        )
        .join("")}</tbody>`;
      // El contenedor con scroll propio evita que una tabla ancha desborde
      // la página en el celular.
      html.push(
        `<div class="md-table-wrap"><table class="md-table">${thead}${tbody}</table></div>`
      );
      continue;
    }

    // Unordered list
    if (/^[-*]\s+/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        buf.push(lines[i].replace(/^[-*]\s+/, ""));
        i++;
      }
      flushList(buf, false);
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        buf.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      flushList(buf, true);
      continue;
    }

    // Paragraph (gather consecutive non-empty, non-block lines)
    const buf: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,4})\s|^>|^[-*]\s|^\d+\.\s/.test(lines[i])
    ) {
      buf.push(lines[i]);
      i++;
    }
    html.push(`<p class="md-p">${inline(buf.join(" "))}</p>`);
  }

  return html.join("\n");
}
