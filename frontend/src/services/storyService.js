import api from './api';

export const storyService = {
  getStories: async (page = 1, limit = 10) => {
    const response = await api.get(`/stories?page=${page}&limit=${limit}`);
    return response.data;
  },

  getStoryById: async (id) => {
    const response = await api.get(`/stories/${id}`);
    return response.data.data;
  },

  getStats: async () => {
    const response = await api.get('/stories/stats');
    return response.data.data;
  },

  triggerScrape: async () => {
    const response = await api.post('/stories/scrape');
    return response.data;
  },

  deleteStory: async (id) => {
    const response = await api.delete(`/stories/${id}`);
    return response.data;
  },

  addBookmark: async (storyId) => {
    const response = await api.post(`/users/bookmarks/${storyId}`);
    return response.data;
  },

  removeBookmark: async (storyId) => {
    const response = await api.delete(`/users/bookmarks/${storyId}`);
    return response.data;
  },

  getBookmarks: async () => {
    const response = await api.get('/users/bookmarks');
    return response.data.data;
  },

  isBookmarked: async (storyId) => {
    const response = await api.get(`/users/bookmarks/check/${storyId}`);
    return response.data;
  },
};
