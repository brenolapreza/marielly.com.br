import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

export const notion = new Client({
  auth: "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",
});

export const n2m = new NotionToMarkdown({ notionClient: notion });
