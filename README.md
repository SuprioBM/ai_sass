# Cvwizardai

AI-Powered Resume, Cover Letter, and Job Search Assistant  
[cvwizardai.vercel.app](https://cvwizardai.vercel.app)

[![Vercel Deployment](https://vercelbadge.vercel.app/api/SuprioBM/ai_sass)](https://cvwizardai.vercel.app)
[![MIT License](https://img.shields.io/github/license/SuprioBM/ai_sass)](LICENSE)
![Built with Next.js](https://img.shields.io/badge/built%20with-Next.js-blue)
![Languages](https://img.shields.io/github/languages/top/SuprioBM/ai_sass)

---

## 🌟 Overview

**Cvwizardai** is an AI-powered SaaS application that helps job seekers supercharge their job search toolkit. With advanced language models, you can automatically:

- Write, rewrite, and enhance your resume/CV to fit specific job descriptions.
- Instantly generate tailored, professional cover letters.
- Receive actionable, resume-ready bullet points based on your experience and target roles.
- Search aggregated job postings from multiple sources with filtering.
- Manage your career profile securely.

All in a beautiful, responsive web interface powered by Next.js and deployed to [Vercel](https://vercel.com).

---

## 🚀 Live Demo

- [cvwizardai.vercel.app](https://cvwizardai.vercel.app)

---

## ✨ Features

- **AI Resume/CV Enhancement**  
  Upload your resume and have it rewritten for clarity, punch, and alignment with specific job descriptions—using action-oriented, keyword-optimized language.

- **AI Cover Letter Generator**  
  Create professional, personalized cover letters instantly based on your target job and profile.

- **Resume Bullet Point Generator**  
  Let AI generate impactful, role-optimized resume bullet points.

- **Aggregated Job Search**  
  Find, filter, and browse job postings pulled from various APIs by role, experience, and skills.

- **Profile & Authentication**  
  Secure sign-in and personal profile management.

---

## 🛠️ Tech Stack

- **Frontend & Backend:** Next.js (with App Router)
- **AI:** OpenAI / Hugging Face LLM APIs
- **UI:** React, Tailwind CSS, Radix UI, Framer Motion
- **Auth:** NextAuth (with Prisma adapter), JWT
- **Database:** Prisma ORM (works with PostgreSQL, MySQL, SQLite, etc.)
- **Deployment:** Vercel

---

## 📦 Getting Started

### Prerequisites

- Node.js v18+ and npm/yarn
- (Optional) PostgreSQL, MySQL, or SQLite database
- API keys for OpenAI or Hugging Face (for full functionality)

### Installation

```bash
git clone https://github.com/SuprioBM/ai_sass.git
cd ai_sass
npm install
```

### Configuration

1. Copy `.env.example` to `.env` and update with your secrets (DB, JWT, API keys).
2. Setup database and run Prisma migrations if using a local DB:
   ```bash
   npx prisma migrate dev --name init
   ```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛎️ Usage

- Access the web app at [cvwizardai.vercel.app](https://cvwizardai.vercel.app) or your local instance.
- Sign in and fill in your profile/resume details.
- Choose features such as AI resume rewrite, bullet generation, or cover letter.
- Copy, download, or further tailor the generated content.
- Explore jobs and manage your career information.

---

## 📁 Project Structure

```
/src
  /app              # Next.js app routes (API endpoints, pages)
  /components       # React components and forms
  /context          # React context/state providers
  /lib              # Helper utilities (AI, job API integrations, etc.)
  /types            # TypeScript types
/prisma             # Prisma schema and DB config
/public             # Static assets
```

---

## 🔌 API Overview

### POST `/api/generate-ai-cv`
- **Body:** Profile, experience, education, skills, and target job description
- **Returns:** Enhanced, AI-rewritten resume as JSON

### POST `/api/generate-cover-letter`
- **Body:** Profile, job target, company, tone, and experience
- **Returns:** Custom cover letter text

### POST `/api/generate-resume`
- **Body:** Experience and job description
- **Returns:** Optimized resume bullet points

### POST `/api/jobs`
- **Body:** Query, skills, location, experience, type
- **Returns:** Aggregated list of jobs from multiple sources

---

## 🤝 Contributing

We welcome contributions and suggestions!

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'feat: add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request.

---

## 📚 License

This project is MIT licensed—see [LICENSE](LICENSE) for details.

---

## 🗨️ Support & Contact

- **Issues & Feedback:** [GitHub Issues](https://github.com/SuprioBM/ai_sass/issues)
- **Author:** [SuprioBM](https://github.com/SuprioBM)

---

_Made with ❤️ by SuprioBM — Visit [cvwizardai.vercel.app](https://cvwizardai.vercel.app) to upgrade your job search!_
