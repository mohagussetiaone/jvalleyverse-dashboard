import { Fragment, useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { IoMdClose } from "react-icons/io";

const Modal = ({ setShow, show, header, content, action, buttonName }) => {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setShow}>
        <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/25" />
        </TransitionChild>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <DialogPanel className="w-full max-w-xl max-h-screen transform overflow-hidden rounded-2xl bg-white dark:bg-black-800 p-4 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="div" className="flex justify-between">
                  <h3 className="text-base font-medium leading-6 text-gray-900">{header}</h3>
                  <div className="cursor-pointer" onClick={setShow}>
                    <IoMdClose className="w-6 h-6 " />
                  </div>
                </DialogTitle>
                <hr className="my-2" />
                {content}
                {action && (
                  <div className="flex gap-4 justify-end mt-4">
                    <button className="btn btn-error dark:bg-boxDark text-neutral-200 dark:text-gray-200 dark:border dark:border-gray-200 dark:hover:bg-boxDark" onClick={setShow}>
                      <span>Cancel</span>
                    </button>
                    <button className="btn btn-primary dark:bg-secondBoxDark dark:hover:bg-boxDark" onClick={action ? action : setShow}>
                      <span>{buttonName}</span>
                    </button>
                  </div>
                )}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
