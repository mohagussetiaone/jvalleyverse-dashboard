import { MdOutlineSearch } from "react-icons/md";
const Search = ({ globalFilter, setGlobalFilter, tableName }) => {
  return (
    <>
      <div>
        <div className="relative flex items-center w-full md:min-w-full">
          <MdOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
          <input
            name="search"
            type="search"
            value={globalFilter}
            placeholder={`Search ${tableName}`}
            className="bg-white w-full pl-10 pr-2 py-2 border border-gray-600 text-gray-800 rounded-lg dark:bg-boxDark dark:text-white"
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default Search;
