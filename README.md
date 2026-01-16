# 🚀 Forese HR-DB

**Forese HR-DB** is a centralized HR Contact Database Management System built for student placement teams to manage, track, and analyze HR interactions for Mock Placement and Campus Recruitment activities.

It enables teams to collaboratively maintain HR contact data, track follow-ups, visualize performance insights, and streamline communication workflows.

---

## 📌 Problem Statement

During mock placement drives, student teams often struggle with:

- **Scattered HR contact data** across spreadsheets and chat groups
- **Duplicate entries** leading to redundant outreach
- **No visibility on follow-ups** and call outcomes
- **Poor tracking of HR responses** and engagement
- **No centralized analytics** to measure team performance

**Forese HR-DB** solves this by providing a **role-based, analytics-driven HR management platform** with real-time collaboration features.

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| **UI Components** | ShadCN UI |
| **Database** | PostgreSQL |
| **Authentication** | Custom Google OAuth (No NextAuth), JWT Sessions |
| **Charts & Analytics** | Recharts |
| **API** | Next.js API Routes (REST) |

---

## 👤 User Roles & Permissions

### 👨‍🎓 **Member**
- Add HR contacts (Manual entry / CSV upload)
- View & manage only their uploaded HRs
- Update remarks & call status
- View personal & team statistics
- Receive follow-up notifications

### 🧑‍💼 **Admin**
- Manage all members in their team
- Edit any HR contact mapped to their team
- View team-level analytics dashboard
- Monitor HR response trends and follow-ups

### 👑 **Super Admin**
- Full system access across all teams
- View global analytics and insights
- Assign roles and manage team assignments
- Access unified cross-team reporting

---

## ✨ Core Features

### 🔐 **Authentication**
- Google OAuth Login (Custom implementation)
- Domain restricted to `@svce.ac.in`
- JWT-based session handling
- Secure route protection with middleware

### 🏠 **Dashboard**
- Donut-style status counters for quick insights
- Paginated HR contact table with sorting
- Real-time data updates
- Role-aware views (Member/Admin/Super Admin)

### 📊 **HR Contact Status Tracking**
- ✅ Awaiting Response
- 📞 Call Postponed
- ✉️ Mail Sent
- ❌ Wrong Number
- 🚫 Invitation Declined
- 📵 Not Reachable

### ➕ **Add HR Contacts**
- Manual entry form with validation
- Bulk CSV upload with preview
- Duplicate detection (Email & Phone)
- Automatic team & uploader mapping

### 🔍 **Search & Filter**
Search across multiple fields:
- HR Name
- Phone Number
- Company Name
- Interview Mode
- Status

Supports query-based routing: `/hr?search=<keyword>`

### 📞 **HR Pitch Page**
- Centralized calling script template
- Dynamically injects logged-in user name
- Includes FAQ section for handling HR objections
- Ready-to-use conversation guide

### 🔔 **Smart Notifications**
Auto-generated follow-up reminders triggered by:
- Awaiting Response (3+ days)
- Call Postponed (on scheduled date)
- Not Reachable (retry reminder)

Features:
- Read/Unread indicators
- Sidebar alert dot
- Click to redirect to HR detail page

### 📊 **Insights & Analytics**
- **Donut charts** for status distribution
- **Bar graphs** for team/member performance
- Team-wise contact ownership breakdown
- Member contribution tracking
- Historical trend analysis

---

## 🗄 Database Schema

### **users**
```sql
id, name, email, role, team_id, created_at
```

### **teams**
```sql
id, name, poc_name, poc_email, created_at
```

### **hr_contacts**
```sql
id, hr_name, company, email, phone,
status, remark, uploaded_by, team_id,
interview_mode, created_at, updated_at
```

### **notifications**
```sql
id, contact_id, user_id, message, 
created_at, read, type
```

---

## 📦 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/callback` | Google OAuth callback handler |
| `GET` | `/api/contacts` | Fetch HR contacts (filtered by role) |
| `POST` | `/api/contacts` | Add new HR contact |
| `PUT` | `/api/contacts/:id` | Update HR contact details |
| `POST` | `/api/bulk-upload` | Bulk CSV upload with validation |
| `GET` | `/api/notifications` | Fetch user notifications |
| `PUT` | `/api/notifications/:id/read` | Mark notification as read |
| `GET` | `/api/stats` | Get dashboard statistics |
| `GET` | `/api/team/:id` | Fetch team details and members |

---

## 🛠 Local Setup

### **Prerequisites**
- Node.js 18+ and npm
- PostgreSQL database
- Google OAuth credentials

### **Installation Steps**

1. **Clone the repository**
```bash
git clone https://github.com/<your-username>/forese-hr-db.git
cd forese-hr-db
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/forese_db

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Run database migrations**
```bash
npm run db:migrate
```

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

---

**⭐ Star this repo if you find it helpful!**
