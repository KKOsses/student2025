import React, { useState } from 'react';
import StudentTable from '../components/StudentTable';
import ScoreForm from '../components/ScoreForm';
import TeacherProfile from '../components/TeacherProfile';
import ScoreTable from '../components/ScoreTable';
import BehaviorForm from '../components/BehaviorForm';
import BehaviorTable from "../components/BehaviorTable";

function TeacherDashboard({ user, onLogout }) {
  const [view, setView] = useState('students');

  const menuItems = [
    { key: 'teacher', icon: 'bi-person-badge', label: 'ข้อมูลคุณครู' },
    { key: 'students', icon: 'bi-people-fill', label: 'จัดการนักเรียน' },
    { key: 'scores', icon: 'bi-journal-check', label: 'บันทึกคะแนน' },
    { key: 'behaviors', icon: 'bi-emoji-smile', label: 'บันทึกพฤติกรรม' }

  ];

  return (
    <div className="d-flex min-vh-100">
      <div className="bg-white border-end p-3" style={{ width: '250px' }}>
        <h4 className="mb-4 fw-bold text-primary">📋 เมนูครู</h4>
        <div className="list-group">
          {menuItems.map((item) => (
            <button key={item.key}
              onClick={() => setView(item.key)}
              className={`list-group-item list-group-item-action d-flex align-items-center gap-2 ${
                view === item.key ? 'active' : ''
              }`}
            >
              <i className={`bi ${item.icon}`}></i> {item.label}
            </button>
          ))}
        </div>
        <hr />
        <button onClick={onLogout} className="btn btn-outline-danger w-100 mt-2">🚪 ออกจากระบบ</button>
      </div>

      <div className="flex-grow-1 p-4 bg-light">
        <h2 className="mb-4">ยินดีต้อนรับคุณครู {user.nickname}</h2>
        <div className="bg-white p-4 rounded shadow-sm">
	{view === 'teacher' && <TeacherProfile userId={user.uid} />}
          {view === 'students' && <StudentTable />}
          {view === 'scores' && <ScoreTable />}
	{view === 'behaviors' && <BehaviorTable />}

        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;