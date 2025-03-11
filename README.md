# Will I Go Viral 🚀

<img width="1607" alt="Screenshot 2025-02-23 at 10 41 57 AM" src="https://github.com/user-attachments/assets/1b4c112d-d152-44f2-99a8-bab1dc2d1e9a" />

## Inspiration 🎬
Ever wondered why some videos blow up while others flop? We did too! A lot of creators struggle with cracking the virality code, so we built a tool to make that easier. Our mission? **Predict not just virality, but revenue potential** based on engagement trends. 🚀 By understanding how content performs, creators can make smarter decisions and maximize their earnings. 💰

## What it does 🎯
"Will I Go Viral" gives insights into key video elements—like the hook, format, and engagement triggers—to help creators optimize their content. Using social media API data (like Instagram’s Graph API), we analyze likes, comments, shares, captions, and more to see what really makes a video take off. 📈🔥 More importantly, we estimate **how much revenue a creator could earn** based on virality predictions. 💵

## Tech Stack 🛠️
- **Frontend:** Next.js 🎨
- **Backend:** Python (Flask) 🐍
- **Machine Learning:** Python + joblib for revenue prediction 🤖💡
- **Infrastructure:** AWS Lambda ☁️
- **Containerization:** Docker 🐳
- **Data Processing:** NLP for analyzing captions and engagement trends 🪄
- **Social Media API Integration:** Instagram Graph API for video metadata & engagement metrics

## Challenges We Ran Into 🤯
- **Limited API Access:** Platforms restrict data access, so we had to find workarounds. 🔐
- **Data Overload:** Normalizing engagement data across different formats was tricky! 😵‍💫
- **Revenue Prediction Complexity:** Estimating earnings required extensive modeling and feature engineering. 📊💸
- **Real-Time Analysis:** Processing vast amounts of data quickly is always a challenge. ⏳

## Accomplishments 🎉
- Successfully pulled and analyzed social media data. ✅
- Built an interactive dashboard for tracking video performance and estimated revenue. 📊💰
- Trained an early-stage machine learning model to predict how much a video might earn based on its virality potential. 🔮💡

## What We Learned 📚
- How to work with social media APIs and extract meaningful insights. 🛠️
- Engagement is about **way more** than just views—shares and retention matter too! 🔄
- Predicting revenue from virality requires deep data analysis and machine learning expertise. 📉📈
- Different content strategies can make or break virality. 🚀

## What's Next 🚀
- **More Platforms:** Expanding to TikTok and YouTube next! 🎥📲
- **More Accurate Revenue Predictions:** Refining our ML model with more data points. 💵📊
- **Personalized Creator Tips:** Recommending strategies based on successful videos. 🏆
- **Real-Time Trend Alerts:** Faster insights so creators can hop on trends instantly. ⏩⚡

## How to Run 🏃‍♂️
1. Clone the repository:  
   ```bash
   git clone https://github.com/yourusername/will-i-go-viral.git
   ```
2. Install dependencies:  
   ```bash
   cd will-i-go-viral
   pip install -r requirements.txt
   ```
3. Start the backend server:  
   ```bash
   flask run
   ```
4. Start the frontend:  
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
