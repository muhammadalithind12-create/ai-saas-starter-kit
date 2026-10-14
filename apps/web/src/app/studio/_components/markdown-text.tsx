import { Fragment } from "react";

// Minimal renderer for the Markdown our blog generator produces:
// ## / ### headings, **bold**, - bullets, and plain paragraphs.
function renderInline(text: string, keyBase: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const bold = part.match(/^\*\*(.+)\*\*$/);
    if (bold) {
      return (
        <strong key={`${keyBase}-${i}`} className="font-semibold">
          {bold[1]}
        </strong>
      );
    }
    return <Fragment key={`${keyBase}-${i}`}>{part}</Fragment>;
  });
}

export function MarkdownText({ text }: { text: string }) {
  const blocks: React.ReactNode[] = [];
  const lines = text.split("\n");
  let listItems: string[] = [];

  function flushList(key: string) {
    if (listItems.length > 0) {
      blocks.push(
        <ul key={key} className="my-3 list-disc space-y-1.5 pl-6">
          {listItems.map((item, i) => (
            <li key={i} className="text-[15px] leading-relaxed">
              {renderInline(item, `${key}-${i}`)}
            </li>
          ))}
        </ul>,
      );
      listItems = [];
    }
  }

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (/^#{1,3}\s/.test(trimmed)) {
      flushList(`list-${idx}`);
      const level = trimmed.match(/^#+/)![0].length;
      const content = trimmed.replace(/^#+\s*/, "");
      const cls =
        level === 1
          ? "mt-6 mb-3 text-2xl font-bold tracking-tight"
          : "mt-5 mb-2 text-lg font-semibold tracking-tight";
      blocks.push(
        <div key={idx} className={cls}>
          {renderInline(content, `h-${idx}`)}
        </div>,
      );
    } else if (/^[-*]\s+/.test(trimmed)) {
      listItems.push(trimmed.replace(/^[-*]\s+/, ""));
    } else if (trimmed === "") {
      flushList(`list-${idx}`);
    } else {
      flushList(`list-${idx}`);
      blocks.push(
        <p key={idx} className="my-3 text-[15px] leading-relaxed">
          {renderInline(trimmed, `p-${idx}`)}
        </p>,
      );
    }
  });
  flushList("list-end");

  return <div>{blocks}</div>;
}
