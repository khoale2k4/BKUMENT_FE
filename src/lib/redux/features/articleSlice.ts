import { API_ENDPOINTS } from '@/lib/apiEndPoints';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface ArticleState {
    items: any[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    currentPage: number;
    totalPages: number;
    pageSize: number;
}

const initialState: ArticleState = {
    items: [],
    status: 'idle',
    currentPage: 0,
    totalPages: 0,
    pageSize: 10,
};

export const fetchFeed = createAsyncThunk(
    'articles/fetch',
    async ({ category, page }: { category: string; page: number }, { getState }) => {
        const state = (getState() as any).articles as ArticleState;
        let url = '';

        if (category === 'Documents') {
            url = API_ENDPOINTS.DOCUMENTS.SEARCH(page, state.pageSize);
        } else {
            url = API_ENDPOINTS.BLOGS.SEARCH(page, state.pageSize);
        }

        const response = await fetch(url);
        const userData = await ((await fetch(API_ENDPOINTS.ACCOUNT.GET_USER_INFO)).json())
        const data = (await response.json()).result;
        const items = data.content;

        const mappedItems = items.map((dta: any) => ({
            id: dta.id || Math.random(),
            author: userData.user,
            title: dta.name || dta.title,
            time: dta.createdAt,

            content: category === 'Documents'
                ? (dta.description || "Tài liệu đính kèm")
                : (dta.content || ""),

            coverImage: dta.coverImage || dta.downloadUrl,
            type: category === 'Documents'
                ? 'DOC'
                : 'BLOG',

            tags: dta.tags || (category === 'Documents' ? ['PDF', 'Doc'] : ['Hot', '24h'])
        }));

        return {
            items: mappedItems,
            page: page,
            totalPages: data.totalPages || 10
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
            .addCase(fetchFeed.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export const { resetFeed } = articleSlice.actions;
export default articleSlice.reducer;