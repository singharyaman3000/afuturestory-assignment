import React, { useState } from 'react';
import { useOrganizationsStore } from '../stores/organizationsStore';
import LoadingSpinner from './LoadingSpinner';

const OrganizationList = ({ onEdit }) => {
  const [deletingId, setDeletingId] = useState(null);
  
  const { 
    organizations, 
    loading, 
    deleteOrganization,
    updateOrganization 
  } = useOrganizationsStore();

  const handleDelete = async (organization) => {
    if (window.confirm(`Are you sure you want to delete "${organization.name}"?`)) {
      setDeletingId(organization.id);
      const result = await deleteOrganization(organization.id);
      setDeletingId(null);
      
      if (result.success) {
        // Success feedback could be added here
      }
    }
  };

  const handleToggleStatus = async (organization) => {
    const result = await updateOrganization(organization.id, {
      is_active: !organization.is_active
    });
    
    if (!result.success) {
      // Error is handled by the store
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (organizations.length === 0 && !loading) {
    return (
      <div className="empty-state">
        <h3>No organizations found</h3>
        <p>Create your first organization to get started!</p>
      </div>
    );
  }

  return (
    <div>
      {organizations.map((organization) => (
        <div key={organization.id} className="card">
          <div className="card-header">
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <h3 className="card-title">{organization.name}</h3>
                <span className={`status-badge ${organization.is_active ? 'status-active' : 'status-inactive'}`}>
                  {organization.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <p className="card-description">
                {organization.description}
              </p>
              
              <div className="card-meta">
                Created: {formatDate(organization.created_at)}
              </div>
            </div>
          </div>
          
          <div className="card-actions">
            <button
              onClick={() => onEdit(organization)}
              className="btn btn-primary btn-small"
              disabled={loading || deletingId === organization.id}
            >
              Edit
            </button>
            
            <button
              onClick={() => handleToggleStatus(organization)}
              className={`btn btn-small ${organization.is_active ? 'btn-secondary' : 'btn-success'}`}
              disabled={loading || deletingId === organization.id}
            >
              {loading ? (
                <LoadingSpinner message="" />
              ) : (
                organization.is_active ? 'Deactivate' : 'Activate'
              )}
            </button>
            
            <button
              onClick={() => handleDelete(organization)}
              className="btn btn-danger btn-small"
              disabled={loading || deletingId === organization.id}
            >
              {deletingId === organization.id ? (
                <LoadingSpinner message="" />
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      ))}
      
      {loading && organizations.length > 0 && (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <LoadingSpinner message="Updating..." />
        </div>
      )}
    </div>
  );
};

export default OrganizationList;