Hi Randall,

Here’s my complete submission for the Full Stack Content Engineer exercise.

---

### ✅ Overview

This solution crawls, stores, and serves OSHA Letters of Interpretation using a serverless architecture with all required technologies:

- **Crawler**: Built with Crawlee + Cheerio, extracts letter metadata and content from osha.gov  
- **Database**: MongoDB Atlas  
- **Microservices**: Two AWS Lambda functions (with API Gateway and CORS support)  
- **Frontend**: React + Vite + MDB UI, deployed serverlessly via S3 + CloudFront (with HTTPS)

---

### 📂 Repositories

- **Crawler**: [`osha-crawler`](https://github.com/Bestmart721/osha-crawler)  
- **Lambda Functions**: [`osha-serverless-functions`](https://github.com/Bestmart721/osha-serverless-functions)  
- **Frontend Viewer App**: [`osha-viewer`](https://github.com/Bestmart721/osha-viewer)

---

### 🌐 Live Deployment

- **Frontend (HTTPS)**: [https://d1f1nqmd4lukr6.cloudfront.net](https://d1f1nqmd4lukr6.cloudfront.net)  
- **API Endpoints**:  
  - `https://1wxsfs7z3d.execute-api.us-east-2.amazonaws.com/prod/` → Returns all years/dates  
  - `https://tqaylbw8b3.execute-api.us-east-2.amazonaws.com/prod?date=YYYY-MM-DD` → Returns matching OSHA entries  

---

### 🧠 Notes

- Frontend is fully integrated with API endpoints and allows exploring content by year/date  
- Lambda proxy integration is enabled with proper CORS headers  
- MongoDB Atlas is secured and auto-connected from each service  
- Code is modular and designed to be production-ready and easy to maintain

---

Thanks again for the opportunity — happy to walk through the design decisions or do a live demo if needed.

Best,  
**Matthew Sliger**
