import { create } from 'zustand';
import axios from 'axios';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Organizations store
export const useOrganizationsStore = create((set, get) => ({
  organizations: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedOrganization: null,

  // Set authorization header
  setAuthToken: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  },

  // Fetch all organizations
  fetchOrganizations: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get('/organizations');
      set({ 
        organizations: response.data, 
        loading: false 
      });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message;
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Create new organization
  createOrganization: async (organizationData) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post('/organizations', organizationData);
      const newOrganization = response.data;
      
      set(state => ({ 
        organizations: [...state.organizations, newOrganization],
        loading: false 
      }));
      
      return { success: true, data: newOrganization };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message;
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Update organization
  updateOrganization: async (id, organizationData) => {
    try {
      set({ loading: true, error: null });
      const response = await api.put(`/organizations/${id}`, organizationData);
      const updatedOrganization = response.data;
      
      set(state => ({ 
        organizations: state.organizations.map(org => 
          org.id === id ? updatedOrganization : org
        ),
        selectedOrganization: state.selectedOrganization?.id === id 
          ? updatedOrganization 
          : state.selectedOrganization,
        loading: false 
      }));
      
      return { success: true, data: updatedOrganization };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message;
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Delete organization
  deleteOrganization: async (id) => {
    try {
      set({ loading: true, error: null });
      await api.delete(`/organizations/${id}`);
      
      set(state => ({ 
        organizations: state.organizations.filter(org => org.id !== id),
        selectedOrganization: state.selectedOrganization?.id === id 
          ? null 
          : state.selectedOrganization,
        loading: false 
      }));
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message;
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Search organizations
  searchOrganizations: async (query) => {
    try {
      set({ loading: true, error: null, searchQuery: query });
      
      if (!query.trim()) {
        // If no query, fetch all organizations
        const response = await api.get('/organizations');
        set({ 
          organizations: response.data, 
          loading: false 
        });
      } else {
        // Search with query
        const response = await api.get(`/organizations/search/${encodeURIComponent(query)}`);
        set({ 
          organizations: response.data, 
          loading: false 
        });
      }
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message;
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Set selected organization
  setSelectedOrganization: (organization) => {
    set({ selectedOrganization: organization });
  },

  // Clear selected organization
  clearSelectedOrganization: () => {
    set({ selectedOrganization: null });
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Clear search
  clearSearch: () => {
    set({ searchQuery: '' });
    get().fetchOrganizations();
  },

  // Get filtered organizations (for local filtering)
  getFilteredOrganizations: () => {
    const { organizations, searchQuery } = get();
    if (!searchQuery.trim()) {
      return organizations;
    }
    
    return organizations.filter(org =>
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  },

  // Reset store
  reset: () => {
    set({
      organizations: [],
      loading: false,
      error: null,
      searchQuery: '',
      selectedOrganization: null,
    });
  },
}));