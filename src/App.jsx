import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => setUser(null);

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <>
      {user.role === 'teacher' && <TeacherDashboard user={user} onLogout={handleLogout} />}
      {user.role === 'student' && <StudentDashboard user={user} onLogout={handleLogout} />}
    </>
  );
}

export default App;