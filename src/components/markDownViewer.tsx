import MarkdownPreview from "@uiw/react-markdown-preview";

export default function MarkdownViewer({ content }: { content: string }) {
  return (
    <MarkdownPreview
      source={content}
      rehypeRewrite={(node, index, parent) => {
        if (
          node.tagName === "a" &&
          parent &&
          /^h(1|2|3|4|5|6)/.test(parent.tagName)
        ) {
          parent.children = parent.children.slice(1);
        }
      }}
      style={{ background: "transparent" }}
    />
  );
}
