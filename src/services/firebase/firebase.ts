
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA3OxuAM53qveK4JnJDOQyrVlZCXgrbt9E",
  authDomain: "teachflow-c108a.firebaseapp.com",
  projectId: "teachflow-c108a",
  storageBucket: "teachflow-c108a.firebasestorage.app",
  messagingSenderId: "305627453173",
  appId: "1:305627453173:web:e77f5f7a54eba8b86fd7bc",
  measurementId: "G-N2GFZ8VZY0"
};
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(app);

export default app;
