# Categories API (`/api/v1/categories`)

Provides access to service categories (Electrical, Plumbing, HVAC, Carpentry, Painting, Cleaning).

---

### **1. Get All Active Categories**
`GET /api/v1/categories`  
![GET](https://img.shields.io/badge/GET-2196F3?style=flat&labelColor=000)

**Auth:** Public  
**Purpose:** Retrieve all active service categories.

#### Response — 200 OK
```json
{
  "success": true,
  "data": [
    {
      "id": "e4b2d184-a1a7-47b2-8ff4-94c0b43522dc",
      "name": "Electrical",
      "slug": "electrical",
      "description": "Wiring, lighting, circuit breakers, and electrical fixtures"
    },
    {
      "id": "7b8311d9-c081-42e5-b1a9-3d1fa82cf914",
      "name": "Plumbing",
      "slug": "plumbing",
      "description": "Pipe leaks, drainage, taps, water heaters, and sanitary fixtures"
    }
  ]
}
```

---

### **2. Get Category by ID**
`GET /api/v1/categories/:id`  
![GET](https://img.shields.io/badge/GET-2196F3?style=flat&labelColor=000)

**Auth:** Public  
**Purpose:** Fetch details of a specific service category.

#### Response — 200 OK
```json
{
  "success": true,
  "data": {
    "id": "7b8311d9-c081-42e5-b1a9-3d1fa82cf914",
    "name": "Plumbing",
    "slug": "plumbing",
    "description": "Pipe leaks, drainage, taps, water heaters, and sanitary fixtures"
  }
}
```