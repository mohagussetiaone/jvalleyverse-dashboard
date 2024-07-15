import { Fragment, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import TableContainer from "@/components/table/TableContainer";
import Search from "@/components/Search";
import CreateAndExport from "@/components/CreateAndExport";
import { IoMdMore } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from "@headlessui/react";
import Loading from "@/components/Loading";
import ErrorPage from "@/components/error/ErrorPage";
import AddRoles from "./AddRoles";
import EditRoles from "./EditRoles";
import { handleGetRoles } from "@/api/Roles/RolesApi";

const Roles = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [dataRole, setDataRole] = useState({});

  const handleEdit = (data) => {
    setDataRole(data);
    setShowEdit(!showEdit);
  };

  const columns = useMemo(
    () => [
      {
        id: "id",
        header: () => <p className="text-sm font-bold text-gray-800 dark:text-neutral-300">ID</p>,
        accessorKey: "id",
      },
      {
        id: "role_name",
        header: () => <p className="text-sm font-bold text-gray-800 dark:text-neutral-300">Nama</p>,
        accessorKey: "role_name",
      },
      {
        id: "aksi",
        header: () => <p className="text-sm font-bold text-gray-800 dark:text-neutral-300">Action</p>,
        cell: (info) => {
          return (
            <Menu as="div" className=" flex justify-start">
              <div>
                <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white dark:bg-black-500 dark:bg-navy-700 px-3 py-2 text-sm font-semibold text-black">
                  <IoMdMore className="-mr-1 h-5 w-5 dark:text-neutral-300" />
                </MenuButton>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <MenuItems className="absolute right-[26%] mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg focus:outline-none dark:bg-boxDark z-20">
                  <div className="rounded-lg">
                    <MenuItem>
                      <button className="flex w-full items-center px-4 py-2 text-sm text-black dark:text-white" onClick={() => handleEdit(info.row.original)}>
                        <MdOutlineEdit className="mr-2 w-6 h-6 dark:text-white" />
                        Edit
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </Transition>
            </Menu>
          );
        },
      },
    ],
    []
  );

  const {
    error: errorRoles,
    isPending: isPendingRoles,
    data: dataRoles,
  } = useQuery({
    queryKey: ["getRoles"],
    queryFn: handleGetRoles,
  });

  if (isPendingRoles) {
    return <Loading />;
  }

  if (errorRoles) {
    return <ErrorPage />;
  }
  console.log("data Roles", dataRoles);

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <Search globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} tableName="Roles" />
          <CreateAndExport setShowAdd={setShowAdd} datas={dataRoles || []} TableName="Roles" />
        </div>
        <TableContainer datas={dataRoles || []} columns={columns} tableName="Roles" globalFilter={globalFilter} title="User" setGlobalFilter={setGlobalFilter} setModalAdd={() => setModalAdd(!modalAdd)} />
      </div>
      {/* Modal Add */}
      {showAdd && <AddRoles showAdd={showAdd} setShowAdd={() => setShowAdd(!showAdd)} />}
      {/* Modal Edit */}
      {showEdit && <EditRoles dataRole={dataRole} showEdit={showEdit} setShowEdit={() => setShowEdit(!showEdit)} />}
    </>
  );
};

export default Roles;
