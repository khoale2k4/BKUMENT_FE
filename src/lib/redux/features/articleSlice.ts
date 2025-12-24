import { API_ENDPOINTS } from '@/lib/apiEndPoints';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface ArticleState {
    items: Article[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ArticleState = {
    items: [],
    status: 'idle',
    error: null,
};

export const fetchArticles = createAsyncThunk('articles/fetch', async () => {
    const response = await fetch(API_ENDPOINTS.ARTICLES.GET_ALL);
    const data = await response.json();
    return data.map((dta: any) => ({
        id: dta.id || Math.random(),
        author: dta.author,
        title: dta.title,
        time: dta.time,
        content: dta.content || "",
        assets: dta.assets || dta.image || "",
        tags: dta.tags || []
    }));
});

const articleSlice = createSlice({
    name: 'articles',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchArticles.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchArticles.fulfilled, (state, action: PayloadAction<Article[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchArticles.rejected, (state) => {
                state.status = 'failed';
                state.error = "Không tải được dữ liệu";
            });
    },
});

export default articleSlice.reducer;