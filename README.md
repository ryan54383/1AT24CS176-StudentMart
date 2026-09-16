MERN Stack Lab ApplicationA full-stack web application built using the MERN stack architecture (MongoDB, Express.js, React, Node.js) bundled with Vite. This project demonstrates a decoupled front-end and back-end integration, featuring asynchronous state management and CRUD operations with a local database.🛠️ Tech StackFront-End: React 18, ViteBack-End: Node.js, Express.jsDatabase: MongoDB (via Mongoose ODM)Development Utilities: dotenv, cors📁 Project ArchitecturePlaintextReact lab/
├── server/                  # Node.js + Express Backend
│   ├── models/              # Mongoose Data Schemas
│   │   └── Item.js          # Item collection schema
│   ├── .env                 # Environment configuration (ignored in git)
│   ├── package.json         # Backend dependencies & scripts
│   └── server.js            # Express server initialization & routes
├── src/                     # React Front-End Application
│   └── main.jsx             # React entry point & UI code
├── index.html               # HTML entry point for Vite
├── package.json             # Front-end dependencies & scripts
└── vite.config.js           # Vite development server configuration
🚀 Getting StartedFollow these steps to set up and run the application locally.PrerequisitesEnsure you have the following installed on your machine:Node.js (v18 or higher recommended)MongoDB Community Server running locally on port 27017MongoDB Compass (optional, for database inspection)Installation & SetupClone the repository:Bashgit clone https://github.com/your-username/react-lab.git
cd react-lab
Install Front-End Dependencies:Bashnpm install
Install Back-End Dependencies:Bashcd server
npm install
cd ..
Environment Variables Configuration:Create a .env file inside the server/ directory:Code snippetPORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/react_lab_db
🏃 Running the ApplicationThe front-end and back-end run on separate ports concurrently. You will need two terminal instances.Terminal 1: Launch Backend ServerBashcd server
node server.js
The server will start at http://localhost:5000 and connect to your local MongoDB instance.Terminal 2: Launch Frontend ApplicationBashnpm run dev
Access the React client at http://localhost:5173.🔌 API EndpointsMethodEndpointDescriptionGET/api/itemsRetrieve all items stored in the databasePOST/api/itemsCreate and store a new item📜 LicenseDistributed under the MIT License. See LICENSE for more information.
