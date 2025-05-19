import React, { useEffect, useState } from "react";
import { ref, onValue, remove } from "firebase/database";
import { db } from "../utils/firebase";
import BehaviorForm from "./BehaviorForm";

function BehaviorTable() {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filters, setFilters] = useState({ nickname: "", year: "", month: "" });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    onValue(ref(db, "behaviors"), (snapshot) => {
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

  const handleDelete = (id) => {
    if (window.confirm("ยืนยันลบข้อมูล?")) {
      remove(ref(db, "behaviors/" + id));
    }
  };

  const handleToggleForm = () => {
    setShowForm(!showForm);
    setEditData(null);
  };

  const filtered = records.filter(r => {
    const date = new Date(r.date);
    const matchNickname = filters.nickname ? r.nickname === filters.nickname : true;
    const matchYear = filters.year ? date.getFullYear().toString() === filters.year : true;
    const matchMonth = filters.month ? (date.getMonth() + 1).toString().padStart(2, "0") === filters.month : true;
    return matchNickname && matchYear && matchMonth;
  });

  const pageCount = Math.ceil(filtered.length / rowsPerPage);
  const displayed = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="mt-4">
      <h5 className="fw-bold mb-3">📋 รายการบันทึกพฤติกรรม</h5>

      <button className="btn btn-primary mb-3" onClick={handleToggleForm}>
        {showForm && !editData ? "➖ ปิดฟอร์ม" : "➕ เพิ่มข้อมูลใหม่"}
      </button>

      {showForm && (
        <BehaviorForm editData={editData} clearEdit={() => {
          setEditData(null);
          setShowForm(false);
        }} />
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
          <select className="form-select" value={filters.year} onChange={e => setFilters({ ...filters, year: e.target.value })}>
            <option value="">ทุกปี</option>
            {[...new Set(records.map(r => new Date(r.date).getFullYear()))].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-select" value={filters.month} onChange={e => setFilters({ ...filters, month: e.target.value })}>
            <option value="">ทุกเดือน</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={String(m).padStart(2, "0")}>{m}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-select" value={rowsPerPage} onChange={e => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}>
            {[10, 25, 50, 100].map(n => (
              <option key={n} value={n}>{n} แถว</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered text-center">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>วันที่</th>
              <th>ชื่อเล่น</th>
              <th>เทอม</th>
              <th>พฤติกรรม</th>
              <th>ระดับความรุนแรง</th>
              <th>คะแนนบวก</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((r, idx) => (
              <tr key={r.id}>
                <td>{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                <td>{r.date}</td>
                <td>{r.nickname}</td>
                <td>{r.term || "-"}</td>
                <td>{r.behavior}</td>
                <td>{r.severity}</td>
                <td>{parseInt(r.severity) === 0 ? r.bonus : "-"}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => {
                    setEditData(r);
                    setShowForm(true);
                  }}>✏️</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <nav className="mt-2">
          <ul className="pagination justify-content-center">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map(p => (
              <li key={p} className={`page-item ${p === currentPage ? "active" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(p)}>{p}</button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

export default BehaviorTable;