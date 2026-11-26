# Auth API (`/api/auth`)

Powered by Better Auth on the backend. Manages customer, artisan, and administrator authentication and session tokens via secure HTTP-only cookies.

---

### **1. Sign Up with Email & Password**
`POST /api/auth/sign-up/email`  
![POST](https://img.shields.io/badge/POST-4CAF50?style=flat&labelColor=000)

**Auth:** Public  
**Purpose:** Create a new customer account.

#### Request Body
```json
{
  "name": "Sara Tadesse",
  "email": "sara@example.com",
  "password": "StrongPassword123!"
}
```

#### Validations & RBAC
* Password must be at least 8 characters.
* Client cannot supply a `role`. Role automatically defaults to `'customer'`.
* Duplicate email returns **422 Unprocessable Entity**.

#### Response — 200 OK
```json
{
  "token": "vZu4wbiwds60KIOiqE3KAB5myfZ4aHR2",
  "user": {
    "name": "Sara Tadesse",
    "email": "sara@example.com",
    "emailVerified": false,
    "image": null,
    "createdAt": "2026-11-08T11:36:09.319Z",
    "updatedAt": "2026-11-08T11:36:09.319Z",
    "role": "customer",
    "id": "usr_98a7sd8f7a6sd",
  },
}
```

---

### **2. Sign In with Email & Password**
`POST /api/auth/sign-in/email`  
![POST](https://img.shields.io/badge/POST-4CAF50?style=flat&labelColor=000)

**Auth:** Public  
**Purpose:** Authenticate an existing user and set the session cookie.

#### Request Body
```json
{
  "email": "sara@example.com",
  "password": "StrongPassword123!"
}
```

#### Response — 200 OK
```json
{
  "redirect": false,
  "token": "c8fRTjceEj3v0LdXeiS7UP5rAdI5WS8j",
  "user": {
    "name": "Sara Tadesse",
    "email": "sara@example.com",
    "emailVerified": false,
    "image": null,
    "createdAt": "2026-11-08T11:36:09.319Z",
    "updatedAt": "2026-11-08T11:36:09.319Z",
    "role": "customer",
    "id": "usr_98a7sd8f7a6sd",
  }
}
```

---

### **3. Get Current Session**
`GET /api/auth/get-session`  
![GET](https://img.shields.io/badge/GET-2196F3?style=flat&labelColor=000)

**Auth:** Authenticated user  
**Purpose:** Retrieve the active user and session from the incoming cookie.

#### Response — 200 OK
```json
{
  "session": {
    "expiresAt": "2026-11-15T11:36:09.334Z",
    "token": "vZu4wbiwds60KIOiqE3KAB5myfZ4aHR2",
    "createdAt": "2026-11-08T11:36:09.334Z",
    "updatedAt": "2026-11-08T11:36:09.334Z",
    "ipAddress": "",
    "userAgent": "PostmanRuntime/2.15.0",
    "userId": "ww1Mq3wUwnFa5TriPGaReOjUQF78K0bQ",
    "id": "MeqDsf4oql2mFST7oSkC4AlJ100IzIkc"
    },
  "user": {
    "name": "Sara Tadesse",
    "email": "sara@example.com",
    "emailVerified": false,
    "image": null,
    "createdAt": "2026-11-08T11:36:09.319Z",
    "updatedAt": "2026-11-08T11:36:09.319Z",
    "role": "customer",
    "id": "usr_98a7sd8f7a6sd"
  }
}
```

---

### **4. Sign Out**
`POST /api/auth/sign-out`  
![POST](https://img.shields.io/badge/POST-4CAF50?style=flat&labelColor=000)

**Auth:** Authenticated user  
**Purpose:** Invalidate the session token in the database and clear the session cookie.

#### Response — 200 OK
```json
{
  "success": true
}
```