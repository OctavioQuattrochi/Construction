// Minimal, safe Markdown → HTML renderer for article bodies.
// Input is HTML-escaped first, then a subset of Markdown is applied. Sufficient
// for headings, emphasis, lists, blockquotes, links and paragraphs.

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '<code class="md-code">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (_m, label, href) =>
        `<a href="${href}" class="md-link"${
          /^https?:/.test(href) ? ' target="_blank" rel="noopener noreferrer"' : ""
        }>${label}</a>`
    );
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
