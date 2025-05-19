import React from 'react';

function StudentDashboard({ user, onLogout }) {
  return (
    <div className="container mt-5">
      <h3>🎓 สวัสดีนักเรียน {user.nickname}</h3>
      <p>UID: {user.uid}</p>
      <p>หน้าสำหรับแสดงผลนักเรียนกำลังพัฒนา</p>
      <button className="btn btn-danger" onClick={onLogout}>ออกจากระบบ</button>
    </div>
  );
}

export default StudentDashboard;