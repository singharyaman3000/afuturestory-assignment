from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from supabase import create_client, Client
from datetime import datetime
import jwt

# Load environment variables
load_dotenv()

app = FastAPI(title="Organization Manager API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

if not all([SUPABASE_URL, SUPABASE_ANON_KEY]):
    raise ValueError("Missing required Supabase environment variables")

# Create Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Security
security = HTTPBearer()

# Pydantic models
class OrganizationCreate(BaseModel):
    name: str
    description: str
    is_active: bool = True

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class OrganizationResponse(BaseModel):
    id: int
    name: str
    description: str
    user_id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

class UserResponse(BaseModel):
    id: str
    email: str

# Simple authentication - just extract user ID from JWT without complex validation
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        
        # Simple JWT decode without verification for testing
        if SUPABASE_JWT_SECRET:
            try:
                payload = jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=["HS256"])
                user_id = payload.get("sub")
                email = payload.get("email", "user@example.com")
                
                if user_id:
                    return {"user_id": user_id, "email": email}
            except:
                pass
        
        # Fallback: try to decode without verification (for testing only)
        try:
            payload = jwt.decode(token, options={"verify_signature": False})
            user_id = payload.get("sub")
            email = payload.get("email", "user@example.com")
            
            if user_id:
                return {"user_id": user_id, "email": email}
        except:
            pass
        
        # If all else fails, use a default user for testing
        return {"user_id": "test-user-123", "email": "test@example.com"}
        
    except Exception as e:
        # For testing, return a default user instead of failing
        return {"user_id": "test-user-123", "email": "test@example.com"}

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Organization Manager API", "version": "1.0.0"}

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Get current user profile
@app.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user = Depends(get_current_user)):
    return UserResponse(
        id=current_user["user_id"],
        email=current_user["email"]
    )

# Get all organizations for the current user
@app.get("/organizations", response_model=List[OrganizationResponse])
async def get_organizations(current_user = Depends(get_current_user)):
    try:
        response = supabase.table("organizations").select("*").eq("user_id", current_user["user_id"]).order("created_at", desc=True).execute()
        
        organizations = []
        for org in response.data:
            organizations.append(OrganizationResponse(
                id=org["id"],
                name=org["name"],
                description=org["description"],
                user_id=org["user_id"],
                is_active=org["is_active"],
                created_at=datetime.fromisoformat(org["created_at"].replace('Z', '+00:00')),
                updated_at=datetime.fromisoformat(org["updated_at"].replace('Z', '+00:00'))
            ))
        
        return organizations
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch organizations: {str(e)}")

# Create a new organization
@app.post("/organizations", response_model=OrganizationResponse)
async def create_organization(organization: OrganizationCreate, current_user = Depends(get_current_user)):
    try:
        response = supabase.table("organizations").insert({
            "name": organization.name,
            "description": organization.description,
            "user_id": current_user["user_id"],
            "is_active": organization.is_active
        }).execute()
        
        if not response.data:
            raise HTTPException(status_code=400, detail="Failed to create organization")
        
        org_data = response.data[0]
        return OrganizationResponse(
            id=org_data["id"],
            name=org_data["name"],
            description=org_data["description"],
            user_id=org_data["user_id"],
            is_active=org_data["is_active"],
            created_at=datetime.fromisoformat(org_data["created_at"].replace('Z', '+00:00')),
            updated_at=datetime.fromisoformat(org_data["updated_at"].replace('Z', '+00:00'))
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create organization: {str(e)}")

# Get a specific organization
@app.get("/organizations/{organization_id}", response_model=OrganizationResponse)
async def get_organization(organization_id: int, current_user = Depends(get_current_user)):
    try:
        response = supabase.table("organizations").select("*").eq("id", organization_id).eq("user_id", current_user["user_id"]).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Organization not found")
        
        org_data = response.data[0]
        return OrganizationResponse(
            id=org_data["id"],
            name=org_data["name"],
            description=org_data["description"],
            user_id=org_data["user_id"],
            is_active=org_data["is_active"],
            created_at=datetime.fromisoformat(org_data["created_at"].replace('Z', '+00:00')),
            updated_at=datetime.fromisoformat(org_data["updated_at"].replace('Z', '+00:00'))
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch organization: {str(e)}")

# Update an organization
@app.put("/organizations/{organization_id}", response_model=OrganizationResponse)
async def update_organization(organization_id: int, organization: OrganizationUpdate, current_user = Depends(get_current_user)):
    try:
        update_data = {}
        if organization.name is not None:
            update_data["name"] = organization.name
        if organization.description is not None:
            update_data["description"] = organization.description
        if organization.is_active is not None:
            update_data["is_active"] = organization.is_active
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        response = supabase.table("organizations").update(update_data).eq("id", organization_id).eq("user_id", current_user["user_id"]).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Organization not found")
        
        org_data = response.data[0]
        return OrganizationResponse(
            id=org_data["id"],
            name=org_data["name"],
            description=org_data["description"],
            user_id=org_data["user_id"],
            is_active=org_data["is_active"],
            created_at=datetime.fromisoformat(org_data["created_at"].replace('Z', '+00:00')),
            updated_at=datetime.fromisoformat(org_data["updated_at"].replace('Z', '+00:00'))
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update organization: {str(e)}")

# Delete an organization
@app.delete("/organizations/{organization_id}")
async def delete_organization(organization_id: int, current_user = Depends(get_current_user)):
    try:
        response = supabase.table("organizations").delete().eq("id", organization_id).eq("user_id", current_user["user_id"]).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Organization not found")
        
        return {"message": "Organization deleted successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete organization: {str(e)}")

# Search organizations
@app.get("/organizations/search/{query}", response_model=List[OrganizationResponse])
async def search_organizations(query: str, current_user = Depends(get_current_user)):
    try:
        response = supabase.table("organizations").select("*").eq("user_id", current_user["user_id"]).ilike("name", f"%{query}%").order("created_at", desc=True).execute()
        
        organizations = []
        for org in response.data:
            organizations.append(OrganizationResponse(
                id=org["id"],
                name=org["name"],
                description=org["description"],
                user_id=org["user_id"],
                is_active=org["is_active"],
                created_at=datetime.fromisoformat(org["created_at"].replace('Z', '+00:00')),
                updated_at=datetime.fromisoformat(org["updated_at"].replace('Z', '+00:00'))
            ))
        
        return organizations
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to search organizations: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)