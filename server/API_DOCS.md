# GreenLoop API - Recycling Platform Backend

## 📋 Tổng quan

Nền tảng kết nối người quyên góp rác tái chế (Donor) với người thu gom (Collector), số hóa quy trình thu gom rác và khuyến khích người dùng qua hệ thống tích điểm.

## 🚀 Getting Started

### Cài đặt

```bash
npm install
```

### Cấu hình môi trường

Tạo file `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/greenloop_db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
PORT=4000
```

### Chạy migration và seed

```bash
npm run prisma:migrate
npm run seed
```

### Chạy development server

```bash
npm run dev
```

### Build production

```bash
npm run build
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:4000/api
```

---

## 🔐 Authentication

### Register
**POST** `/auth/register`

```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phone": "0123456789",
  "role": "DONOR" // or "COLLECTOR", "ADMIN"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "DONOR"
  },
  "token": "jwt-token"
}
```

### Login
**POST** `/auth/login`

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

---

## 👤 Users

### Get Current User
**GET** `/users/me`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "DONOR",
    "points": 150,
    "isActive": true
  }
}
```

---

## 📍 Addresses

**All routes require authentication**

### Get My Addresses
**GET** `/addresses`

### Get Address by ID
**GET** `/addresses/:id`

### Create Address
**POST** `/addresses`

```json
{
  "street": "123 Main Street",
  "ward": "Ward 1",
  "district": "District 1",
  "city": "Ho Chi Minh City",
  "latitude": 10.762622,
  "longitude": 106.660172,
  "isPrimary": true,
  "note": "Near the park",
  "placeHints": "Blue gate",
  "contactName": "John Doe"
}
```

### Update Address
**PUT** `/addresses/:id`

### Delete Address
**DELETE** `/addresses/:id`

---

## 🗑️ Waste Categories

### Get All Categories
**GET** `/waste-categories?activeOnly=true`

**Response:**
```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "Plastic",
      "description": "Plastic bottles, containers, packaging",
      "pointsPerKg": 10,
      "isActive": true,
      "iconUrl": null
    }
  ]
}
```

### Get Category by ID
**GET** `/waste-categories/:id`

### Create Category (Admin only)
**POST** `/waste-categories`

```json
{
  "name": "Paper",
  "description": "Newspapers, cardboard",
  "pointsPerKg": 5,
  "iconUrl": "https://example.com/icon.png"
}
```

### Update Category (Admin only)
**PUT** `/waste-categories/:id`

### Delete Category (Admin only)
**DELETE** `/waste-categories/:id`

---

## 📦 Donation Requests

### Get All Requests (Collector/Admin)
**GET** `/donation-requests?status=PENDING&district=District 1`

**Query params:**
- `status`: PENDING | ACCEPTED | COMPLETED | CANCELLED
- `wasteCategoryId`: uuid
- `district`: string

### Get My Requests (Donor)
**GET** `/donation-requests/my-requests`

### Get Request by ID
**GET** `/donation-requests/:id`

### Create Request (Donor)
**POST** `/donation-requests`

```json
{
  "wasteCategoryId": "uuid",
  "estimatedWeight": 5.5,
  "imageUrls": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "addressId": "uuid",
  "notes": "Please come after 5pm",
  "preferredDate": "2024-11-25T17:00:00Z"
}
```

### Update Request (Donor)
**PUT** `/donation-requests/:id`

### Cancel Request (Donor)
**POST** `/donation-requests/:id/cancel`

### Accept Request (Collector)
**POST** `/donation-requests/accept`

```json
{
  "donationRequestId": "uuid"
}
```

### Complete Request (Collector)
**POST** `/donation-requests/:id/complete`

```json
{
  "actualWeight": 6.2,
  "verificationNotes": "Good quality plastic",
  "verificationImages": [
    "https://example.com/verified.jpg"
  ]
}
```

**Response:**
```json
{
  "request": { ... },
  "pointsAwarded": 62
}
```

---

## 💰 Transactions

### Get My Transactions
**GET** `/transactions/my-transactions?limit=50`

**Response:**
```json
{
  "transactions": [
    {
      "id": "uuid",
      "type": "EARN",
      "amount": 62,
      "description": "Donated 6.2kg of Plastic",
      "createdAt": "2024-11-20T10:00:00Z"
    }
  ],
  "balance": 212
}
```

---

## 🎁 Rewards

### Get All Rewards
**GET** `/rewards?activeOnly=true`

**Response:**
```json
{
  "rewards": [
    {
      "id": "uuid",
      "name": "Coffee Voucher",
      "description": "Free coffee at partner cafes",
      "pointsCost": 50,
      "stock": 100,
      "isActive": true,
      "imageUrl": null
    }
  ]
}
```

### Get Reward by ID
**GET** `/rewards/:id`

### Create Reward (Admin)
**POST** `/rewards`

```json
{
  "name": "Eco Bag",
  "description": "Reusable shopping bag",
  "pointsCost": 100,
  "stock": 50,
  "imageUrl": "https://example.com/bag.jpg"
}
```

### Update Reward (Admin)
**PUT** `/rewards/:id`

### Delete Reward (Admin)
**DELETE** `/rewards/:id`

### Redeem Reward
**POST** `/rewards/redeem`

```json
{
  "rewardId": "uuid"
}
```

**Response:**
```json
{
  "transaction": { ... },
  "reward": { ... }
}
```

---

## 🏥 Health Check

### Check API Status
**GET** `/health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-11-20T10:00:00Z"
}
```

---

## 👥 User Roles

- **DONOR**: Người quyên góp rác tái chế
  - Tạo/sửa/hủy donation requests
  - Quản lý địa chỉ
  - Xem điểm và đổi quà
  
- **COLLECTOR**: Người thu gom
  - Xem danh sách donation requests
  - Nhận và hoàn thành requests
  - Thu gom và xác nhận khối lượng

- **ADMIN**: Quản trị viên
  - Quản lý waste categories
  - Quản lý rewards
  - Xem toàn bộ hệ thống

---

## 📊 Database Schema

### Main Models
- **User**: Thông tin người dùng và điểm thưởng
- **Address**: Địa chỉ của người dùng
- **WasteCategory**: Loại rác và điểm thưởng/kg
- **DonationRequest**: Yêu cầu quyên góp
- **Collection**: Thông tin thu gom
- **Transaction**: Lịch sử giao dịch điểm
- **Reward**: Quà tặng có thể đổi

---

## 🔑 Default Credentials

After running seed:

**Admin Account:**
- Email: `admin@greenloop.local`
- Password: `Admin@123`

**Default Categories:**
- Plastic: 10 points/kg
- Paper: 5 points/kg
- Metal: 15 points/kg
- Glass: 8 points/kg
- Electronics: 20 points/kg
- Textile: 7 points/kg

**Default Rewards:**
- Coffee Voucher: 50 points
- Eco Bag: 100 points
- Plant Seedling: 80 points
- Discount 10%: 150 points
- Bamboo Straw Set: 120 points

---

## 🛠️ Tech Stack

- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Validation**: Zod

---

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run seed` - Seed database with initial data

---

## 🐛 Error Handling

All API errors follow this format:

```json
{
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## 📄 License

ISC

