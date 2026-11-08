# Addresses API (`/api/v1/addresses`)

Manages customer service locations within urban Ethiopia. Matches SRS Section 15.4.

---

### **1. Create an Address**
`POST /api/v1/addresses`  
![POST](https://img.shields.io/badge/POST-4CAF50?style=flat&labelColor=000)

**Auth:** `customer`  
**Purpose:** Save a new home or office address.

#### Request Body
```json
{
  "subCity": "Bole",
  "neighborhood": "Woreda 03 / Rwanda",
  "description": "House 412, behind Edna Mall, opposite the clinic",
  "latitude": 9.001245,
  "longitude": 38.784512
}
```

#### Validations
* `subCity`, `neighborhood`, `description`, `latitude` and `longitude` are required.

#### Response — 201 Created
```json
{
  "success": true,
  "message": "Address created successfully",
  "data": {
    "id": "3f9c4250-9831-4a3e-b812-70138402a3ef",
    "subCity": "Bole",
    "neighborhood": "Woreda 03 / Rwanda",
    "description": "House 412, behind Edna Mall, opposite the clinic",
    "latitude": 9.001245,
    "longitude": 38.784512
  }
}
```

---

### **2. Get My Saved Addresses**
`GET /api/v1/addresses`  
![GET](https://img.shields.io/badge/GET-2196F3?style=flat&labelColor=000)

**Auth:** `customer`  
**Purpose:** List all addresses saved by the signed-in customer.

#### Response — 200 OK
```json
{
  "success": true,
  "data": [
    {
      "id": "3f9c4250-9831-4a3e-b812-70138402a3ef",
      "subCity": "Bole",
      "neighborhood": "Woreda 03 / Rwanda",
      "description": "House 412, behind Edna Mall, opposite the clinic",
      "latitude": 9.001245,
      "longitude": 38.784512,
      "createdAt": "2026-11-07T12:00:00Z"
    }
  ]
}
```

---

### **3. Delete an Address**
`DELETE /api/v1/addresses/:id`  
![DELETE](https://img.shields.io/badge/DELETE-F44336?style=flat&labelColor=000)

**Auth:** `customer` (Owner only)  
**Purpose:** Delete a saved address.

#### Response — 200 OK
```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```