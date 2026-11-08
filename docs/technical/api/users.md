# Users API (`/api/users`)

Manages user profile information, contact details, and account settings.

---

### **1. Get My Profile**
`GET /api/users/profile`  
![GET](https://img.shields.io/badge/GET-2196F3?style=flat&labelColor=000)

**Auth:** Authenticated user (`customer`, `artisan`, `administrator`)  
**Purpose:** Fetch account profile information.

#### Response — 200 OK
```json
{
  "success": true,
  "data": {
    "id": "usr_98a7sd8f7a6sd",
    "name": "Sara Tadesse",
    "email": "sara@example.com",
    "phone": "+251911223344",
    "role": "customer",
    "status": "active",
    "createdAt": "2026-11-01T10:00:00Z"
  }
}
```

---

### **2. Update Profile**
`PATCH /api/users/profile`  
![PATCH](https://img.shields.io/badge/PATCH-FFC107?style=flat&labelColor=000)

**Auth:** Authenticated user  
**Purpose:** Update name and phone number.

#### Request Body
```json
{
  "name": "Sara Tadesse Haile",
  "phone": "+251911998877"
}
```

#### Validations
* Users cannot change their own `email` or `role` through this endpoint.

#### Response — 200 OK
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```