import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as articleService from '@/lib/services/article.service';
import * as userService from '@/lib/services/user.service';

interface ArticleState {
    items: any[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    currentPage: number;
    totalPages: number;
    pageSize: number;

    // Search state
    searchQuery: string | null;
    searchResults: any[];
    searchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: ArticleState = {
    items: [],
    status: 'idle',
    error: null,
    currentPage: 0,
    totalPages: 0,
    pageSize: 10,

    searchQuery: null,
    searchResults: [],
    searchStatus: 'idle',
};

export const fetchFeed = createAsyncThunk(
    'articles/fetch',
    async ({ category, page }: { category: string; page: number }, { getState }) => {
        const state = (getState() as any).articles as ArticleState;

        let data;
        if (category === 'Documents') {
            data = await articleService.searchDocuments(page, state.pageSize);
        } else {
            data = await articleService.searchBlogs(page, state.pageSize);
        }

        const userData = await userService.getUserInfo();
        const items = data.content;

        const mappedItems = items.map((dta: any) => ({
            id: dta.id || Math.random(),
            author: userData.user,
            title: dta.name || dta.title,
            time: dta.createdAt,

            content: category === 'Documents'
                ? (dta.description || "Tài liệu đính kèm")
                : (dta.content || ""),

            coverImage: dta.coverImage || dta.previewImageUrl,
            type: category === 'Documents'
                ? 'DOC'
                : 'BLOG',

            tags: dta.tags || (category === 'Documents' ? ['PDF', 'Doc'] : ['Hot', '24h'])
        }));

        return {
            items: mappedItems,
            page: page,
            totalPages: data.totalPages
        };
    }
);

export const searchKeyword = createAsyncThunk(
    'articles/search',
    async ({ query, page, size }: { query: string; page: number; size: number }) => {
        const data = await articleService.searchContent(query, page, size);
        const userData = await userService.getUserInfo();

        const mappedItems = data.content.map((result: any) => ({
            id: result.id,
            author: userData.user,
            title: result.title,
            time: result.created_at || new Date().toISOString(),
            content: result.description || "Kết quả tìm kiếm",
            coverImage: result.preview_image_url || result.coverImage,
            type: 'DOC',
            tags: result.tags || ['Search Result'],
            score: result.score
        }));

        return {
            items: mappedItems,
            query: query,
            page: page,
            totalPages: data.totalPages
        };
    }
);

const articleSlice = createSlice({
    name: 'articles',
    initialState,
    reducers: {
        resetFeed: (state) => {
            state.items = [];
            state.status = 'idle';
            state.currentPage = 0;
            state.totalPages = 0;
        },
        clearSearch: (state) => {
            state.searchQuery = null;
            state.searchResults = [];
            state.searchStatus = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFeed.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFeed.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.items;
                state.currentPage = action.payload.page;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchFeed.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch articles';
            });

        builder
            .addCase(searchKeyword.pending, (state) => {
                state.searchStatus = 'loading';
            })
            .addCase(searchKeyword.fulfilled, (state, action) => {
                state.searchStatus = 'succeeded';
                state.searchResults = action.payload.items;
                state.searchQuery = action.payload.query;
                state.currentPage = action.payload.page;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(searchKeyword.rejected, (state, action) => {
                state.searchStatus = 'failed';
                state.error = action.error.message || 'Search failed';
            });
    },
});

export const { resetFeed, clearSearch } = articleSlice.actions;
export default articleSlice.reducer;