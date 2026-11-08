# Artisans API (`/api/artisans`)

Handles artisan application, public directory discovery, artisan profiles, and availability toggles.

---

### **1. Apply to Become an Artisan**
`POST /api/artisans/apply`  
![POST](https://img.shields.io/badge/POST-4CAF50?style=flat&labelColor=000)

**Auth:** `customer`  
**Purpose:** Register an artisan operational profile. Starts as unverified (`is_verified = false`).

#### Request Body
```json
{
  "categoryId": "7b8311d9-c081-42e5-b1a9-3d1fa82cf914",
  "experienceYears": 4,
  "serviceArea": "Bole, Kirkos",
  "bio": "Specialized in emergency plumbing, drain clearance, and water pipe installations."
}
```

#### Response — 201 Created
```json
{
  "success": true,
  "message": "Artisan profile initialized. Please proceed to submit KYC verification documents.",
  "data": {
    "artisanId": "c1a94e82-62b1-419a-9e10-1845bb2901cd",
    "isVerified": false,
    "availabilityStatus": "available"
  }
}
```

---

### **2. Discover Verified Artisans**
`GET /api/artisans`  
![GET](https://img.shields.io/badge/GET-2196F3?style=flat&labelColor=000)

**Auth:** Public  
**Purpose:** Search and filter verified service providers.

#### Query Parameters
`?categoryId=&serviceArea=&availability=available&page=1&limit=10`

#### Security Rule (BR-01, BR-10)
* Enforces `is_verified = TRUE`. Unverified applicants never appear.

#### Response — 200 OK
```json
{
  "success": true,
  "data": [
    {
      "id": "c1a94e82-62b1-419a-9e10-1845bb2901cd",
      "name": "Abebe Kebede",
      "category": "Plumbing",
      "serviceArea": "Bole, Kirkos",
      "experienceYears": 4,
      "rating": 4.8,
      "reviewCount": 18,
      "availabilityStatus": "available"
    }
  ]
}
```

---

### **3. Get Artisan Public Profile**
`GET /api/artisans/:id`  
![GET](https://img.shields.io/badge/GET-2196F3?style=flat&labelColor=000)

**Auth:** Public  
**Purpose:** View an artisan's public profile, bio, trade category, and ratings.

#### Response — 200 OK
```json
{
  "success": true,
  "data": {
    "id": "c1a94e82-62b1-419a-9e10-1845bb2901cd",
    "name": "Abebe Kebede",
    "category": "Plumbing",
    "bio": "Specialized in emergency plumbing.",
    "serviceArea": "Bole, Kirkos",
    "experienceYears": 4,
    "rating": 4.8,
    "reviewCount": 18,
    "availabilityStatus": "available"
  }
}
```

---

### **4. Set Artisan Availability**
`PATCH /api/artisans/availability`  
![PATCH](https://img.shields.io/badge/PATCH-FFC107?style=flat&labelColor=000)

**Auth:** `artisan`  
**Purpose:** Update active working state (`available`, `busy`, `offline`).

#### Request Body
```json
{
  "status": "busy"
}
```

#### Response — 200 OK
```json
{
  "success": true,
  "message": "Availability status updated to busy"
}
```