function SummaryCard({ title, value, loading }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold">
        {loading ? <span className="inline-block w-16 h-8 bg-gray-200 rounded animate-pulse"></span> : value}
      </h2>
    </div>
  );
}