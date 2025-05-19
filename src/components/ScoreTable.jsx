import React, { useState, useEffect } from "react";
import { ref, onValue, remove } from "firebase/database";
import { db } from "../utils/firebase";
import ScoreForm from "./ScoreForm";

function ScoreTable() {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [editData, setEditData] = useState(null);
  const [filters, setFilters] = useState({ nickname: "", term: "", category: "" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    onValue(ref(db, "scores"), (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, v]) => ({ id, ...v }));
      setRecords(list);
    });

    onValue(ref(db, "users"), (snapshot) => {
      const data = snapshot.val() || {};
      const studentList = Object.values(data).filter(s => s.role === "student");
      setStudents(studentList);
    });
  }, []);

  const filtered = records.filter(r => {
    const matchNickname = filters.nickname ? r.nickname === filters.nickname : true;
    const matchTerm = filters.term ? r.term === filters.term : true;
    const matchCategory = filters.category ? r.category === filters.category : true;
    return matchNickname && matchTerm && matchCategory;
  });

  const totalScore = filtered.reduce((sum, r) => sum + (parseFloat(r.score) || 0), 0);
  const totalFull = filtered.reduce((sum, r) => sum + (parseFloat(r.fullScore) || 0), 0);
  const percent = totalFull > 0 ? ((totalScore / totalFull) * 100).toFixed(2) : "0.00";

  const handleDelete = (id) => {
    if (window.confirm("ลบข้อมูลนี้หรือไม่?")) {
      remove(ref(db, "scores/" + id));
    }
  };

  return (
    <div className="mt-4">
      <h5 className="fw-bold mb-3">📊 บันทึกคะแนน</h5>

      <button className="btn btn-primary mb-3" onClick={() => {
        setEditData(null);
        setShowForm(!showForm);
      }}>
        {showForm ? "➖ ปิดฟอร์ม" : "➕ เพิ่ม / แก้ไขคะแนน"}
      </button>

      {showForm && (
        <ScoreForm editData={editData} onSave={() => setShowForm(false)} />
      )}

      <div className="row g-2 mb-3">
        <div className="col-md-2">
          <select className="form-select" value={filters.nickname} onChange={e => setFilters({ ...filters, nickname: e.target.value })}>
            <option value="">นักเรียนทั้งหมด</option>
            {students.map(s => (
              <option key={s.uid} value={s.nickname}>{s.nickname}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-select" value={filters.term} onChange={e => setFilters({ ...filters, term: e.target.value })}>
            <option value="">ทุกเทอม</option>
            <option value="1">เทอม 1</option>
            <option value="2">เทอม 2</option>
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-select" value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}>
            <option value="">ทุกหมวดหมู่</option>
            {["แบบฝึกหัด", "กิจกรรม", "สอบกลางภาค", "สอบปลายภาค", "จิตพิสัย"].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-2">
        <strong>ผลลัพธ์:</strong> {filtered.length} รายการ | คะแนนรวม: {totalScore} / {totalFull} | คิดเป็น {percent}%
      </div>

      <div className="table-responsive">
        <table className="table table-bordered text-center">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>วันที่</th>
              <th>ชื่อเล่น</th>
              <th>เทอม</th>
              <th>หมวด</th>
              <th>คะแนน</th>
              <th>หมายเหตุ</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>{r.date}</td>
                <td>{r.nickname}</td>
                <td>{r.term}</td>
                <td>{r.category}</td>
                <td>{r.score} / {r.fullScore}</td>
                <td>{r.note || "-"}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-1" onClick={() => {
                    setEditData(r);
                    setShowForm(true);
                  }}>✏️</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ScoreTable;