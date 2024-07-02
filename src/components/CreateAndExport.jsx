import { MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const CreatePrint = ({ setShowAdd, direct, datas, TableName }) => {
  const navigate = useNavigate();
  const exportCSV = () => {
    const dateNow = new Date().toLocaleDateString("id-ID");
    const excludedColumns = ["id", "brand.id"];
    const filteredData =
      datas &&
      datas.map((rowData) => {
        const filteredRow = {};
        Object.keys(rowData).forEach((key) => {
          if (!excludedColumns.includes(key)) {
            filteredRow[key] = rowData[key];
          }
        });
        return filteredRow;
      });
    const csvData = Papa.unparse(filteredData);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${TableName}_${dateNow}.csv`);
  };

  const exportToExcel = () => {
    const dateNow = new Date().toLocaleDateString("id-ID");
    const excludedColumns = ["id", "brand.id"];
    const filteredData =
      datas &&
      datas.map((rowData) => {
        const filteredRow = {};
        Object.keys(rowData).forEach((key) => {
          if (!excludedColumns.includes(key)) {
            filteredRow[key] = rowData[key];
          }
        });
        return filteredRow;
      });
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
    XLSX.writeFile(wb, `${TableName}_${dateNow}.xlsx`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="flex justify-between md:justify-end mt-4 md:mt-0">
        <div className="mr-4">
          <div className="flex gap-2 md:gap-4">
            <span onClick={exportCSV}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" id="download-file" className="w-8 h-8 cursor-pointer">
                <path fill="#00b8df" d="M15.667 62h96v4h-96zM15.667 82H96v4H15.667zM15.667 102H83v4H15.667z"></path>
                <path
                  fill="#00b8df"
                  d="M47.667 64h4v60h-4zM104 80c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm10.882 16.988-.113.176-8.232 11.438c-.548.866-1.508 1.398-2.537 1.398s-1.989-.532-2.536-1.397l-8.346-11.614a3.01 3.01 0 0 1 .01-2.994 3.01 3.01 0 0 1 2.596-1.494H100V86c0-1.654 1.346-3 3-3h2c1.654 0 3 1.346 3 3v6.5h4.276c1.065 0 2.061.572 2.596 1.494a3.01 3.01 0 0 1 .01 2.994z"
                ></path>
                <path fill="#ff9a30" d="m84 125.95-.05.05H84zM114 77v-.05l-.05.05z"></path>
                <path
                  fill="#00b8df"
                  d="M111.071 44.243 71.757 4.929A9.936 9.936 0 0 0 64.687 2H24c-5.514 0-10 4.486-10 10v104c0 5.514 4.486 10 10 10h59.95l-4-4H24c-3.309 0-6-2.691-6-6V12c0-3.309 2.691-6 6-6h40.687c1.603 0 3.109.624 4.242 1.757l39.314 39.314A6.044 6.044 0 0 1 110 51.313V72.95l4 4V51.313c0-2.67-1.04-5.181-2.929-7.07z"
                ></path>
                <path fill="#fff" d="m113.95 77 .05-.05-4-4"></path>
              </svg>
            </span>
            <span onClick={exportToExcel}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" id="excel-file" className="w-8 h-8 cursor-pointer">
                <path
                  fill="#007732"
                  d="M80.016 96h-8.297L63.75 83.039 55.781 96H48l11.367-17.672-10.64-16.594h8.016l7.383 12.328 7.242-12.328h7.828L68.438 78.727 80.016 96zM104 80c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm10.882 16.988-.113.176-8.232 11.438c-.548.866-1.508 1.398-2.537 1.398s-1.989-.532-2.536-1.397l-8.346-11.614a3.01 3.01 0 0 1 .01-2.994 3.01 3.01 0 0 1 2.596-1.494H100V86c0-1.654 1.346-3 3-3h2c1.654 0 3 1.346 3 3v6.5h4.276c1.065 0 2.061.572 2.596 1.494a3.01 3.01 0 0 1 .01 2.994z"
                ></path>
                <path fill="#ff9a30" d="m84 125.95-.05.05H84zM114 77v-.05l-.05.05z"></path>
                <path
                  fill="#007732"
                  d="M111.071 44.243 71.757 4.929A9.936 9.936 0 0 0 64.687 2H24c-5.514 0-10 4.486-10 10v104c0 5.514 4.486 10 10 10h59.95l-4-4H24c-3.309 0-6-2.691-6-6V12c0-3.309 2.691-6 6-6h40.687c1.603 0 3.109.624 4.242 1.757l39.314 39.314A6.044 6.044 0 0 1 110 51.313V72.95l4 4V51.313c0-2.67-1.04-5.181-2.929-7.07z"
                ></path>
                <path fill="#fff" d="m113.95 77 .05-.05-4-4"></path>
              </svg>
            </span>
          </div>
        </div>
        <div>
          <button
            onClick={() => {
              if (direct) {
                navigate(direct);
              } else {
                setShowAdd(true);
              }
            }}
            size="sm"
            className="flex items-center btn btn-primary dark:btn-ghost dark:bg-black dark:hover:bg-boxDarkSecondary dark:border-0.5 dark:border-gray-200"
          >
            <MdAdd className="w-5 h-5 mr-2 text-white" />
            Create
          </button>
        </div>
      </div>
    </>
  );
};

export default CreatePrint;
