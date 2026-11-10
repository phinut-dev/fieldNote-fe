function SearchAndFilter() {
  return (
    <>
      <div className="flex gap-5 justify-between mb-5">
        {/* Search */}
        <input
          type="text"
          placeholder="Search Task..."
          className="border border-line rounded-xl py-2 px-3 bg-white w-0 flex-1"
        />
        {/* sort */}
        <select
          name=""
          id=""
          className="border border-line rounded-lg p-2 bg-white"
        >
          <option value="">All Status</option>
          <option value="">Assigned</option>
        </select>
        {/* filter */}
      </div>
    </>
  );
}

export default SearchAndFilter;
