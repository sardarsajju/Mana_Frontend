import styles from './Topbar.module.css'
function Topbar({ name }) {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded shadow">
      <h1 className="text-xl font-semibold">Welcome, Dr. {name}</h1>

      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
    </div>
  );
}

export default Topbar;
