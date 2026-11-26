# Services API (`/api/v1/services`)

Exposes detailed service offerings and descriptions within each category.

---

### **1. List Services**
`GET /api/v1/services`  
![GET](https://img.shields.io/badge/GET-2196F3?style=flat&labelColor=000)

**Auth:** Public  
**Purpose:** Browse specific maintenance services.

#### Query Parameters
`?categoryId=7b8311d9-c081-42e5-b1a9-3d1fa82cf914`

#### Response — 200 OK
```json
{
  "success": true,
  "data": [
    {
      "id": "serv_01a",
      "categoryId": "7b8311d9-c081-42e5-b1a9-3d1fa82cf914",
      "name": "Sink & Drain Clearing",
      "description": "Unclogging kitchen and bathroom drains with specialized snake and pump tools."
    },
    {
      "id": "serv_02b",
      "categoryId": "7b8311d9-c081-42e5-b1a9-3d1fa82cf914",
      "name": "Water Heater Installation & Repair",
      "description": "Boiler, water heater electrical connection, pipe inlet and valve servicing."
    }
  ]
}
```