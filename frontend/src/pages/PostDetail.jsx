import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPostById } from "../services/api";
import { useToast } from "../contexts/ToastContext";
import { findFallbackPost } from "../data/posts";

const formatDate = (value) => {
  if (!value) {
    return "";
  }

  try {
    const normalizedValue =
      typeof value === "string" && value.includes(" ") && !value.includes("T")
        ? value.replace(" ", "T")
        : value;
    const formatter = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formatter.format(new Date(normalizedValue));
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

const normalizePostResponse = (payload) => {
  if (!payload) {
    return null;
  }

  const direct =
    payload.data && !Array.isArray(payload.data) ? payload.data : null;

  if (direct && direct.title && direct.id) {
    return direct;
  }

  if (payload.title && payload.id) {
    return payload;
  }

  const candidates = [
    payload.post,
    payload.item,
    payload.result,
    payload.record,
  ];

  for (const candidate of candidates) {
    if (candidate && candidate.title && candidate.id) {
      return candidate;
    }
  }

  return null;
};

const extractParagraphs = (post) => {
  if (!post) {
    return [];
  }

  const sources = [post.content, post.body, post.details, post.description];

  for (const source of sources) {
    if (!source) {
      continue;
    }

    if (Array.isArray(source)) {
      return source.filter(Boolean);
    }

    if (typeof source === "string") {
      return source
        .split(/\n{2,}|\r\n|\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);
    }
  }

  return [];
};

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const { error: showErrorToast } = useToast();
  const fallbackToastShown = useRef(false);

  useEffect(() => {
    let isCancelled = false;
    fallbackToastShown.current = false;

    const fetchPost = async () => {
      setIsLoading(true);
      setStatusMessage("");

      if (!id) {
        setPost(null);
        setIsFallback(false);
        setStatusMessage("Post id is missing from the URL.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await getPostById(id);

        if (isCancelled) {
          return;
        }

        const normalized = normalizePostResponse(response);

        if (!normalized) {
          throw new Error("Post not found");
        }

        setPost(normalized);
        setIsFallback(false);
        fallbackToastShown.current = false;
      } catch (error) {
        if (isCancelled) {
          return;
        }

        const fallback = findFallbackPost(id);

        if (fallback) {
          setPost(fallback);
          setIsFallback(true);
          setStatusMessage(
            "Showing sample post while the posts service is offline."
          );

          if (!fallbackToastShown.current) {
            showErrorToast(
              "Unable to load this post from the server. Showing sample content instead."
            );
            fallbackToastShown.current = true;
          }
        } else {
          setPost(null);
          setStatusMessage("We could not find the requested post.");

          if (!fallbackToastShown.current) {
            showErrorToast("Unable to load this post.");
            fallbackToastShown.current = true;
          }
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchPost();

    return () => {
      isCancelled = true;
    };
  }, [id, showErrorToast]);

  const paragraphs = useMemo(() => extractParagraphs(post), [post]);

  if (isLoading) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-64 w-full rounded-3xl bg-gray-200" />
          <div className="h-8 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-4 rounded bg-gray-200" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold text-gray-900">Post not found</h1>
        <p className="mt-4 text-gray-600">
          {statusMessage || "The post you are looking for does not exist."}
        </p>
        <Link
          to="/posts"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow hover:bg-blue-700"
        >
          Back to Posts
        </Link>
      </section>
    );
  }

  const createdDate = formatDate(post.created_at);

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/posts" className="hover:text-blue-600">
          Posts
        </Link>
        <span>/</span>
        <span className="text-gray-700">{post.title}</span>
      </div>

      <header className="mt-6">
        <h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
          {post.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <span>{createdDate || "Date not available"}</span>
          {isFallback && <span>&bull; Sample content</span>}
        </div>
      </header>

      {statusMessage && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {statusMessage}
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-3xl">
        <img
          src={post.thumbnail || "https://picsum.photos/960/540?blur=2"}
          alt={post.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="mt-10 space-y-6 text-lg leading-relaxed text-gray-700">
        {paragraphs.length > 0 ? (
          paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
        ) : (
          <p>
            We are preparing the full story for this post. Check back soon for a
            deeper look behind the scenes.
          </p>
        )}
      </div>

      <footer className="mt-12 flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/posts"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to posts
        </Link>
        <span className="text-sm text-gray-400">
          Published {createdDate || "Recently"}
        </span>
      </footer>
    </article>
  );
}
