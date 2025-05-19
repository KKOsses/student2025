import React, { useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../utils/firebase';

function LoginPage({ onLogin }) {
  const [uid, setUid] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!uid || !password) {
      setError('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }

    const userRef = ref(db, 'users/' + uid);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      if (userData.password === password) {
        onLogin(userData); // ส่ง user ทั้งหมดให้ App
      } else {
        setError('รหัสผ่านไม่ถูกต้อง');
      }
    } else {
      setError('ไม่พบผู้ใช้นี้ในระบบ');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">เข้าสู่ระบบ</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <input
          className="form-control mb-3"
          placeholder="รหัสผู้ใช้ (UID)"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
        />
        <input
          className="form-control mb-3"
          placeholder="รหัสผ่าน"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary w-100" onClick={handleLogin}>
          เข้าสู่ระบบ
        </button>
      </div>
    </div>
  );
}

export default LoginPage;