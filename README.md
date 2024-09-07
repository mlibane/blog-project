# Nidix: A Modern Blogging Platform 🚀


[![Next.js](https://img.shields.io/badge/Next.js-13.0+-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0+-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0+-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13.0+-336791?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)

[![GitHub license](https://img.shields.io/github/license/mlibane/nidix.svg)](https://github.com/mlibane/nidix/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/mlibane/nidix.svg)](https://github.com/mlibane/nidix/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/mlibane/nidix.svg)](https://github.com/mlibane/nidix/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/mlibane/nidix.svg)](https://github.com/mlibane/nidix/pulls)

Nidix is a cutting-edge blogging platform built with Next.js, TypeScript, and Tailwind CSS. It offers a seamless writing experience, powerful content management, and optimized performance for both readers and authors.

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Deployment](#-deployment)
- [Acknowledgements](#-acknowledgements)

## ✨ Features

- 🖋 Rich text editor with Tiptap
- 🔐 Secure authentication with NextAuth.js
- 🌓 Dark mode support
- 🎨 Customizable themes
- 📊 SEO optimization
- 🔍 Full-text search functionality
- 📱 Responsive design
- 🚀 Server-side rendering and static generation
- 📂 Category and tag management
- 💬 Commenting system with Utterances
- 📈 Analytics integration
- 🔔 Email notifications

## 🛠 Tech Stack

<details>
<summary>Click to expand</summary>

- **Frontend**:
  - Next.js 13+ (App Router)
  - React 18+
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - shadcn/ui components

- **Backend**:
  - Node.js
  - Prisma ORM
  - PostgreSQL
  - tRPC

- **Authentication**:
  - NextAuth.js

- **Testing**:
  - Jest
  - React Testing Library
  - Cypress

- **DevOps**:
  - Docker
  - GitHub Actions
  - Vercel

- **Monitoring**:
  - Sentry
  - Plausible Analytics

</details>

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mlibane/nidix.git
   cd nidix
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration.

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

Visit `http://localhost:3000` to see the application.

## ⚙ Configuration

<details>
<summary>Environment Variables</summary>

- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_SECRET`: A random string for NextAuth.js
- `GITHUB_ID` and `GITHUB_SECRET`: For GitHub OAuth
- `GOOGLE_ID` and `GOOGLE_SECRET`: For Google OAuth
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: For image uploads
- `NEXT_PUBLIC_SITE_URL`: Your production URL

</details>

## 📘 Usage

1. **Creating a New Post**:
   - Navigate to `/create-post`
   - Use the rich text editor to write your content
   - Add tags and select a category
   - Publish or save as draft

2. **Managing Posts**:
   - Go to `/dashboard` to see all your posts
   - Edit, delete, or change the status of posts

3. **Customizing Your Profile**:
   - Visit `/profile` to update your information
   - Add a bio, social links, and profile picture


## 🚢 Deployment

Nidix is configured for easy deployment on Vercel:

1. Fork this repository
2. Create a new project on Vercel
3. Connect your forked repository
4. Set up environment variables
5. Deploy!

For other platforms, refer to the [deployment guide](docs/DEPLOYMENT.md).


<details>
<summary>Contribution process overview</summary>

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

</details>

## 👏 Acknowledgements

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- [Tiptap](https://tiptap.dev/) - The headless editor framework for web artisans
- [Framer Motion](https://www.framer.com/motion/) - A production-ready motion library for React
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components built using Radix UI and Tailwind CSS

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/mlibane">Libane</a>
</p>

<p align="center">
  <a href="https://github.com/mlibane"><img src="https://img.shields.io/github/followers/mlibane.svg?label=Follow&style=social" alt="GitHub Follow" /></a>
</p>
