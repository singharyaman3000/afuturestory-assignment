import React, { useEffect, useState } from 'react';
import { useOrganizationsStore } from '../stores/organizationsStore';
import OrganizationList from './OrganizationList';
import OrganizationForm from './OrganizationForm';
import SearchBar from './SearchBar';
import LoadingSpinner from './LoadingSpinner';

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState(null);
  
  const { 
    organizations, 
    loading, 
    error, 
    fetchOrganizations, 
    clearError 
  } = useOrganizationsStore();

  useEffect(() => {
    // Fetch organizations when component mounts
    fetchOrganizations();
  }, [fetchOrganizations]);

  const handleCreateNew = () => {
    setEditingOrganization(null);
    setShowForm(true);
  };

  const handleEdit = (organization) => {
    setEditingOrganization(organization);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingOrganization(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingOrganization(null);
    // Organizations will be automatically updated via the store
  };

  return (
    <div className="main-content">
      <div className="container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem' 
        }}>
          <h1 style={{ margin: 0, color: '#111827' }}>
            My Organizations
          </h1>
          <button
            onClick={handleCreateNew}
            className="btn btn-primary"
          >
            Add Organization
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button 
              onClick={clearError}
              style={{ 
                marginLeft: '1rem', 
                background: 'none', 
                border: 'none', 
                color: 'inherit', 
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Dismiss
            </button>
          </div>
        )}

        <SearchBar />

        {loading && organizations.length === 0 ? (
          <LoadingSpinner message="Loading organizations..." />
        ) : (
          <OrganizationList onEdit={handleEdit} />
        )}

        {showForm && (
          <OrganizationForm
            organization={editingOrganization}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;