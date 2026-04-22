import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as articleService from "@/lib/services/article.service";
import { PersonMayKnow } from "@/lib/services/article.service";
import * as userService from "@/lib/services/user.service";

interface ArticleState {
  items: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;

  searchQuery: string | null;
  searchResults: any[];
  searchStatus: "idle" | "loading" | "succeeded" | "failed";

  peopleMayKnow: PersonMayKnow[];
  peopleStatus: "idle" | "loading" | "succeeded" | "failed";
  peopleCurrentPage: number;
  peopleTotalPages: number;
  followingIds: string[];
}

const initialState: ArticleState = {
  items: [],
  status: "loading",
  error: null,
  currentPage: 0,
  totalPages: 0,
  totalItems: 0,
  pageSize: 10,

  searchQuery: null,
  searchResults: [],
  searchStatus: "loading",

  peopleMayKnow: [],
  peopleStatus: "idle",
  peopleCurrentPage: 0,
  peopleTotalPages: 0,
  followingIds: [],
};

export const fetchFeed = createAsyncThunk(
  "articles/fetch",
  async (
    { category, page }: { category: string; page: number },
    { getState },
  ) => {
    const state = (getState() as any).articles as ArticleState;

    let data;
    if (category === "Documents") {
      data = await articleService.searchDocuments(page, state.pageSize);
      if (data.content.length === 0) {
        data = await articleService.getTopDocuments(page, state.pageSize);
      }
    } else {
      data = await articleService.getTopBlogs(page, state.pageSize);
    }

    const items = data.content;

    const mappedItems = items.map((dta: any) => ({
      id: dta.id || Math.random(),
      author: dta.author,
      title: dta.name || dta.title,
      time: dta.createdAt,

      content:
        category === "Documents"
          ? dta.description || "common.placeholders.documentDescription"
          : dta.content || "",

      coverImage: dta.coverImage || dta.previewImageUrl,
      type: category === "Documents" ? "DOC" : "BLOG",

      tags:
        dta.tags ||
        (category === "Documents" ? ["PDF", "Doc"] : ["common.tags.hot", "common.tags.daily"]),
      views: dta.views || 0,
    }));

    return {
      items: mappedItems,
      page: page,
      totalPages: data.totalPages,
    };
  },
);

export const searchKeyword = createAsyncThunk(
  "articles/search",
  async ({
    query,
    page,
    size,
  }: {
    query: string;
    page: number;
    size: number;
  }) => {
    const data = await articleService.searchContent(query, page, size);

    const mappedItems = data.content.map((result: any) => ({
      id: result.id,
      author: result.author || null,
      title: result.title,
      time: result.createdAt || new Date().toISOString(),

      content: result.description || "common.placeholders.documentDescription",
      totalItems: result.totalElements,

      coverImage:
        result.preview_image_url || result.coverImage || result.previewImageUrl,

      type: result.type || "DOC",

      tags: result.tags || ["common.tags.searchResult"],
      score: result.score,
      views: result.views || 0,
    }));

    return {
      items: mappedItems,
      query: query,
      page: page,
      totalPages: data.totalPages,
      totalItems: data.totalElements,
    };
  },
);

export const fetchPeopleMayKnow = createAsyncThunk(
  "articles/fetchPeopleMayKnow",
  async ({ page, size }: { page: number; size: number }) => {
    const data = await articleService.getPeopleMayKnow(page, size);
    return {
      people: data.data,
      currentPage: data.currentPage,
      totalPages: data.totalPages,
    };
  },
);

export const followPerson = createAsyncThunk(
  "articles/followPerson",
  async (profileId: string) => {
    await articleService.followUser(profileId);
    return profileId;
  },
);

export const unFollowPerson = createAsyncThunk(
  "articles/unFollowPerson",
  async (profileId: string) => {
    await articleService.unFollowUser(profileId);
    return profileId;
  },
);

const articleSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    resetFeed: (state) => {
      state.items = [];
      state.status = "idle";
      state.currentPage = 0;
      state.totalPages = 0;
    },
    clearSearch: (state) => {
      state.searchQuery = null;
      state.searchResults = [];
      state.searchStatus = "idle";
    },
    resetPeople: (state) => {
      state.peopleMayKnow = [];
      state.peopleStatus = "idle";
      state.peopleCurrentPage = 0;
      state.peopleTotalPages = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        if (action.meta.aborted || action.error.name === "AbortError") {
          return;
        }

        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      });

    builder
      .addCase(searchKeyword.pending, (state) => {
        state.searchStatus = "loading";
      })
      .addCase(searchKeyword.fulfilled, (state, action) => {
        state.searchStatus = "succeeded";
        state.searchResults = action.payload.items;
        state.searchQuery = action.payload.query;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(searchKeyword.rejected, (state, action) => {
        if (action.meta.aborted || action.error.name === "AbortError") {
          return;
        }

        state.searchStatus = "failed";
        state.error = action.error.message || "Something went wrong";
      });

    builder
      .addCase(fetchPeopleMayKnow.pending, (state) => {
        state.peopleStatus = "loading";
      })
      .addCase(fetchPeopleMayKnow.fulfilled, (state, action) => {
        state.peopleStatus = "succeeded";
        state.peopleMayKnow = action.payload.people;
        state.peopleCurrentPage = action.payload.currentPage;
        state.peopleTotalPages = action.payload.totalPages;
      })
      .addCase(fetchPeopleMayKnow.rejected, (state) => {
        state.peopleStatus = "failed";
      });

    builder.addCase(followPerson.fulfilled, (state, action) => {
      state.followingIds.push(action.payload);
    });
    builder.addCase(unFollowPerson.fulfilled, (state, action) => {
      // Lọc bỏ ID của người vừa unfollow khỏi mảng
      state.followingIds = state.followingIds.filter(
        (id) => id !== action.payload,
      );
    });
  },
});

export const { resetFeed, clearSearch, resetPeople } = articleSlice.actions;
export default articleSlice.reducer;
