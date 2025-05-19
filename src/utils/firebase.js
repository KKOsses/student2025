import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD0dkJ2kyflxx7YXMk4uRUKBmG_-DVdAgw",
  authDomain: "new2025-df8b1.firebaseapp.com",
  databaseURL: "https://new2025-df8b1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "new2025-df8b1",
  storageBucket: "new2025-df8b1.appspot.com",
  messagingSenderId: "484552082660",
  appId: "1:484552082660:web:1bbe9e590e8a749d3e98f1"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
