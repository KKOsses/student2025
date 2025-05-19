import React, { useState, useEffect } from "react";
import { ref, set, onValue } from "firebase/database";
import { db } from "../utils/firebase";
import { v4 as uuidv4 } from "uuid";

function ScoreForm({ editData, onSave }) {
  const initialState = {
    uid: "",
    nickname: "",
    category: "",
    score: "",
    fullScore: "",
    term: "1",
    note: "",
    date: new Date().toISOString().split("T")[0]
  };

  const [form, setForm] = useState(initialState);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    onValue(ref(db, "users"), (snapshot) => {
      const data = snapshot.val() || {};
      const studentList = Object.values(data).filter(u => u.role === "student");
      setStudents(studentList);
    });
  }, []);

  useEffect(() => {
    if (editData) {
      setForm(editData);
    } else {
      setForm(initialState);
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = editData?.id || uuidv4();
    const student = students.find(s => s.nickname === form.nickname);
    const uid = student?.uid || form.uid;

    const payload = {
      uid,
      nickname: form.nickname,
      category: form.category,
      score: parseFloat(form.score),
      fullScore: parseFloat(form.fullScore),
      term: form.term,
      note: form.note,
      date: form.date
    };

    await set(ref(db, "scores/" + id), payload);
    setForm(initialState);
    if (onSave) onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="card card-body mb-3">
      <div className="row g-2 align-items-end">
        <div className="col-md-2">
          <label className="form-label">ชื่อเล่น</label>
          <select name="nickname" value={form.nickname} onChange={handleChange} className="form-select" required>
            <option value="">เลือก</option>
            {students.map(s => (
              <option key={s.uid} value={s.nickname}>{s.nickname}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label">หมวดหมู่</label>
          <select name="category" value={form.category} onChange={handleChange} className="form-select" required>
            {["แบบฝึกหัด", "กิจกรรม", "สอบกลางภาค", "สอบปลายภาค", "จิตพิสัย"].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="col-md-1">
          <label className="form-label">คะแนน</label>
          <input type="number" name="score" value={form.score} onChange={handleChange} className="form-control" required />
        </div>
        <div className="col-md-1">
          <label className="form-label">เต็ม</label>
          <input type="number" name="fullScore" value={form.fullScore} onChange={handleChange} className="form-control" required />
        </div>
        <div className="col-md-1">
          <label className="form-label">เทอม</label>
          <select name="term" value={form.term} onChange={handleChange} className="form-select">
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">หมายเหตุ</label>
          <input type="text" name="note" value={form.note} onChange={handleChange} className="form-control" />
        </div>
        <div className="col-md-1">
          <label className="form-label">วันที่</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} className="form-control" required />
        </div>
        <div className="col-md-1">
          <button type="submit" className="btn btn-success w-100 mt-4">💾</button>
        </div>
      </div>
    </form>
  );
}

export default ScoreForm;