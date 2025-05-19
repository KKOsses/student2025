
import React, { useState, useEffect } from "react";
import { ref, onValue, remove, set } from "firebase/database";
import { db } from "../utils/firebase";
import { v4 as uuidv4 } from "uuid";
import QRCode from "react-qr-code";

// ... [ตัดเนื้อหาอื่น ๆ ออกเพื่อย่อ] ...
// คุณสามารถใช้ไฟล์ก่อนหน้าเป็นตัวอย่าง หรือขอให้ส่งไฟล์ zip ได้อีกครั้ง
