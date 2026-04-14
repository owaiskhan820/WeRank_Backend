# WeRank Backend

**1st Prize Winner – NUML Final Year Project Open House 2024**

A full-featured, intelligent **ranking-based social media platform** that completely rethinks how content should be discovered. Instead of being manipulated by raw likes and reactions, WeRank uses a sophisticated custom scoring algorithm that delivers genuinely high-quality content to users.

### ✨ What Makes WeRank Special

- **Smart Collaborative Ranking System** — Users create “Lists” (posts) that others can actively contribute to and re-rank in real time.
- **Advanced AI-Powered Ranking Algorithm** — My custom engine calculates a true “quality score” using:
  - Weighted voting system
  - Exponential time decay (newer interactions matter more)
  - Hugging Face sentiment analysis on every comment (positive comments boost score, negative ones reduce it)
  - Position-based weighting inside each list
  - Normalized final score (0–5 scale) for consistent ranking

- **Intelligent Feed Recommendation Engine** — Suggests lists based on:
  - Lists from users you follow
  - Category matching with your interests
  - Second-degree connections (“followers of followers”)

- **Production-Ready Features**:
  - Secure JWT authentication + email verification (SendGrid)
  - Cloudinary image uploads with Multer
  - Dual validation layer (Joi + Express-Validator)
  - Clean Controller → Service → DAO architecture

### 🛠 Tech Stack & Architecture

- **Backend**: Node.js + Express (ES Modules)
- **Database**: MongoDB + Mongoose (well-structured schemas)
- **Auth**: JWT, bcrypt, SendGrid email system
- **AI**: Hugging Face Inference API for real-time sentiment analysis
- **File Handling**: Multer + Cloudinary
- **Architecture**: Scalable Controller-Service-DAO pattern (highly maintainable and testable)
- **Ready for Real-time**: Socket.io already integrated

This project demonstrates strong understanding of **backend design patterns**, **algorithm development**, **AI integration**, and **secure, scalable API development**.

### 🚀 How to Run Locally

```bash
git clone https://github.com/owaiskhan820/WeRank_Backend.git
cd WeRank_Backend
npm install
Create .env file (see .env.example):
envPORT=3000
MONGODB_URI=your_mongodb_uri
SENDGRID_API_KEY=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
HUGGING_FACE_API_TOKEN=...
Bashnpm start
Server runs on http://localhost:3000
