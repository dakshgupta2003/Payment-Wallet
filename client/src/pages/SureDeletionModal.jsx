import { Modal } from "antd";
import React, { useState } from "react";
import DeleteProfileModal from "./DeleteProfileModal";

const SureDeletionModal = ({ showDelete, setShowDelete }) => {
  const [sureDelete, setSureDelete] = useState(false);

  return (
    <>
      <Modal
        title="Are you sure ?"
        open={showDelete}
        onCancel={() => setShowDelete(false)}
        footer={null}
      >
        <h1 className="text-red-500 mb-2">
          Once you delete, your data will be lost and no longer be accessible.{" "}
        </h1>
        <div className="flex items-center justify-end gap-3">
          <button
            className="text-black py-[6.5px] px-5 rounded-[5px] bg-indigo-300 hover:bg-indigo-400"
            onClick={() => setShowDelete(false)}
          >
            Cancel
          </button>
          <button
            className="text-black py-[6.5px] px-5 rounded-[5px] bg-red-500 hover:bg-red-600"
            onClick={() =>{
                setSureDelete(true)
            }}
          >
            Yes, Delete
          </button>

          {sureDelete && (
            <DeleteProfileModal
              sureDelete={sureDelete}
              setSureDelete={setSureDelete}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default SureDeletionModal;
