import React, { useEffect, useState } from 'react';
import { ref, onValue, remove, set } from 'firebase/database';
import { db } from '../utils/firebase';
import StudentSummary from './StudentSummary.jsx';

function StudentTable() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    uid: '',
    firstname: '',
    lastname: '',
    nickname: '',
    gender: '',
    password: ''
  });
  const [selectedUid, setSelectedUid] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    onValue(ref(db, 'users'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const studentList = Object.entries(data)
          .filter(([_, u]) => u.role === 'student')
          .map(([id, u]) => ({ id, ...u }));
        setStudents(studentList);
      }
    });
  }, []);

  const handleSubmit = () => {
    const id = form.uid;
    if (!id) return alert('กรุณากรอก UID');
    const newStudent = { ...form, role: 'student' };
    set(ref(db, 'users/' + id), newStudent);
    setForm({ uid: '', firstname: '', lastname: '', nickname: '', gender: '', password: '' });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (id, data) => {
    setForm(data);
    setEditId(id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('ลบนักเรียนคนนี้หรือไม่?')) {
      remove(ref(db, 'users/' + id));
    }
  };

  const toggleScore = (student) => {
    if (selectedUid === student.uid) {
      setSelectedUid(null);
      setSelectedStudent(null);
    } else {
      setSelectedUid(student.uid);
      setSelectedStudent(student);
    }
  };

  return (
    <div className="mt-4">
      <h5 className="fw-bold mb-3">📚 จัดการนักเรียน</h5>
      <button className="btn btn-primary mb-3" onClick={() => {
        setForm({ uid: '', firstname: '', lastname: '', nickname: '', gender: '', password: '' });
        setEditId(null);
        setShowForm(!showForm);
      }}>
        {showForm ? '❌ ยกเลิก' : '➕ เพิ่มข้อมูลนักเรียน'}
      </button>

      {showForm && (
        <>
          <h6 className="fw-bold">📋 ข้อมูลทั่วไป</h6>
          <div className="row g-3 mb-2">
            <div className="col-md-3">
              <label>ชื่อจริง:</label>
              <input className="form-control" value={form.firstname} onChange={e => setForm({ ...form, firstname: e.target.value })} />
            </div>
            <div className="col-md-3">
              <label>นามสกุล:</label>
              <input className="form-control" value={form.lastname} onChange={e => setForm({ ...form, lastname: e.target.value })} />
            </div>
            <div className="col-md-2">
              <label>ชื่อเล่น:</label>
              <input className="form-control" value={form.nickname} onChange={e => setForm({ ...form, nickname: e.target.value })} />
            </div>
            <div className="col-md-2">
              <label>เพศ:</label>
              <select className="form-select" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                <option value="">เพศ</option>
                <option>ชาย</option>
                <option>หญิง</option>
              </select>
            </div>
          </div>

          <h6 className="fw-bold">🔐 ข้อมูลเข้าสู่ระบบ</h6>
          <div className="row g-3 mb-2">
            <div className="col-md-3">
              <label>UID:</label>
              <input className="form-control" value={form.uid} onChange={e => setForm({ ...form, uid: e.target.value })} disabled={!!editId} />
            </div>
            <div className="col-md-3">
              <label>รหัสผ่าน:</label>
              <input className="form-control" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
          </div>
          <div className="mt-2">
            <button className="btn btn-success" onClick={handleSubmit}>
              {editId ? '💾 บันทึกการแก้ไข' : '💾 บันทึก'}
            </button>
          </div>
        </>
      )}

      <div className="table-responsive mt-4">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>UID</th>
              <th>ชื่อ - สกุล</th>
              <th>ชื่อเล่น</th>
              <th>เพศ</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <React.Fragment key={s.uid}>
                <tr>
                  <td>{i + 1}</td>
                  <td>{s.uid}</td>
                  <td>{s.firstname} {s.lastname}</td>
                  <td>{s.nickname}</td>
                  <td>{s.gender}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => toggleScore(s)}>
                      {selectedUid === s.uid ? 'ซ่อนคะแนน' : 'ดูคะแนน'}
                    </button>
                    <button className="btn btn-sm btn-outline-success me-2" onClick={() => handleEdit(s.uid, s)}>แก้ไข</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s.uid)}>ลบ</button>
                  </td>
                </tr>
                {selectedUid === s.uid && (
                  <tr>
                    <td colSpan="6">
                      <StudentSummary student={selectedStudent} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentTable;