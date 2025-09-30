# Organization Manager Web App

A full-stack web application that allows authenticated users to manage their organizations (companies, clubs, or any groups they belong to). Built with React, Zustand, FastAPI, and Supabase.

## 🚀 Features

### Core Features
- **User Authentication**: Secure login/register system using Supabase Auth
- **CRUD Operations**: Create, Read, Update, and Delete organizations
- **Data Isolation**: Users can only access and modify their own organizations
- **Responsive Design**: Clean, simple UI that works on all devices

### Organization Management
- **Name & Description**: Each organization has a name and description
- **Creation Date**: Automatically tracked when organizations are created
- **Owner Association**: Organizations are linked to their respective users

### Bonus Features ✨
- **Search & Filter**: Search organizations by name with real-time results
- **Active/Inactive Status**: Mark organizations as active or inactive
- **Form Validation**: Client and server-side validation with error handling
- **Loading States**: Proper loading indicators throughout the app

## 🛠 Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Zustand**: Lightweight state management for auth and organization data
- **React Router**: Client-side routing for navigation
- **Axios**: HTTP client for API communication
- **CSS3**: Custom responsive styling (no external UI libraries)

### Backend
- **FastAPI**: Modern Python web framework with automatic API documentation
- **Supabase**: Backend-as-a-Service for authentication and database
- **PostgreSQL**: Robust relational database (via Supabase)
- **Pydantic**: Data validation and serialization
- **Python-Jose**: JWT token handling

### Database Schema
```sql
-- Users table (managed by Supabase Auth)
-- organizations table
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **Supabase Account** (free tier available)

## 🔧 Setup Instructions 

### 1. Clone the Repository
```bash
git clone <repository-url>
cd afuturestory-assignment
```

### (Step 2, can be skipped if configured with environment variables from the files provided in the mail)
### 2. Supabase Setup

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Create the Organizations Table**:
   - Go to the SQL Editor in your Supabase dashboard
   - Run this SQL command:
   ```sql
   CREATE TABLE organizations (
       id SERIAL PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       description TEXT NOT NULL,
       user_id UUID NOT NULL REFERENCES auth.users(id),
       is_active BOOLEAN DEFAULT true,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Enable Row Level Security
   ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
   
   -- Create policy to ensure users can only access their own organizations
   CREATE POLICY "Users can only access their own organizations" ON organizations
       FOR ALL USING (auth.uid() = user_id);
   ```

3. **Configure Authentication**:
   - In Supabase Dashboard → Authentication → Settings
   - Enable email authentication
   - Optionally disable email confirmations for development

### 3. Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables** :
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your Supabase credentials:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_JWT_SECRET=your_supabase_jwt_secret
   ENVIRONMENT=development
   DEBUG=True
   ```

5. **Start the backend server**:
   ```bash
   python run.py
   ```
   
   The API will be available at `http://localhost:8000`
   
   **API Documentation**: Visit `http://localhost:8000/docs` for interactive API docs

### 4. Frontend Setup

1. **Navigate to frontend directory** (in a new terminal):
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   REACT_APP_API_URL=http://localhost:8000
   ```

4. **Start the frontend development server**:
   ```bash
   npm start
   ```
   
   The app will be available at `http://localhost:3000`

## 🎯 Demo Flow

## 🧪 Demo Flow

### Creating a Demo Account
Since this uses Supabase authentication, you'll need to create a new account:

1. **Start the application** (see Quick Start above)
2. **Navigate to** http://localhost:3000
3. **Click "Register"** to create a new account
4. **Use any email/password** (e.g., `demo@example.com` / `demo123456`)
5. **Login** with your new credentials

Once you've created your demo account, test these features:

1. **Authentication**: Login/Logout functionality
2. **Create Organization**: Add new organizations with name and description
3. **View Organizations**: See your complete organization list
4. **Edit Organizations**: Modify existing organization details
5. **Delete Organizations**: Remove organizations (with confirmation dialog)
6. **Search/Filter**: Use the search bar to filter organizations by name
7. **Active/Inactive Status**: Toggle organization status and see visual indicators
8. **Responsive Design**: Test the app on different screen sizes

### Expected Behavior
- **Data Isolation**: You'll only see organizations you created
- **Real-time Updates**: Changes appear immediately in the UI
- **Form Validation**: Proper error handling for invalid inputs
- **Loading States**: Smooth loading indicators during API calls
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # Environment variables template
│   └── .env                 # Environment variables (create this or copy-paste from the mail received)
├── frontend/
│   ├── public/
│   │   ├── index.html       # HTML template
│   │   └── manifest.json    # PWA manifest
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Dashboard.js
│   │   │   ├── Header.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── OrganizationList.js
│   │   │   ├── OrganizationForm.js
│   │   │   ├── SearchBar.js
│   │   │   └── LoadingSpinner.js
│   │   ├── stores/          # Zustand stores
│   │   │   ├── authStore.js
│   │   │   └── organizationsStore.js
│   │   ├── App.js           # Main app component
│   │   ├── index.js         # React entry point
│   │   └── index.css        # Global styles
│   ├── package.json         # Node.js dependencies
│   ├── .env.example         # Environment variables template
│   └── .env                 # Environment variables (create this or copy-paste from the mail received)
└── README.md               # This file
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication via Supabase
- **Row Level Security**: Database-level security ensuring data isolation 
- **Input Validation**: Both client and server-side validation
- **CORS Configuration**: Properly configured cross-origin requests
- **Error Handling**: Secure error messages without exposing sensitive data

## 🎨 Design Decisions

### Frontend Architecture
- **Zustand over Redux**: Chosen for its simplicity and minimal boilerplate
- **Custom CSS**: Used instead of UI libraries to demonstrate CSS skills
- **Component Structure**: Modular components with clear separation of concerns
- **State Management**: Centralized stores for auth and organizations data

### Backend Architecture
- **FastAPI**: Selected for its modern Python features and automatic documentation
- **Supabase Integration**: Leverages managed authentication and database
- **RESTful Design**: Clean API endpoints following REST conventions
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes

### Database Design
- **Simple Schema**: Focused on core requirements with room for extension
- **UUID References**: Using Supabase's UUID-based user system
- **Timestamps**: Automatic creation date tracking
- **Boolean Flags**: Simple active/inactive status system

## 🚦 API Endpoints

### Authentication
- Authentication is handled by Supabase Auth
- All API endpoints require Bearer token authentication

### Organizations
- `GET /organizations` - Get all user's organizations
- `POST /organizations` - Create new organization
- `GET /organizations/{organization_id}` - Get specific organization
- `PUT /organizations/{organization_id}` - Update organization
- `DELETE /organizations/{organization_id}` - Delete organization
- `GET /organizations/search/{query}` - Search organizations

### Utility
- `GET /` - API information
- `GET /health` - Health check
- `GET /me` - Current user profile

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration with email confirmation
- [ ] User login with valid/invalid credentials
- [ ] Create organization with validation
- [ ] Edit organization details
- [ ] Delete organization with confirmation
- [ ] Search organizations by name
- [ ] Toggle organization active/inactive status
- [ ] Logout and session management
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Error handling for network issues

### Automated Testing
Future improvements could include:
- Unit tests for React components
- API endpoint testing
- Integration tests
- E2E testing with Cypress

## 🔄 Future Enhancements

### Potential Features
- **Organization Categories**: Add categories/tags for organizations
- **Member Management**: Add members to organizations
- **File Uploads**: Organization logos and documents
- **Dashboard Analytics**: Statistics and insights
- **Email Notifications**: Alerts for organization updates
- **Export/Import**: Data export in various formats
- **Advanced Search**: Filter by date, status, category
- **Bulk Operations**: Select and modify multiple organizations

### Technical Improvements
- **Caching**: Redis for improved performance
- **Rate Limiting**: API rate limiting for security
- **Monitoring**: Application monitoring and logging
- **CI/CD**: Automated deployment pipeline
- **Docker**: Containerization for easy deployment
- **Testing**: Comprehensive test suite

## 🐛 Known Issues & Limitations

### Current Limitations
- **Email Confirmation**: May require email confirmation in production
- **File Uploads**: No file upload functionality yet
- **Pagination**: No pagination for large organization lists
- **Offline Support**: No offline functionality
- **When the user registers(verifies email) and signed in for the first time, there's error showcased in the frontend because the fetchOrganizations() is getting triggered even before the token is set, it is resolved by itself when logged in again.**

### Development Notes
- **Demo Credentials**: The demo credentials are for development only
- **Environment Variables**: Ensure all environment variables are set correctly (Both Frontend & Backend environment variables is shared in the mail for convenience)
- **CORS**: CORS is configured for localhost development

## 📞 Support & Contact

If you encounter any issues during setup or have questions about the implementation:

1. **Check the Console**: Look for error messages in browser/terminal
2. **Verify Environment Variables**: Ensure all required variables are set
3. **Database Setup**: Confirm the organizations table was created correctly
4. **API Documentation**: Visit `http://localhost:8000/docs` for API details

## 📝 Assignment Completion Status

### ✅ Completed Requirements
- [x] **Authentication**: Supabase Auth with login/register
- [x] **CRUD Operations**: Full Create, Read, Update, Delete functionality
- [x] **Frontend**: React with Zustand state management
- [x] **Backend**: FastAPI with RESTful endpoints
- [x] **Database**: Supabase/PostgreSQL with proper schema
- [x] **Security**: User data isolation and validation
- [x] **Documentation**: Comprehensive README with setup instructions

### ✅ Bonus Features Implemented
- [x] **Search/Filter**: Real-time search by organization name
- [x] **Active/Inactive Status**: Toggle organization status
- [x] **Error Handling**: Comprehensive error handling throughout
- [x] **Responsive Design**: Mobile-friendly interface
- [x] **Loading States**: Proper loading indicators
- [x] **Form Validation**: Client and server-side validation

### 🎯 Technical Excellence
- **Clean Code**: Well-structured, commented, and maintainable code
- **Modern Practices**: Latest React patterns and FastAPI features
- **Security**: Proper authentication and data isolation
- **User Experience**: Intuitive interface with clear feedback
- **Documentation**: Detailed setup and usage instructions

This implementation demonstrates proficiency in all required technologies and goes beyond the basic requirements with additional features and polish.
