import React, { useState, useEffect } from 'react';
import { useOrganizationsStore } from '../stores/organizationsStore';
import LoadingSpinner from './LoadingSpinner';

const OrganizationForm = ({ organization, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [localError, setLocalError] = useState('');
  
  const { 
    createOrganization, 
    updateOrganization, 
    loading, 
    error, 
    clearError 
  } = useOrganizationsStore();

  const isEditing = !!organization;

  useEffect(() => {
    if (organization) {
      setName(organization.name);
      setDescription(organization.description);
      setIsActive(organization.is_active);
    }
  }, [organization]);

  useEffect(() => {
    // Clear errors when component mounts
    clearError();
    setLocalError('');
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!name.trim()) {
      setLocalError('Organization name is required');
      return;
    }

    if (!description.trim()) {
      setLocalError('Description is required');
      return;
    }

    const organizationData = {
      name: name.trim(),
      description: description.trim(),
      ...(isEditing && { is_active: isActive })
    };

    let result;
    if (isEditing) {
      result = await updateOrganization(organization.id, organizationData);
    } else {
      result = await createOrganization(organizationData);
    }

    if (result.success) {
      onSuccess();
    } else {
      setLocalError(result.error);
    }
  };

  const handleClose = () => {
    clearError();
    onClose();
  };

  const displayError = localError || error;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? 'Edit Organization' : 'Create New Organization'}
          </h2>
          <button
            onClick={handleClose}
            className="modal-close"
            disabled={loading}
          >
            ×
          </button>
        </div>

        {displayError && (
          <div className="error-message">
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Organization Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              placeholder="Enter organization name"
              disabled={loading}
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              placeholder="Enter organization description"
              disabled={loading}
              maxLength={500}
              required
            />
          </div>

          {isEditing && (
            <div className="form-group">
              <label className="form-label">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  disabled={loading}
                  style={{ marginRight: '0.5rem' }}
                />
                Active Organization
              </label>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <LoadingSpinner message={isEditing ? 'Updating...' : 'Creating...'} />
              ) : (
                isEditing ? 'Update Organization' : 'Create Organization'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationForm;