# Restaurant Local Backend - Copilot Instructions

## Project Overview

This project is a local restaurant operating system.

The system runs on a Windows PC inside a restaurant.

Customers connect to the restaurant WiFi and access the application through:

restaurant.local

The application is designed for QR-based table ordering.

---

## Architecture

There are two completely separate systems:

### Local Restaurant Backend

Handles:

* Menu management
* Tables
* Orders
* Order items
* Payments
* Customer records
* Billing

### Cloud Backend

Handles:

* Restaurant registration
* Owner authentication
* Subscription management
* License validation

The local backend MUST NOT contain subscription logic.

The local backend only verifies licenses issued by the cloud backend.

---

## Tech Stack

Backend:

* Node.js
* Express.js

Database:

* PostgreSQL
* Prisma ORM

Validation:

* Zod

Authentication:

* JWT
* JWTs are issued by the cloud backend
* Local backend only verifies JWTs

---

## Folder Structure

Use the following architecture:

Routes
→ Controllers
→ Services
→ Prisma

Rules:

* Controllers must not directly access Prisma.
* Database queries belong only in services.
* Controllers should only handle request and response logic.
* Business logic belongs in services.
* Use async/await.
* Do not use callback-based code.

---

## Database Models

### Table

Fields:

* id
* tableNumber
* qrToken
* isActive

### Customer

Fields:

* id
* name
* phone
* createdAt

### MenuItem

Fields:

* id
* name
* category
* description
* price
* imageUrl
* nonVeg
* isAvailable
* prepTimeMinutes

### Order

Fields:

* id
* orderNumber
* customerId
* tableId
* orderType
* paymentMode
* status
* paymentStatus
* subtotal
* taxAmount
* totalAmount
* notes
* createdAt

### OrderItem

Fields:

* id
* orderId
* menuItemId
* quantity
* unitPrice
* totalPrice
* notes
* isServed

### Payment

Fields:

* id
* orderId
* paymentMethod
* amount
* status
* transactionReference
* paidAt

---

## API Design Rules

Return consistent JSON responses:

Success:

{
"success": true,
"data": {}
}

Error:

{
"success": false,
"message": "Error message"
}

---

## Menu Rules

Menu items support categories.

Examples:

* STARTER
* MAIN_COURSE
* DRINK
* DESSERT

nonVeg is a boolean.

Examples:

Chicken Biryani:
nonVeg = true

Paneer Butter Masala:
nonVeg = false

---

## Coding Standards

* Use modern JavaScript.
* Prefer const over let.
* Use Prisma relations instead of manual joins when possible.
* Validate request bodies using Zod.
* Use centralized error handling.
* Keep code modular and maintainable.
* Generate production-ready code.
