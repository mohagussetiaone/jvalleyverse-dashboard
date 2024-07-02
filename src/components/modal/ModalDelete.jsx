import { Dialog, DialogPanel } from "@headlessui/react";

const ModalDelete = ({ modalDelete, setModalDelete, data, deleteFunction }) => {
  return (
    <>
      <Dialog open={modalDelete} onClose={() => setModalDelete(false)} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center">
          <DialogPanel className="w-full max-w-lg border bg-white dark:bg-black-500 p-6 rounded-lg">
            <div className="flex flex-col items-center">
              <p className="text-base">Apakah kamu yakin akan menghapus {data}? </p>
              <p className="text-sm mt-1">Data tidak dapat dipulihkan kembali</p>
            </div>
            <div className="flex justify-center gap-8 mx-auto mt-8">
              <button className="btn btn-error text-neutral-200" onClick={setModalDelete}>
                Batalkan
              </button>
              <button className="btn btn-primary text-neutral-200" onClick={deleteFunction}>
                Hapus
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default ModalDelete;
