import React, { useEffect, useState } from "react";
import { ref, set, onValue } from "firebase/database";
import { db } from "../utils/firebase";
import { v4 as uuidv4 } from "uuid";

function BehaviorForm({ editData, clearEdit }) {
  const initialState = {
    date: "",
    nickname: "",
    behavior: "",
    severity: "1",
    bonus: "",
    uid: "",
    term: "1"
  };

  const [form, setForm] = useState(initialState);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const userRef = ref(db, "users");
    onValue(userRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.values(data).filter(u => u.role === "student");
      setStudents(list);
    });
  }, []);

  useEffect(() => {
    if (editData) {
      setForm({
        ...editData,
        severity: editData.severity?.toString() || "1",
        bonus: editData.bonus?.toString() || "",
        term: editData.term || "1"
      });
    } else {
      setForm(initialState);
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = editData?.id || uuidv4();

    const student = students.find(s => s.nickname === form.nickname);
    const uid = student?.uid;
    if (!uid) {
      alert("ไม่พบรหัส UID ของนักเรียน");
      return;
    }

    const payload = {
      date: form.date,
      nickname: form.nickname,
      behavior: form.behavior,
      term: form.term,
      severity: parseInt(form.severity),
      uid
    };

    if (parseInt(form.severity) === 0) {
      payload.bonus = parseFloat(form.bonus || 0);
    }

    await set(ref(db, "behaviors/" + id), payload);
    clearEdit();
    setForm(initialState);
  };

  return (
    <form className="card card-body mb-4" onSubmit={handleSubmit}>
      <div className="row g-2 align-items-end">
        <div className="col-md-2">
          <label className="form-label">วันที่</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} className="form-control" required />
        </div>
        <div className="col-md-2">
          <label className="form-label">ชื่อเล่น</label>
          <select name="nickname" value={form.nickname} onChange={handleChange} className="form-select" required>
            <option value="">เลือกชื่อเล่น</option>
            {students.map(s => (
              <option key={s.uid} value={s.nickname}>{s.nickname}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label">เทอม</label>
          <select name="term" value={form.term} onChange={handleChange} className="form-select" required>
            <option value="1">เทอม 1</option>
            <option value="2">เทอม 2</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">พฤติกรรม</label>
          <input type="text" name="behavior" value={form.behavior} onChange={handleChange} className="form-control" required />
        </div>
        <div className="col-md-2">
          <label className="form-label">ระดับความรุนแรง</label>
          <select name="severity" value={form.severity} onChange={handleChange} className="form-select">
            {["0", "1", "2", "3", "4", "5"].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        {form.severity === "0" && (
          <div className="col-md-2">
            <label className="form-label">คะแนนบวก</label>
            <input type="number" name="bonus" value={form.bonus} onChange={handleChange} className="form-control" min="0" />
          </div>
        )}
        <div className="col-md-1">
          <button type="submit" className="btn btn-success w-100">💾</button>
        </div>
      </div>
    </form>
  );
}

export default BehaviorForm;