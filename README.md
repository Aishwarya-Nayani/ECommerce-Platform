# PulseCommerce — Full-Stack E-Commerce Platform

A production-ready e-commerce web application featuring a modern React frontend styled with Tailwind CSS, backed by a layered ASP.NET Core Web API with JWT authentication and SQL Server persistence.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, Lucide React, Axios, React Router v6, Vite
- **Backend:** ASP.NET Core Web API, Entity Framework Core, JWT Authentication, BCrypt.Net
- **Database:** Microsoft SQL Server
- **Architecture:** Layered Architecture (API, DataAccessLayer, Services)

---

## 📁 Project Structure

```text
ECommerce/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── api/                # Axios client & request interceptors
│   │   ├── components/         # Reusable UI (Navbar, Cards)
│   │   ├── context/            # AuthContext (JWT management)
│   │   └── pages/              # Products, Detail, Cart, Orders, Login, Register
├── DataAccessLayer/            # EF Core DbContext, Entities & Migrations
├── Services/                   # Business logic & repository services
├── ECommerceWebApp/            # ASP.NET Core API controllers & configurations
└── ECommerceWebApp.sln         # Visual Studio Solution
