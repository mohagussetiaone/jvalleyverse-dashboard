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
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import ModalDelete from "@/components/modal/ModalDelete";
import ErrorPage from "@/components/error/ErrorPage";

const CategoryProject = () => {
  const queryClient = useQueryClient();
  const [globalFilter, setGlobalFilter] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [dataCategory, setDataCategory] = useState({});

  const handleEdit = (data) => {
    setDataCategory(data);
    setShowEdit(!showEdit);
  };

  const handleDelete = (data) => {
    setDataCategory(data);
    setModalDelete(!modalDelete);
  };

  const columns = useMemo(
    () => [
      {
        id: "category_name",
        header: () => <p className="text-sm font-bold text-gray-800 dark:text-neutral-300">Nama Kategori</p>,
        accessorKey: "category_name",
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
                <MenuItems className="absolute right-[25%] mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg focus:outline-none dark:bg-boxDark z-20">
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
    error: errorCategoryProject,
    isPending: isPendingCategory,
    data: dataCategoryProject,
  } = useQuery({
    queryKey: ["getCategoryProject"],
    queryFn: async () => {
      const { data: products } = await supabase.schema("belajar").from("category_project").select(`
        id,
        category_name,
        created_at
        `);
      return products;
    },
  });

  // Delete Category Project
  const handleDeleteCategory = () => {
    // Menampilkan toast ketika request sedang diproses
    const requestPromise = supabase.schema("belajar").from("category_project").delete().eq("id", dataCategory.id);
    toast.promise(
      requestPromise,
      {
        loading: "Delete data process...",
        success: (response) => {
          if (response.status === 204) {
            setModalDelete(false);
            queryClient.invalidateQueries({
              queryKey: ["getCategoryProject"],
            });
          }
          return "Delete Category Project Successfully";
        },
        error: (error) => {
          return error.message || "Terjadi kesalahan saat memproses data";
        },
      },
      {
        success: {
          duration: 1500,
        },
        error: {
          duration: 2000,
        },
      }
    );
  };

  if (isPendingCategory) {
    return <Loading />;
  }

  if (errorCategoryProject) {
    return <ErrorPage />;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <Search globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} tableName="Project" />
          <CreateAndExport setShowAdd={setShowAdd} datas={dataCategoryProject || []} TableName="Project" />
        </div>
        <TableContainer
          datas={dataCategoryProject || []}
          columns={columns}
          tableName="Configuration Port"
          globalFilter={globalFilter}
          title="Configuration Port"
          setGlobalFilter={setGlobalFilter}
          setModalAdd={() => setModalAdd(!modalAdd)}
        />
      </div>
      {/* Modal Add */}
      {showAdd && <AddCategory showAdd={showAdd} setShowAdd={() => setShowAdd(!showAdd)} />}
      {/* Modal Edit */}
      {showEdit && <EditCategory dataCategory={dataCategory} showEdit={showEdit} setShowEdit={() => setShowEdit(!showEdit)} />}
      {/* Modal Delete */}
      {modalDelete && <ModalDelete data="Category Project" idData={dataCategory?.id} modalDelete={modalDelete} setModalDelete={() => setModalDelete(!modalDelete)} deleteFunction={handleDeleteCategory} />}
    </>
  );
};

export default CategoryProject;
