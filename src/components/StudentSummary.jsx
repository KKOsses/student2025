import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../utils/firebase';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function StudentSummary({ student }) {
  const [scores, setScores] = useState([]);
  const [behaviors, setBehaviors] = useState([]);
  const [maxScores, setMaxScores] = useState({});
  const [showChart, setShowChart] = useState(false);

  const categories = ["แบบฝึกหัด", "กิจกรรม", "สอบกลางภาค", "สอบปลายภาค", "จิตพิสัย"];

  useEffect(() => {
    onValue(ref(db, 'scores'), (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.values(data).filter(s => s.uid === student.uid);
      setScores(list);
    });

    onValue(ref(db, 'behaviors'), (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.values(data).filter(s => s.uid === student.uid);
      setBehaviors(list);
    });

    onValue(ref(db, 'maxScores'), (snapshot) => {
      setMaxScores(snapshot.val() || {});
    });
  }, [student.uid]);

  const getCategoryScore = (category, term) => {
    if (category === "จิตพิสัย") {
      const items = behaviors.filter(b => b.term === term);
      if (items.length === 0) return null;

      const total = items.reduce((sum, b) => {
        if (b.severity === 0) return sum + (parseFloat(b.bonus || 0));
        return sum - parseInt(b.severity);
      }, 0);

      const count = items.length;
      const avg = total / count;
      const full = maxScores["จิตพิสัย"] || 20;
      const percent = (avg * 100) / full;
      const score = (percent * full) / 100;
      return Math.max(0, Math.min(score, full)).toFixed(2);
    } else {
      const items = scores.filter(s => s.category === category && s.term === term);
      if (items.length === 0) return null;

      const sumPercent = items.reduce((sum, s) => {
        const score = parseFloat(s.score || 0);
        const full = parseFloat(s.fullScore || 0);
        return sum + (full > 0 ? (score / full) : 0);
      }, 0);

      const avgPercent = sumPercent / items.length;
      const max = maxScores[category] || 20;
      return parseFloat((avgPercent * max).toFixed(2));
    }
  };

  const buildTermData = (term) => {
    return categories.map(cat => ({
      category: cat,
      score: parseFloat(getCategoryScore(cat, term)) || 0
    }));
  };

  const term1 = buildTermData("1");
  const term2 = buildTermData("2");

  const chartData = categories.map(cat => ({
    category: cat,
    term1: term1.find(t => t.category === cat)?.score || 0,
    term2: term2.find(t => t.category === cat)?.score || 0
  }));

  const total = (termData) => {
    return termData.reduce((sum, item) => sum + (item.score || 0), 0);
  };

  const grade = (score) => {
    if (score >= 80) return 4.0;
    if (score >= 75) return 3.5;
    if (score >= 70) return 3.0;
    if (score >= 65) return 2.5;
    if (score >= 60) return 2.0;
    if (score >= 55) return 1.5;
    if (score >= 50) return 1.0;
    return 0;
  };

  const total1 = total(term1);
  const total2 = total(term2);
  const diff = total2 - total1;
  const diffPercent = total1 > 0 ? ((diff / total1) * 100).toFixed(2) : "0.00";

  let summaryText = `โดยภาพรวม ${student.nickname} มีผลการเรียนคงที่`;
  let color = "black";
  if (diff > 0.01) {
    summaryText = `โดยภาพรวม ${student.nickname} มีผลการเรียนดีขึ้น ${diffPercent}%`;
    color = "green";
  } else if (diff < -0.01) {
    summaryText = `โดยภาพรวม ${student.nickname} มีผลการเรียนแย่ลง ${Math.abs(diffPercent)}%`;
    color = "orange";
  }

  return (
    <div className="mt-4">
      <h5>📊 สรุปคะแนนของ {student.nickname}</h5>

      <div className="table-responsive">
        <table className="table table-bordered text-center">
          <thead className="table-light">
            <tr>
              <th>เทอม</th>
              {categories.map(c => (
                <th key={c}>{c}<br /><small>({maxScores[c] || 20})</small></th>
              ))}
              <th>รวม<br />(100)</th>
              <th>เกรด</th>
            </tr>
          </thead>
          <tbody>
            {[{ label: "1", data: term1 }, { label: "2", data: term2 }].map(t => {
              const totalScore = total(t.data);
              return (
                <tr key={t.label}>
                  <td>เทอม {t.label}</td>
                  {t.data.map((s, i) => (
                    <td key={i}>{s.score !== null ? s.score : "-"}</td>
                  ))}
                  <td>{Math.min(totalScore, 100).toFixed(2)}</td>
                  <td>{grade(totalScore).toFixed(1)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 fw-bold" style={{ color }}>{summaryText}</p>

      <button className="btn btn-outline-primary mb-2" onClick={() => setShowChart(!showChart)}>
        {showChart ? "ซ่อนกราฟ" : "แสดงกราฟเปรียบเทียบคะแนนรายหมวดหมู่"}
      </button>

      {showChart && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 10, right: 30, bottom: 0, left: 0 }}>
            <XAxis dataKey="category" />
            <YAxis domain={[0, 20]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="term1" name="เทอม 1" stroke="#8884d8" />
            <Line type="monotone" dataKey="term2" name="เทอม 2" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default StudentSummary;