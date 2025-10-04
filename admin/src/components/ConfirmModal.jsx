import React from "react";

const ConfirmModal = ({ title, message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm animate-fadeIn">
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                <p className="text-gray-600 text-sm mt-2">{message}</p>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition text-sm font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition text-sm font-medium"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
