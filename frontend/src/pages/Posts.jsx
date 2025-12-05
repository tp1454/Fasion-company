import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";
import { getPosts } from "../services/api";
import { useToast } from "../contexts/ToastContext";
import FALLBACK_POSTS from "../data/posts";

const PAGE_SIZE = 6;

const normalizePostsResponse = (payload) => {
  if (!payload) {
    return { items: [], totalPages: 1 };
  }

  if (Array.isArray(payload)) {
    return { items: payload, totalPages: 1 };
  }

  if (Array.isArray(payload.data)) {
    const pagination = payload.pagination || {};
    const total =
      typeof pagination.total === "number"
        ? pagination.total
        : payload.data.length;
    const limit =
      typeof pagination.limit === "number" && pagination.limit > 0
        ? pagination.limit
        : PAGE_SIZE;
    const totalPages =
      pagination.totalPages ??
      pagination.total_pages ??
      Math.ceil(total / limit || 1);

    return {
      items: payload.data,
      totalPages: Math.max(1, totalPages),
    };
  }

  return { items: [], totalPages: 1 };
};

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

const getExcerpt = (content = "") => {
  if (!content) {
    return "";
  }

  const text = content.replace(/\s+/g, " ").trim();
  if (text.length <= 160) {
    return text;
  }

  return `${text.slice(0, 157)}...`;
};

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const { error: showErrorToast } = useToast();
  const fallbackToastShown = useRef(false);

  const filteredFallback = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return FALLBACK_POSTS;
    }

    return FALLBACK_POSTS.filter((post) => {
      const haystack = [post.title, post.content]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [searchTerm]);

  useEffect(() => {
    let isCancelled = false;

    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await getPosts({
          page: currentPage,
          limit: PAGE_SIZE,
          search: searchTerm.trim() || undefined,
        });

        if (isCancelled) {
          return;
        }

        const normalized = normalizePostsResponse(response);
        const safeTotalPages = Math.max(1, normalized.totalPages);

        setPosts(Array.isArray(normalized.items) ? normalized.items : []);
        setTotalPages(safeTotalPages);
        setIsUsingFallback(false);
        setStatusMessage("");
        fallbackToastShown.current = false;

        if (currentPage > safeTotalPages) {
          setCurrentPage(safeTotalPages);
        }
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setIsUsingFallback(true);
        setStatusMessage(
          "Showing sample posts while the posts service is offline."
        );

        if (!fallbackToastShown.current) {
          showErrorToast(
            "Unable to load posts from the server. Showing sample posts instead."
          );
          fallbackToastShown.current = true;
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      isCancelled = true;
    };
  }, [currentPage, searchTerm, showErrorToast]);

  useEffect(() => {
    if (!isUsingFallback) {
      return;
    }

    const totalFallbackPages = Math.max(
      1,
      Math.ceil(filteredFallback.length / PAGE_SIZE)
    );

    if (filteredFallback.length === 0) {
      if (currentPage !== 1) {
        setCurrentPage(1);
        return;
      }

      setPosts([]);
      setTotalPages(1);
      return;
    }

    if (currentPage > totalFallbackPages) {
      setCurrentPage(totalFallbackPages);
      return;
    }

    const start = (currentPage - 1) * PAGE_SIZE;
    const paginated = filteredFallback.slice(start, start + PAGE_SIZE);

    setPosts(paginated);
    setTotalPages(totalFallbackPages);
  }, [isUsingFallback, filteredFallback, currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page === currentPage || page > totalPages) {
      return;
    }
    setCurrentPage(page);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <header className="text-center md:text-left">
        <p className="text-sm uppercase tracking-wider text-blue-600 font-semibold">
          Stories
        </p>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
          Company Posts
        </h1>
        <p className="mt-3 text-base text-gray-600 md:w-3/4">
          Stay updated with the latest launches, behind-the-scenes stories, and
          sustainability initiatives from our team.
        </p>
      </header>

      <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-80">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
              />
            </svg>
          </span>
          <input
            type="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search posts"
            className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {statusMessage && (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {statusMessage}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 h-40 w-full rounded-xl bg-gray-200" />
              <div className="mb-2 h-4 rounded bg-gray-200" />
              <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-2/5 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {posts.length === 0 ? (
            <div className="mt-16 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
              <h2 className="text-xl font-semibold text-gray-800">
                No posts to show yet
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Connect the posts API or adjust your search filters to see
                content here.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    <img
                      src={
                        post.thumbnail ||
                        "https://picsum.photos/640/360?grayscale"
                      }
                      alt={post.title || "Post thumbnail"}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-600">
                        Post
                      </span>
                      <span>{formatDate(post.created_at)}</span>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-gray-900">
                      {post.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">
                      {getExcerpt(post.content)}
                    </p>

                    <div className="mt-6 flex items-center justify-end text-sm text-gray-500">
                      <Link
                        to={`/posts/${post.id}`}
                        className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Read more
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
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </section>
  );
}
