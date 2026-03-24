import { PostMarkdownProgressive } from "@/components/posts/PostMarkdownProgressive";

function splitMarkdownIntoChunks(source: string) {
  const lines = source.split(/\r?\n/);
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentLength = 0;
  let inFence = false;

  const pushChunk = () => {
    const value = currentChunk.join("\n").trim();
    if (value) {
      chunks.push(value);
    }
    currentChunk = [];
    currentLength = 0;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      inFence = !inFence;
    }

    const isHeading = /^#{1,4}\s/.test(trimmed);
    const canSplitAtHeading = !inFence && isHeading && currentLength > 1400;
    const canSplitAtBlank = !inFence && trimmed === "" && currentLength > 2600;

    if (canSplitAtHeading || canSplitAtBlank) {
      pushChunk();
    }

    currentChunk.push(line);
    currentLength += line.length + 1;
  }

  pushChunk();

  return chunks.length > 0 ? chunks : [source];
}

export function PostMarkdownContent({ source }: { source: string }) {
  const chunks = splitMarkdownIntoChunks(source);
  return <PostMarkdownProgressive chunks={chunks} />;
}
