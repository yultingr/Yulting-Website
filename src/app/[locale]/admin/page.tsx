"use client";

import {
  useState,
  useEffect,
  useActionState,
  useTransition,
  useRef,
  useCallback,
} from "react";
import { Container } from "@/components/layout/Container";
import { type Video } from "@/data/videos";
import type { BlogPostMeta, BlogPost } from "@/types";
import {
  login,
  logout,
  isAuthenticated,
  getVideos,
  addVideo,
  deleteVideo,
  reorderVideos,
  getBlogPosts,
  getBlogPost,
  saveBlogPost,
  deleteBlogPost,
} from "@/lib/actions";

// ---------------------------------------------------------------------------
// Login form
// ---------------------------------------------------------------------------

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [state, formAction, pending] = useActionState(login, null);

  useEffect(() => {
    if (state?.success) {
      onSuccess();
    }
  }, [state, onSuccess]);

  return (
    <section className="py-20">
      <Container>
        <div className="mx-auto max-w-md">
          <div className="mb-10 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Admin Panel
            </span>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">
              Sign In
            </h1>
            <p className="mt-3 text-muted-foreground">
              Enter your password to access the admin panel.
            </p>
          </div>

          <form
            action={formAction}
            className="rounded-2xl border border-border bg-card p-6 sm:p-8"
          >
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-card-foreground"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoFocus
              required
              placeholder="Enter admin password..."
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />

            {state?.error && (
              <p className="mt-3 text-sm text-red-500">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="mt-6 w-full rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {pending ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Markdown formatting toolbar helper
// ---------------------------------------------------------------------------

type FormatAction = {
  label: string;
  icon: React.ReactNode;
  action: (
    textarea: HTMLTextAreaElement,
    setContent: (val: string) => void,
  ) => void;
  title: string;
};

function wrapSelection(
  textarea: HTMLTextAreaElement,
  setContent: (val: string) => void,
  before: string,
  after: string,
  placeholder: string,
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selected = text.slice(start, end) || placeholder;

  const newText = text.slice(0, start) + before + selected + after + text.slice(end);
  setContent(newText);

  requestAnimationFrame(() => {
    textarea.focus();
    const newStart = start + before.length;
    const newEnd = newStart + selected.length;
    textarea.setSelectionRange(newStart, newEnd);
  });
}

function insertAtCursor(
  textarea: HTMLTextAreaElement,
  setContent: (val: string) => void,
  insert: string,
) {
  const start = textarea.selectionStart;
  const text = textarea.value;
  const newText = text.slice(0, start) + insert + text.slice(start);
  setContent(newText);

  requestAnimationFrame(() => {
    textarea.focus();
    const pos = start + insert.length;
    textarea.setSelectionRange(pos, pos);
  });
}

function prefixLines(
  textarea: HTMLTextAreaElement,
  setContent: (val: string) => void,
  prefix: string,
  placeholder: string,
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selected = text.slice(start, end);

  if (!selected) {
    const insert = prefix + placeholder;
    const newText = text.slice(0, start) + insert + text.slice(end);
    setContent(newText);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + insert.length,
      );
    });
    return;
  }

  const lines = selected.split("\n");
  const prefixed = lines.map((l) => prefix + l).join("\n");
  const newText = text.slice(0, start) + prefixed + text.slice(end);
  setContent(newText);

  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(start, start + prefixed.length);
  });
}

const TOOLBAR_ACTIONS: FormatAction[] = [
  {
    label: "Bold",
    title: "Bold (Ctrl+B)",
    icon: <span className="font-bold">B</span>,
    action: (ta, set) => wrapSelection(ta, set, "**", "**", "bold text"),
  },
  {
    label: "Italic",
    title: "Italic (Ctrl+I)",
    icon: <span className="italic">I</span>,
    action: (ta, set) => wrapSelection(ta, set, "*", "*", "italic text"),
  },
  {
    label: "Strikethrough",
    title: "Strikethrough",
    icon: <span className="line-through">S</span>,
    action: (ta, set) =>
      wrapSelection(ta, set, "~~", "~~", "strikethrough text"),
  },
  {
    label: "H1",
    title: "Heading 1",
    icon: (
      <span className="text-xs font-bold">
        H<sub>1</sub>
      </span>
    ),
    action: (ta, set) => prefixLines(ta, set, "# ", "Heading 1"),
  },
  {
    label: "H2",
    title: "Heading 2",
    icon: (
      <span className="text-xs font-bold">
        H<sub>2</sub>
      </span>
    ),
    action: (ta, set) => prefixLines(ta, set, "## ", "Heading 2"),
  },
  {
    label: "H3",
    title: "Heading 3",
    icon: (
      <span className="text-xs font-bold">
        H<sub>3</sub>
      </span>
    ),
    action: (ta, set) => prefixLines(ta, set, "### ", "Heading 3"),
  },
  {
    label: "UL",
    title: "Bullet List",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
    action: (ta, set) => prefixLines(ta, set, "- ", "List item"),
  },
  {
    label: "OL",
    title: "Numbered List",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="10" y1="6" x2="21" y2="6" />
        <line x1="10" y1="12" x2="21" y2="12" />
        <line x1="10" y1="18" x2="21" y2="18" />
        <path d="M4 6h1v4" />
        <path d="M4 10h2" />
        <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
      </svg>
    ),
    action: (ta, set) => prefixLines(ta, set, "1. ", "List item"),
  },
  {
    label: "Quote",
    title: "Blockquote",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" />
        <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z" />
      </svg>
    ),
    action: (ta, set) => prefixLines(ta, set, "> ", "Quote text"),
  },
  {
    label: "Code",
    title: "Inline Code",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    action: (ta, set) => wrapSelection(ta, set, "`", "`", "code"),
  },
  {
    label: "Code Block",
    title: "Code Block",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <polyline points="9 8 5 12 9 16" />
        <polyline points="15 8 19 12 15 16" />
      </svg>
    ),
    action: (ta, set) =>
      wrapSelection(ta, set, "```\n", "\n```", "code here"),
  },
  {
    label: "Link",
    title: "Link",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    action: (ta, set) => {
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const text = ta.value;
      const selected = text.slice(start, end) || "link text";
      const insert = `[${selected}](url)`;
      const newText = text.slice(0, start) + insert + text.slice(end);
      set(newText);
      requestAnimationFrame(() => {
        ta.focus();
        // Select "url" part
        const urlStart = start + selected.length + 3;
        ta.setSelectionRange(urlStart, urlStart + 3);
      });
    },
  },
  {
    label: "Image",
    title: "Image",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    action: (ta, set) => {
      const start = ta.selectionStart;
      const text = ta.value;
      const insert = "![alt text](image-url)";
      const newText = text.slice(0, start) + insert + text.slice(start);
      set(newText);
      requestAnimationFrame(() => {
        ta.focus();
        // Select "image-url"
        const urlStart = start + 12;
        ta.setSelectionRange(urlStart, urlStart + 9);
      });
    },
  },
  {
    label: "HR",
    title: "Horizontal Rule",
    icon: <span className="text-xs font-bold">---</span>,
    action: (ta, set) => insertAtCursor(ta, set, "\n---\n"),
  },
];

// ---------------------------------------------------------------------------
// Markdown Editor Component
// ---------------------------------------------------------------------------

function MarkdownEditor({
  content,
  setContent,
}: {
  content: string;
  setContent: (val: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const ta = e.currentTarget;

      // Ctrl/Cmd + B for bold
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        wrapSelection(ta, setContent, "**", "**", "bold text");
      }
      // Ctrl/Cmd + I for italic
      if ((e.ctrlKey || e.metaKey) && e.key === "i") {
        e.preventDefault();
        wrapSelection(ta, setContent, "*", "*", "italic text");
      }
      // Tab for indent
      if (e.key === "Tab") {
        e.preventDefault();
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const text = ta.value;
        const newText = text.slice(0, start) + "  " + text.slice(end);
        setContent(newText);
        requestAnimationFrame(() => {
          ta.focus();
          ta.setSelectionRange(start + 2, start + 2);
        });
      }
    },
    [setContent],
  );

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 rounded-t-lg border border-border bg-muted/50 px-2 py-1.5">
        {TOOLBAR_ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            title={action.title}
            onClick={() => {
              if (textareaRef.current) {
                action.action(textareaRef.current, setContent);
              }
            }}
            className="flex h-8 w-8 items-center justify-center rounded text-sm text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            {action.icon}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
              !showPreview
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
              showPreview
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Editor / Preview */}
      {showPreview ? (
        <div className="min-h-[400px] rounded-b-lg border border-t-0 border-border bg-background p-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <MarkdownPreview content={content} />
          </div>
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write your blog post content in Markdown..."
          className="min-h-[400px] w-full resize-y rounded-b-lg border border-t-0 border-border bg-background px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      )}
    </div>
  );
}

// Simple markdown preview (renders basic markdown to HTML)
function MarkdownPreview({ content }: { content: string }) {
  if (!content) {
    return (
      <p className="text-muted-foreground italic">Nothing to preview yet.</p>
    );
  }

  // Convert basic markdown to HTML for preview
  let html = content
    // Code blocks
    .replace(
      /```(\w*)\n([\s\S]*?)```/g,
      '<pre class="bg-muted rounded-lg p-4 overflow-x-auto"><code>$2</code></pre>',
    )
    // Headings
    .replace(
      /^### (.+)$/gm,
      '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>',
    )
    .replace(
      /^## (.+)$/gm,
      '<h2 class="text-xl font-semibold mt-6 mb-2">$1</h2>',
    )
    .replace(
      /^# (.+)$/gm,
      '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>',
    )
    // Bold & italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/~~(.+?)~~/g, "<del>$1</del>")
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-muted rounded px-1.5 py-0.5 text-sm">$1</code>')
    // Links & images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg max-w-full" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-accent underline">$1</a>')
    // Blockquotes
    .replace(
      /^> (.+)$/gm,
      '<blockquote class="border-l-4 border-accent pl-4 italic text-muted-foreground">$1</blockquote>',
    )
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="my-4 border-border" />')
    // Paragraphs (double newline)
    .replace(/\n\n/g, '</p><p class="mb-3">')
    // Single line breaks
    .replace(/\n/g, "<br />");

  html = '<p class="mb-3">' + html + "</p>";

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

// ---------------------------------------------------------------------------
// Blog Editor Form
// ---------------------------------------------------------------------------

function BlogEditor({
  post,
  onSave,
  onCancel,
}: {
  post?: BlogPost | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [summary, setSummary] = useState(post?.summary ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [tags, setTags] = useState(post?.tags?.join(", ") ?? "");
  const [date, setDate] = useState(
    post?.date ?? new Date().toISOString().slice(0, 10),
  );
  const [published, setPublished] = useState(post?.published ?? true);
  const [autoSlug, setAutoSlug] = useState(!post);

  const [saveState, saveFormAction, savePending] = useActionState(
    saveBlogPost,
    null,
  );

  useEffect(() => {
    if (saveState?.success) {
      onSave();
    }
  }, [saveState, onSave]);

  // Auto-generate slug from title
  useEffect(() => {
    if (autoSlug && title) {
      const generated = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(generated);
    }
  }, [title, autoSlug]);

  return (
    <form action={saveFormAction} className="space-y-6">
      {/* Hidden fields */}
      <input type="hidden" name="locale" value="en" />
      {post && <input type="hidden" name="originalSlug" value={post.slug} />}

      {/* Title */}
      <div>
        <label className="mb-2 block text-sm font-medium text-card-foreground">
          Title
        </label>
        <input
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Blog Post Title"
          required
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>

      {/* Slug + Date */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-card-foreground">
            Slug (URL)
          </label>
          <div className="flex items-center gap-2">
            <input
              name="slug"
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setAutoSlug(false);
              }}
              placeholder="my-blog-post"
              required
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            /blog/{slug || "my-post"}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-card-foreground">
            Date
          </label>
          <input
            name="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </div>

      {/* Summary */}
      <div>
        <label className="mb-2 block text-sm font-medium text-card-foreground">
          Summary
        </label>
        <textarea
          name="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="A brief description of the post..."
          required
          rows={2}
          className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="mb-2 block text-sm font-medium text-card-foreground">
          Tags
        </label>
        <input
          name="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="personal, announcement, tech"
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Comma-separated list of tags
        </p>
      </div>

      {/* Content Editor */}
      <div>
        <label className="mb-2 block text-sm font-medium text-card-foreground">
          Content (Markdown)
        </label>
        <input type="hidden" name="content" value={content} />
        <MarkdownEditor content={content} setContent={setContent} />
      </div>

      {/* Published toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setPublished(!published)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
            published ? "bg-accent" : "bg-border"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
              published ? "translate-x-5.5" : "translate-x-0.5"
            } mt-0.5`}
          />
        </button>
        <label className="text-sm font-medium text-card-foreground">
          {published ? "Published" : "Draft"}
        </label>
        <input type="hidden" name="published" value={String(published)} />
      </div>

      {/* Error */}
      {saveState?.error && (
        <p className="text-sm text-red-500">{saveState.error}</p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={savePending}
          className="inline-flex items-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {savePending
            ? "Saving..."
            : post
              ? "Update Post"
              : "Create Post"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Videos Tab
// ---------------------------------------------------------------------------

function VideosTab() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [mounted, setMounted] = useState(false);
  const [addState, addFormAction, addPending] = useActionState(addVideo, null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    getVideos().then((v) => {
      setVideos(v);
      setMounted(true);
    });
  }, []);

  useEffect(() => {
    if (addState === null && mounted) {
      getVideos().then(setVideos);
    }
  }, [addState, mounted]);

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteVideo(id);
      const updated = await getVideos();
      setVideos(updated);
    });
  }

  function handleMoveUp(index: number) {
    if (index === 0) return;
    const updated = [...videos];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setVideos(updated);
    startTransition(async () => {
      await reorderVideos(updated.map((v) => v.id));
    });
  }

  function handleMoveDown(index: number) {
    if (index === videos.length - 1) return;
    const updated = [...videos];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setVideos(updated);
    startTransition(async () => {
      await reorderVideos(updated.map((v) => v.id));
    });
  }

  if (!mounted) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Loading videos...
      </div>
    );
  }

  return (
    <div>
      {/* Add Video Form */}
      <form
        action={addFormAction}
        className="mb-12 rounded-2xl border border-border bg-card p-6 sm:p-8"
      >
        <h2 className="mb-6 text-xl font-semibold text-card-foreground">
          Add New Video
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="video-url"
              className="mb-2 block text-sm font-medium text-card-foreground"
            >
              Video URL
            </label>
            <input
              id="video-url"
              name="url"
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Supports YouTube and Facebook video URLs
            </p>
          </div>

          <div>
            <label
              htmlFor="video-title"
              className="mb-2 block text-sm font-medium text-card-foreground"
            >
              Title
            </label>
            <input
              id="video-title"
              name="title"
              type="text"
              placeholder="Enter video title..."
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>

        <div className="mt-4">
          <label
            htmlFor="video-category"
            className="mb-2 block text-sm font-medium text-card-foreground"
          >
            Category (optional)
          </label>
          <input
            id="video-category"
            name="category"
            type="text"
            placeholder="e.g. Teachings, COVID-19 Series..."
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 sm:max-w-md"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Videos with the same category are grouped together on the Videos
            page
          </p>
        </div>

        {addState?.error && (
          <p className="mt-3 text-sm text-red-500">{addState.error}</p>
        )}

        <button
          type="submit"
          disabled={addPending}
          className="mt-6 inline-flex items-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {addPending ? "Adding..." : "Add Video"}
        </button>
      </form>

      {/* Video List */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          Videos ({videos.length})
        </h2>
      </div>

      {videos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="text-muted-foreground">
            No videos yet. Add one using the form above.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-all"
            >
              <div className="relative aspect-video w-full">
                {video.platform === "youtube" ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    title={video.title || "Video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                ) : (
                  <iframe
                    src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(video.videoId)}&show_text=false`}
                    title={video.title || "Video"}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                )}
              </div>

              <div className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-card-foreground">
                    {video.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {video.platform === "youtube" ? "YouTube" : "Facebook"}{" "}
                    &middot; {video.videoId.slice(0, 20)}
                    {video.videoId.length > 20 ? "..." : ""}
                    {video.category && (
                      <>
                        {" "}
                        &middot;{" "}
                        <span className="text-accent">{video.category}</span>
                      </>
                    )}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
                    title="Move up"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                  </button>

                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === videos.length - 1}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
                    title="Move down"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  <button
                    onClick={() => handleDelete(video.id)}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                    title="Delete video"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Blog Tab
// ---------------------------------------------------------------------------

function BlogTab() {
  const [posts, setPosts] = useState<BlogPostMeta[]>([]);
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [, startTransition] = useTransition();

  const loadPosts = useCallback(async () => {
    const p = await getBlogPosts("en");
    setPosts(p);
  }, []);

  useEffect(() => {
    loadPosts().then(() => setMounted(true));
  }, [loadPosts]);

  function handleEdit(slug: string) {
    startTransition(async () => {
      const post = await getBlogPost(slug, "en");
      if (post) {
        setEditingPost(post);
        setView("edit");
      }
    });
  }

  function handleDelete(slug: string) {
    if (!confirm("Are you sure you want to delete this post?")) return;
    startTransition(async () => {
      await deleteBlogPost(slug, "en");
      await loadPosts();
    });
  }

  function handleSaved() {
    setView("list");
    setEditingPost(null);
    startTransition(async () => {
      await loadPosts();
    });
  }

  if (!mounted) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Loading blog posts...
      </div>
    );
  }

  // Create / Edit view
  if (view === "create" || view === "edit") {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h2 className="mb-6 text-xl font-semibold text-card-foreground">
          {view === "create" ? "Create New Post" : "Edit Post"}
        </h2>
        <BlogEditor
          post={view === "edit" ? editingPost : null}
          onSave={handleSaved}
          onCancel={() => {
            setView("list");
            setEditingPost(null);
          }}
        />
      </div>
    );
  }

  // List view
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          Blog Posts ({posts.length})
        </h2>
        <button
          onClick={() => setView("create")}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Post
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <div className="mb-3 text-4xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-muted-foreground/50">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <p className="text-muted-foreground">
            No blog posts yet. Create your first post!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-accent/30"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-card-foreground">
                    {post.title}
                  </h3>
                  {!post.published && (
                    <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
                      Draft
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {post.summary}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{post.date}</span>
                  <span>&middot;</span>
                  <span>{post.readingTime}</span>
                  {post.tags && post.tags.length > 0 && (
                    <>
                      <span>&middot;</span>
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-muted px-2 py-0.5 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => handleEdit(post.slug)}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  title="Edit post"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>

                <button
                  onClick={() => handleDelete(post.slug)}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                  title="Delete post"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Admin Dashboard with Tabs
// ---------------------------------------------------------------------------

type Tab = "videos" | "blog";

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>("videos");
  const [, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logout();
      onLogout();
    });
  }

  return (
    <section className="py-20">
      <Container>
        {/* Header */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Admin Panel
            </span>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Dashboard
            </h1>
            <p className="mt-3 text-muted-foreground">
              Manage your videos and blog posts. Changes are saved automatically.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="shrink-0 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Sign Out
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 flex gap-1 rounded-xl border border-border bg-muted/50 p-1">
          <button
            onClick={() => setActiveTab("videos")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === "videos"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            Videos
          </button>
          <button
            onClick={() => setActiveTab("blog")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === "blog"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            Blog
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "videos" && <VideosTab />}
        {activeTab === "blog" && <BlogTab />}
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    isAuthenticated().then(setAuthed);
  }, []);

  if (authed === null) {
    return (
      <section className="py-20">
        <Container>
          <div className="text-center text-muted-foreground">Loading...</div>
        </Container>
      </section>
    );
  }

  if (!authed) {
    return <LoginForm onSuccess={() => setAuthed(true)} />;
  }

  return <AdminDashboard onLogout={() => setAuthed(false)} />;
}
