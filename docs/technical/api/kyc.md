# KYC API (`/api/v1/kyc`)
Handles submission and tracking of national identification and professional trade licenses.
---

### **1. Submit KYC Verification**
`POST /api/v1/kyc`  
![POST](https://img.shields.io/badge/POST-4CAF50?style=flat&labelColor=000)

**Auth:** Artisan profile owner  
**Content-Type:** `multipart/form-data`  
**Purpose:** Upload legal documents and identification for administrative review. The backend streams files to Cloudinary and saves the resulting URLs in PostgreSQL.

#### Form Fields
| Field Name | Type | Required? | Description |
|---|---|---|---|
| `nationalIdNumber` | Text | Yes | Ethiopian National ID number |
| `residentialDocument` | File | Yes | Proof of residence (PDF, PNG, or JPG) |
| `idCardFront` | File | Yes | National ID front photo (PNG or JPG) |
| `idCardBack` | File | Yes | National ID back photo (PNG or JPG) |
| `certificate` | File | Yes | Work license / certification (PDF, PNG, or JPG) |

#### File Validations & Security (FR-71, FR-72)
* **Allowed MIME types:** `image/jpeg`, `image/png`, `application/pdf`.
* **File size limit:** Max 5 MB per file.
* **Storage destination:** Uploaded to Cloudinary under a secured folder (`/hulu-bedeje/kyc/`).
* **Privacy (FR-72):** KYC document URLs must not be publicly accessible to normal customers or search engines.

#### Response — 201 Created
```json
{
  "success": true,
  "message": "KYC documents uploaded and application submitted for review.",
  "data": {
    "applicationId": "8f1a234b-c901-4472-8812-32a890e712cd",
    "status": "pending",
    "submittedAt": "2026-11-08T12:30:00Z"
  }
}
```
---

### **2. Get My KYC Status**
`GET /api/v1/kyc/me`  
![GET](https://img.shields.io/badge/GET-2196F3?style=flat&labelColor=000)

**Auth:** Artisan profile owner  
**Purpose:** Check current verification status, reviewer notes, and rejection reasons.

#### Response — 200 OK
```json
{
  "success": true,
  "data": {
    "applicationId": "8f1a234b-c901-4472-8812-32a890e712cd",
    "status": "pending",
    "submittedAt": "2026-11-07T14:30:00Z",
    "reviewedAt": null,
    "rejectionReason": null
  }
}
```