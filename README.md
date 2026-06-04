# JobSeek — A LinkedIn Clone (Job Seeker Side Only)

> A React + TypeScript + Vite project replicating the job seeker experience from LinkedIn. Recruiter tools, My Network, and employer-facing features are intentionally out of scope.

---

## 📌 Project Overview

**JobSeek** is a front-end clone of LinkedIn focused exclusively on the **job seeker's perspective**. If you're looking for a place to browse jobs, manage your profile, and track applications — this is it. Everything else? Not here (yet, and honestly, maybe never).

---

## ✅ What Works

### 👤 Profile
- Create and edit your professional profile
- Add work experience, education, skills, and a summary
- Upload a profile photo and banner image
- View your profile as others would see it

### 💼 Jobs
- Browse job listings with search and filters (location, job type, experience level)
- View full job descriptions
- Save jobs to a personal list
- Apply to jobs (mock flow — no real submissions)
- Track application status (Applied, In Review, etc.)

### 🔔 Notifications
- Receive mock notifications (e.g., "Your application was viewed")
- Mark notifications as read

### ⚙️ Settings
- Update account preferences
- Toggle dark/light mode

---

## ❌ What Does NOT Work

These features exist visually (to match the LinkedIn layout) but are **non-functional stubs**:

### 📣 Recruiter / Employer Side
- Posting jobs
- Reviewing applicants
- Recruiter dashboards or InMail
- Company page management

> Clicking any employer-side CTA will show a placeholder: *"This feature is not available in this build."*

### 🌐 My Network
- The **My Network** tab renders but all actions are disabled:
  - "Connect" buttons do nothing
  - "People You May Know" loads with static mock data only
  - Pending invitations UI is visible but non-interactive
  - Following / unfollowing has no effect

> This is a known, intentional limitation. Network state is not persisted.

### 💬 Messaging
- The messaging icon and inbox shell are present in the navbar
- No messages can be sent or received
- Conversations render as empty state placeholders

---

## 🛠 Tech Stack

| Tool | Version |
|------|---------|
| React | 18+ |
| TypeScript | 5+ |
| Vite | 5+ |
| React Router | 6+ |
| Tailwind CSS | 3+ |

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/jobseek.git
cd jobseek

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
src/
├── components/         # Shared UI components
├── pages/
│   ├── Profile/        # ✅ Works
│   ├── Jobs/           # ✅ Works
│   ├── Notifications/  # ✅ Works
│   ├── Network/        # ❌ Stub only
│   ├── Messaging/      # ❌ Stub only
│   └── Recruiter/      # ❌ Stub only
├── data/               # Mock data (jobs, users, notifications)
├── hooks/              # Custom React hooks
├── types/              # TypeScript interfaces
└── App.tsx
```

---

## 🗺 Roadmap

- [ ] Persist saved jobs and application status to localStorage
- [ ] Add resume upload (PDF parsing)
- [ ] Functional My Network with mock graph
- [ ] Mock messaging with AI-generated replies

---

## 🤝 Contributing

PRs welcome for anything in the **✅ Works** section. Please don't submit PRs that implement recruiter or employer features — that's a separate project.

---

## 📄 License

MIT