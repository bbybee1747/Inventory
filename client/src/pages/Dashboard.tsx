import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  if (!auth) return null;

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {auth.user && (
        <p>
          Welcome, {auth.user.name} ({auth.user.role})
        </p>
      )}
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white p-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
