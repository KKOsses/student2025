import React, { useState } from 'react';
import StudentTable from '../components/StudentTable.jsx';
import ScoreForm from '../components/ScoreForm.jsx';
import TeacherProfile from "../components/TeacherProfile.jsx";

function TeacherDashboard({ user, onLogout }) {
  const [activeMenu, setActiveMenu] = useState('students');

  const renderContent = () => {
    switch (activeMenu) {
      case 'teacher':
        return <TeacherProfile />;
      case 'students':
        return <StudentTable />;
      case 'scores':
        return <ScoreForm />;
      case 'behaviors':
        return <div className="p-3">📖 แบบฟอร์มบันทึกพฤติกรรม (กำลังพัฒนา)</div>;
      case 'logs':
        return <div className="p-3">🕒 ประวัติการใช้งาน (กำลังพัฒนา)</div>;
      default:
        return <div>เลือกเมนูจากด้านซ้าย</div>;
    }
  };

  const menuItems = [
    { key: 'teacher', icon: 'bi-person-badge', label: 'ข้อมูลคุณครู' },
    { key: 'students', icon: 'bi-people-fill', label: 'จัดการนักเรียน' },
    { key: 'scores', icon: 'bi-journal-check', label: 'บันทึกคะแนน' },
    { key: 'behaviors', icon: 'bi-emoji-smile', label: 'บันทึกพฤติกรรม' },
    { key: 'logs', icon: 'bi-clock-history', label: 'ประวัติการใช้งาน' }
  ];

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <div className="bg-white border-end p-3" style={{ width: '250px' }}>
        <h4 className="mb-4 fw-bold text-primary">📋 เมนูครู</h4>
        <div className="list-group">
          {menuItems.map((item) => (
            <button key={item.key}
              onClick={() => setActiveMenu(item.key)}
              className={`list-group-item list-group-item-action d-flex align-items-center gap-2 ${
                activeMenu === item.key ? 'active' : ''
              }`}
            >
              <i className={`bi ${item.icon}`}></i> {item.label}
            </button>
          ))}
        </div>
        <hr />
        <button onClick={onLogout} className="btn btn-outline-danger w-100 mt-2">🚪 ออกจากระบบ</button>
      </div>

      {/* Content */}
      <div className="flex-grow-1 p-4 bg-light">
        <h2 className="mb-4">สวัสดีคุณครู {user.nickname}</h2>
        <div className="bg-white p-4 rounded shadow-sm">{renderContent()}</div>
      </div>
    </div>
  );
}

export default TeacherDashboard;