/*
 * Document import for legislation drafting.
 *
 * Adapted from the standalone Liberland Gazette Generator engine (gazette.js).
 * Only the PARSING half is reused: an uploaded document is reduced to plain
 * markdown text.
 *
 * Presentation is deliberately NOT carried over. Fonts, the coat of arms, the
 * presidential seal and the Gazette stylesheet are deterministic code that is
 * regenerated at render time, so they must never be embedded in a document
 * that is headed for on-chain storage. Images are stripped and counted, never
 * inlined as data URIs: legislation sections are billed by the byte, and a
 * single embedded graphic can outweigh an entire statute.
 *
 * Heavy parsers (mammoth for .docx, pdf.js for .pdf) are loaded with dynamic
 * import() so they land in their own webpack chunks and cost nothing to users
 * who never open the importer.
 */

// Typography pass carried over from the Gazette engine: smart quotes and
// en-dashes for digit ranges. Applied to text only.
export const smarten = (text) => String(text)
  .replace(/(\d)\s+-\s+(\d)/g, '$1 – $2')
  .replace(/(\d)-(\d)/g, '$1–$2')
  .replace(/"([^"]*)"/g, '“$1”')
  .replace(/(\w)'(\w)/g, '$1’$2')
  .replace(/'([^']*)'/g, '‘$1’');

export const utf8Bytes = (value) => new TextEncoder().encode(String(value ?? '')).length;

export const formatBytes = (n) => {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} kB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
};

const extFromName = (name) => {
  const m = /\.([a-z0-9]+)$/i.exec(name || '');
  return m ? m[1].toLowerCase() : '';
};

const readAsText = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error('Could not read the file.'));
  reader.readAsText(file);
});

const readAsArrayBuffer = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error('Could not read the file.'));
  reader.readAsArrayBuffer(file);
});

// ── HTML → markdown ─────────────────────────────────────────────────────────
// Parsed with DOMParser, which produces an inert document: scripts do not run
// and we only ever read text content and tag names, so untrusted markup cannot
// execute. Headings become markdown '#' lines, which is what the existing
// markdown2sections splitter keys on.

const INLINE_WRAP = {
  STRONG: '**',
  B: '**',
  EM: '*',
  I: '*',
};

const inlineText = (node) => {
  if (node.nodeType === Node.TEXT_NODE) return node.nodeValue.replace(/\s+/g, ' ');
  if (node.nodeType !== Node.ELEMENT_NODE) return '';
  const tag = node.tagName;
  if (tag === 'BR') return '\n';
  if (tag === 'IMG') return '';
  const inner = Array.from(node.childNodes).map(inlineText).join('');
  const wrap = INLINE_WRAP[tag];
  if (wrap && inner.trim()) return `${wrap}${inner.trim()}${wrap}`;
  return inner;
};

const htmlToMarkdown = (html) => {
  const doc = new DOMParser().parseFromString(String(html || ''), 'text/html');
  const droppedImages = doc.body ? doc.body.querySelectorAll('img').length : 0;
  const blocks = [];

  const walk = (el) => {
    Array.from(el.children).forEach((child) => {
      const tag = child.tagName;
      const heading = /^H([1-6])$/.exec(tag);
      if (heading) {
        const text = inlineText(child).trim();
        if (text) blocks.push(`${'#'.repeat(Number(heading[1]))} ${text}`);
        return;
      }
      if (tag === 'P') {
        const text = inlineText(child).trim();
        if (text) blocks.push(text);
        return;
      }
      if (tag === 'UL' || tag === 'OL') {
        const ordered = tag === 'OL';
        const items = Array.from(child.children)
          .filter((li) => li.tagName === 'LI')
          .map((li, i) => {
            const text = inlineText(li).trim();
            return text ? `${ordered ? `${i + 1}.` : '-'} ${text}` : '';
          })
          .filter(Boolean);
        if (items.length) blocks.push(items.join('\n'));
        return;
      }
      if (tag === 'TABLE' || tag === 'BLOCKQUOTE' || tag === 'PRE') {
        const text = inlineText(child).trim();
        if (text) blocks.push(tag === 'BLOCKQUOTE' ? `> ${text}` : text);
        return;
      }
      if (tag === 'IMG' || tag === 'SCRIPT' || tag === 'STYLE') return;
      walk(child);
    });
  };

  if (doc.body) walk(doc.body);
  return { markdown: blocks.join('\n\n').trim(), droppedImages };
};

// ── Heading recovery for unstructured text ──────────────────────────────────
// PDF and plain-text extraction carry no heading markup, so a statute would
// arrive as one undifferentiated block. Promote conventional legal openers to
// markdown headings so the splitter can produce one section per article.

const ARTICLE_LINE = /^\s*(?:§\s*\d+|(?:article|section|chapter|part|title|clause)\s+(?:\d+|[ivxlcdm]+)\b)[.:)\s-]*/i;

export const promoteLegalHeadings = (text) => {
  const lines = String(text || '').split(/\r?\n/);
  let promoted = 0;
  const out = lines.map((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return line;
    // Only promote short opener lines; a long paragraph merely mentioning
    // "Article 5" is prose, not a heading.
    if (trimmed.length <= 120 && ARTICLE_LINE.test(trimmed)) {
      promoted += 1;
      return `## ${trimmed}`;
    }
    return line;
  });
  return { markdown: out.join('\n'), promoted };
};

// ── Per-format parsing ──────────────────────────────────────────────────────

const parseDocx = async (file) => {
  const mammoth = await import('mammoth');
  const arrayBuffer = await readAsArrayBuffer(file);
  const mod = mammoth.default || mammoth;
  const result = await mod.convertToHtml({ arrayBuffer });
  const { markdown, droppedImages } = htmlToMarkdown(result.value || '');
  return { markdown, droppedImages, notes: (result.messages || []).length };
};

const parsePdf = async (file) => {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf');
  const lib = pdfjs.default || pdfjs;
  // Worker is copied to the site root by webpack's CopyPlugin.
  lib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
  const data = await readAsArrayBuffer(file);
  const pdf = await lib.getDocument({ data }).promise;
  const pages = [];
  for (let n = 1; n <= pdf.numPages; n += 1) {
    // Sequential on purpose: pdf.js page handles are cheaper one at a time.
    // eslint-disable-next-line no-await-in-loop
    const page = await pdf.getPage(n);
    // eslint-disable-next-line no-await-in-loop
    const content = await page.getTextContent();
    const lines = [];
    let buf = [];
    let lastY = null;
    content.items.forEach((item) => {
      const y = item.transform[5];
      if (lastY !== null && Math.abs(y - lastY) > 4) {
        lines.push(buf.join(''));
        buf = [];
      }
      buf.push(item.str);
      lastY = y;
    });
    if (buf.length) lines.push(buf.join(''));
    pages.push(lines.join('\n'));
  }
  const text = pages.join('\n\n').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  return { markdown: text, droppedImages: 0, notes: 0 };
};

const parseHtml = async (file) => {
  const raw = await readAsText(file);
  const { markdown, droppedImages } = htmlToMarkdown(raw);
  return { markdown, droppedImages, notes: 0 };
};

const parseMarkdownOrText = async (file) => {
  const raw = await readAsText(file);
  // Same front-matter / page-hint stripping the Gazette engine does, so
  // editorial metadata never becomes legislative text.
  const cleaned = String(raw)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^\uFEFF?\s*---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
    .replace(/\{page=[^}]*\}/g, '');
  return { markdown: cleaned.trim(), droppedImages: 0, notes: 0 };
};

export const SUPPORTED_EXTENSIONS = ['.md', '.markdown', '.txt', '.docx', '.html', '.htm', '.pdf'];

/**
 * Turn an uploaded file into markdown text ready for section splitting.
 * Returns { markdown, sourceFormat, droppedImages, promotedHeadings, warnings }.
 */
export const parseDocument = async (file) => {
  const ext = extFromName(file.name);
  const type = (file.type || '').toLowerCase();
  const warnings = [];
  let sourceFormat = ext || 'txt';
  let parsed;

  if (ext === 'docx' || type.indexOf('officedocument.wordprocessing') !== -1) {
    sourceFormat = 'docx';
    parsed = await parseDocx(file);
  } else if (ext === 'pdf' || type === 'application/pdf') {
    sourceFormat = 'pdf';
    parsed = await parsePdf(file);
    warnings.push(
      'PDF carries no heading structure, so articles were detected by their wording. '
      + 'Review the split carefully — a .docx export gives far more reliable results.',
    );
  } else if (ext === 'html' || ext === 'htm' || type === 'text/html') {
    sourceFormat = 'html';
    parsed = await parseHtml(file);
  } else {
    sourceFormat = ext === 'markdown' ? 'md' : (ext || 'txt');
    parsed = await parseMarkdownOrText(file);
  }

  let { markdown } = parsed;
  let promotedHeadings = 0;

  // If nothing in the document produced a markdown heading, the splitter would
  // return a single giant section. Recover headings from legal wording.
  if (markdown && !/^#{1,6}\s/m.test(markdown)) {
    const recovered = promoteLegalHeadings(markdown);
    markdown = recovered.markdown;
    promotedHeadings = recovered.promoted;
  }

  markdown = smarten(markdown);

  if (parsed.droppedImages > 0) {
    const plural = parsed.droppedImages === 1 ? '' : 's';
    warnings.push(
      `${parsed.droppedImages} image${plural} removed. Only text is stored on-chain — `
      + 'embedded graphics would cost far more than the text itself.',
    );
  }
  if (!markdown) {
    warnings.push('No text could be extracted from this file.');
  }

  return {
    markdown,
    sourceFormat,
    droppedImages: parsed.droppedImages,
    promotedHeadings,
    warnings,
  };
};
