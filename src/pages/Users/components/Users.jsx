import { Fragment, useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "@/configs/supabaseConfig";
import toast from "react-hot-toast";
import TableContainer from "@/components/table/TableContainer";
import Search from "@/components/Search";
import CreateAndExport from "@/components/CreateAndExport";
import { IoMdMore } from "react-icons/io";
import { MdOutlineEdit, MdOutlineDeleteOutline } from "react-icons/md";
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from "@headlessui/react";
import Loading from "@/components/Loading";
import ErrorPage from "@/components/error/ErrorPage";
// import AddProject from "./AddProject";
// import EditProject from "./EditProject";
// import ModalDelete from "@/components/modal/ModalDelete";
import { handleGetUsers } from "@/api/Users/UserApi";
import ImageDefault from "@/assets/images/users/profileDefault.jpg";

const Users = () => {
  const queryClient = useQueryClient();
  const [globalFilter, setGlobalFilter] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [dataUser, setDataUser] = useState({});

  const handleEdit = (data) => {
    setDataUser(data);
    setShowEdit(!showEdit);
  };

  const handleDelete = (data) => {
    setDataUser(data);
    setModalDelete(!modalDelete);
  };

  const columns = useMemo(
    () => [
      {
        id: "profile_image_url",
        header: () => <p className="text-sm font-bold text-gray-800 dark:text-neutral-300">Foto Profile</p>,
        accessorKey: "profile_image_url",
        cell: (info) => {
          const { profile_image_url } = info.row.original;
          console.log("profile_image_url", profile_image_url);
          const profileImage = `${import.meta.env.VITE_CDN_GET_IMAGE}/jvalleyverseImg/${info.getValue()}`;
          console.log("info", profileImage);
          return <img src={profile_image_url === null || profile_image_url === "" ? ImageDefault : profileImage} className="w-12 h-12 rounded-full" />;
        },
      },
      {
        id: "name",
        header: () => <p className="text-sm font-bold text-gray-800 dark:text-neutral-300">Nama</p>,
        accessorKey: "name",
      },
      {
        id: "email",
        header: () => <p className="text-sm font-bold text-gray-800 dark:text-neutral-300">Email</p>,
        accessorKey: "email",
      },
      {
        id: "phone",
        header: () => <p className="text-sm font-bold text-gray-800 dark:text-neutral-300">Phone</p>,
        accessorKey: "phone",
      },
      {
        id: "role_id",
        header: () => <p className="text-sm font-bold text-gray-800 dark:text-neutral-300">Role</p>,
        accessorKey: "role_id",
        cell: (info) => {
          const roleId = info.getValue();
          let role;
          let colorClass;
          let bgClass;
          switch (roleId) {
            case 1:
              role = "Owner";
              colorClass = "text-red-500";
              bgClass = "bg-red-100";
              break;
            case 2:
              role = "Admin";
              colorClass = "text-blue-500";
              bgClass = "bg-blue-100";
              break;
            case 3:
              role = "Member";
              colorClass = "text-green-500";
              bgClass = "bg-green-100";
              break;
            default:
              role = "Unknown Role";
              colorClass = "text-gray-500";
              bgClass = "bg-gray-100";
          }
          return <span className={`w-auto truncate block ${colorClass} ${bgClass} p-1 rounded text-center`}>{role}</span>;
        },
      },
      {
        id: "verify",
        header: () => <p className="text-sm font-bold text-gray-800 dark:text-neutral-300">Verifikasi</p>,
        accessorKey: "verify",
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
                <MenuItems className="absolute right-[6%] mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg focus:outline-none dark:bg-boxDark z-20">
                  <div className="rounded-lg">
                    <MenuItem>
                      <button className="flex w-full items-center px-4 py-2 text-sm text-black dark:text-white" onClick={() => handleEdit(info.row.original)}>
                        <MdOutlineEdit className="mr-2 w-6 h-6 dark:text-white" />
                        Edit
                      </button>
                    </MenuItem>
                    <MenuItem>
                      <button className="flex w-full items-center px-4 py-2 text-sm text-black dark:text-white" onClick={() => handleDelete(info.row.original)}>
                        <MdOutlineDeleteOutline className="mr-2 w-6 h-6 dark:text-white" />
                        Delete
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
    error: errorUsers,
    isPending: isPendingUsers,
    data: dataUsers,
  } = useQuery({
    queryKey: ["getUsers"],
    queryFn: handleGetUsers,
  });

  console.log("dataUser", dataUsers);

  // Delete Category Users
  //   const handleDeleteCategory = () => {
  //     // Menampilkan toast ketika request sedang diproses
  //     const requestPromise = supabase.schema("belajar").from("project").delete().eq("id", dataUser.id);
  //     toast.promise(
  //       requestPromise,
  //       {
  //         loading: "Delete data process...",
  //         success: (response) => {
  //           console.log("response", response);
  //           if (response.status === 204) {
  //             setModalDelete(false);
  //             queryClient.invalidateQueries({
  //               queryKey: ["getProject"],
  //             });
  //           }
  //           return "Delete Users Successfully";
  //         },
  //         error: (error) => {
  //           console.log("error", error);
  //           return error.message || "Terjadi kesalahan saat memproses data";
  //         },
  //       },
  //       {
  //         success: {
  //           duration: 1500,
  //         },
  //         error: {
  //           duration: 2000,
  //         },
  //       }
  //     );
  //   };

  if (isPendingUsers) {
    return <Loading />;
  }

  if (errorUsers) {
    return <ErrorPage />;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <Search globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} tableName="Users" />
          <CreateAndExport setShowAdd={setShowAdd} datas={dataUsers || []} TableName="Users" />
        </div>
        <TableContainer datas={dataUsers || []} columns={columns} tableName="User" globalFilter={globalFilter} title="User" setGlobalFilter={setGlobalFilter} setModalAdd={() => setModalAdd(!modalAdd)} />
      </div>
      {/* Modal Add */}
      {/* {showAdd && <AddProject showAdd={showAdd} setShowAdd={() => setShowAdd(!showAdd)} />} */}
      {/* Modal Edit */}
      {/* {showEdit && <EditProject dataUser={dataUser} showEdit={showEdit} setShowEdit={() => setShowEdit(!showEdit)} />} */}
      {/* Modal Delete */}
      {/* {modalDelete && <ModalDelete data="Category Users" idData={dataUser?.id} modalDelete={modalDelete} setModalDelete={() => setModalDelete(!modalDelete)} deleteFunction={handleDeleteCategory} />} */}
    </>
  );
};

export default Users;
