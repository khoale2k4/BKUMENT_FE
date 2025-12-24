import { API_ENDPOINTS } from '@/lib/apiEndPoints';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface ArticleState {
    items: any[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    currentPage: number;
    totalPages: number;
}

const initialState: ArticleState = {
    items: [],
    status: 'idle',
    currentPage: 1,
    totalPages: 1,
};

export const fetchFeed = createAsyncThunk(
    'articles/fetch',
    async ({ category, page }: { category: string; page: number }) => {
        let url = '';
        
        if (category === 'Documents') {
            url = `${API_ENDPOINTS.ARTICLES.GET_ALL}?page=${page}&limit=5`;
        } else {
            url = `${API_ENDPOINTS.ARTICLES.GET_ALL}?category=${category}&page=${page}&limit=5`;
        }

        const response = await fetch(url);
        const data = await response.json();
        
        const mappedItems = data.map((dta: any) => ({
            id: dta.id || Math.random(),
            author: dta.author || dta.uploader, 
            title: dta.title || dta.fileName,
            time: dta.time || dta.createdAt,
            
            content: category === 'Documents' 
                ? (dta.description || "Tài liệu đính kèm") 
                : (dta.content || ""),
            
            assets: dta.assets || dta.image || dta.thumbnailUrl || [], 
            
            tags: dta.tags || (category === 'Documents' ? ['PDF', 'Doc'] : [])
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
    reducers: {},
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

export default articleSlice.reducer;