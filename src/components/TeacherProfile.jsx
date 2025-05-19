import React, { useEffect, useState } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../utils/firebase';

function TeacherProfile({ userId }) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    nickname: '',
    gender: '',
    uid: '',
    password: ''
  });

  useEffect(() => {
    const userRef = ref(db, 'users');
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data[userId] && data[userId].role === 'teacher') {
        const t = data[userId];
        setForm({
          firstname: t.firstname || '',
          lastname: t.lastname || '',
          nickname: t.nickname || '',
          gender: t.gender || '',
          uid: t.uid || '',
          password: t.password || ''
        });
      }
    });
  }, [userId]);

  const handleSave = async () => {
    await update(ref(db, 'users/' + userId), { ...form });
    setEditMode(false);
  };

  return (
    <div className="card p-4">
      <h5 className="fw-bold mb-3">👩‍🏫 ข้อมูลคุณครู</h5>
      <button className="btn btn-outline-primary mb-3" onClick={() => setEditMode(!editMode)}>
        {editMode ? '❌ ยกเลิก' : '✏️ แก้ไขข้อมูลครู'}
      </button>
      <div className="row g-3">
        <div className="col-md-3">
          <label>ชื่อจริง:</label>
          <input className="form-control" value={form.firstname} onChange={e => setForm({ ...form, firstname: e.target.value })} disabled={!editMode} />
        </div>
        <div className="col-md-3">
          <label>นามสกุล:</label>
          <input className="form-control" value={form.lastname} onChange={e => setForm({ ...form, lastname: e.target.value })} disabled={!editMode} />
        </div>
        <div className="col-md-2">
          <label>ชื่อเล่น:</label>
          <input className="form-control" value={form.nickname} onChange={e => setForm({ ...form, nickname: e.target.value })} disabled={!editMode} />
        </div>
        <div className="col-md-2">
          <label>เพศ:</label>
          <select className="form-select" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} disabled={!editMode}>
            <option value="">-</option>
            <option>ชาย</option>
            <option>หญิง</option>
          </select>
        </div>
        <div className="col-md-2">
          <label>รหัสผ่าน:</label>
          <input className="form-control" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} disabled={!editMode} />
        </div>
        <div className="col-md-3">
          <label>UID (อ่านเท่านั้น):</label>
          <input className="form-control" value={form.uid} disabled />
        </div>
      </div>
      {editMode && (
        <div className="mt-3">
          <button className="btn btn-success" onClick={handleSave}>💾 บันทึกการแก้ไข</button>
        </div>
      )}
    </div>
  );
}

export default TeacherProfile;