import React from 'react';
import { useAuthStore } from '../stores/authStore';

const Header = () => {
  const { user, signOut } = useAuthStore();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            Organization Manager
          </div>
          
          <div className="user-info">
            <span className="user-email">
              {user?.email}
            </span>
            <button 
              onClick={handleSignOut}
              className="btn btn-secondary btn-small"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;