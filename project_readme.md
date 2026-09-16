# 🚀 MERN Stack Lab Application

A modern, full-stack web application built using the **MERN** stack architecture (**M**ongoDB, **E**xpress.js, **R**eact, **N**ode.js) bundled with **Vite**. 

This repository demonstrates a clean split-stack architecture (React/Vite client on port `5173` and Express/Node API server on port `5000`), complete with local MongoDB connectivity, RESTful API endpoints, and real-time client state management.

---

## 🛠️ Tech Stack

### **Front-End (Client)**
* **Library:** [React 18](https://react.dev/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Styling Framework:** [Tailwind CSS](https://tailwindcss.com/) *(configured for UI component upgrades)*

### **Back-End (Server)**
* **Runtime:** [Node.js](https://nodejs.org/)
* **Framework:** [Express.js](https://expressjs.com/)
* **Database:** [MongoDB](https://www.mongodb.com/) (Local instance via [Mongoose ODM](https://mongoosejs.com/))
* **Middleware & Utilities:** `cors`, `dotenv`, `nodemon`

---

## 📁 Project Architecture

The repository uses a split client-server directory structure to maintain a clear separation of concerns:

```text
React lab/
├── server/                      # Back-End Express API Server
│   ├── models/                  # Mongoose Database Schemas
│   │   └── Item.js              # Schema definition for Item collection
│   ├── .env                     # Server environment variables (Git ignored)
│   ├── package.json             # Backend dependencies & scripts
│   └── server.js                # Express app initialization & REST routes
├── src/                         # Front-End React Client Application
│   ├── main.jsx                 # Entry point & root component UI logic
│   └── index.css                # Global styles & Tailwind directives
├── index.html                   # Vite HTML entry point
├── package.json                 # Client dependencies & scripts
├── vite.config.js               # Vite build & dev server config
└── README.md                    # Project documentation
```

---

## 🚀 Getting Started

Follow these instructions to set up and run the application locally on a Windows/PowerShell environment.

### **Prerequisites**

Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
* [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally on port `27017`
* [MongoDB Compass](https://www.mongodb.com/products/tools/compass) (optional, for visual database administration)

---

### **Installation & Configuration**

1. **Clone the Repository**
   ```powershell
   git clone https://github.com/your-username/react-lab.git
   cd "React lab"
   ```

2. **Install Client Dependencies**
   Run the following in the project root folder:
   ```powershell
   npm install
   ```

3. **Install Server Dependencies**
   Navigate into the `server` directory and install back-end packages:
   ```powershell
   cd server
   npm install
   cd ..
   ```

4. **Environment Configuration**
   Create a `.env` file inside the `server/` folder with the following configuration:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/react_lab_db
   ```

---

## 🏃 Running the Application

Because the client and server run on different ports, open **two separate terminal tabs** in VS Code.

### **Terminal 1: Back-End Express Server**
```powershell
cd server
node server.js
```
> **Output:** `Server running on port 5000` & `MongoDB Connected`

*(Optional)* If you have `nodemon` configured:
```powershell
npm run dev
```

### **Terminal 2: Front-End React App (Vite)**
```powershell
# Run from the root "React lab" directory
npm run dev
```
> **Output:** `VITE vX.X.X ready in ... ms` -> `http://localhost:5173/`

Open `http://localhost:5173/` in your browser to interact with the live application.

---

## 🔌 REST API Reference

### **Items Endpoint (`/api/items`)**

| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/items` | Fetches all stored items from MongoDB | *None* | `Array<Item>` |
| **POST** | `/api/items` | Creates and saves a new item | `{ "name": "String" }` | `Item Object` |

#### **Example POST Body**
```json
{
  "name": "Complete MERN Setup"
}
```

---

## 🗺️ Project Roadmap

- [x] Initial full-stack MERN architecture setup with Vite.
- [x] MongoDB local database integration with Mongoose ODM.
- [x] Asynchronous client-server communication using Fetch API.
- [ ] Implement full CRUD operations (PUT for editing items, DELETE for removals).
- [ ] Integrate **Google OAuth 2.0** using Passport.js for secure user authentication.
- [ ] Implement a **Claude AI (Anthropic API)** proxy endpoint for authenticated workspace interactions.
- [ ] Redesign the UI using Tailwind CSS component libraries.

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the Project repository.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.