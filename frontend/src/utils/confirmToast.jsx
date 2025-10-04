import { toast } from "react-toastify";

export const confirmToast = (message, onConfirm) => {
    toast(
        ({ closeToast }) => (
            <div className="flex flex-col gap-2">
                <p>{message}</p>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            onConfirm(); // run delete
                            closeToast(); // close confirm
                            // show success toast separately
                            toast.info("Item removed from your cart.", { autoClose: 3000 });
                        }}
                        className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                        Yes
                    </button>
                    <button onClick={closeToast} className="px-2 py-1 bg-gray-300 rounded">
                        No
                    </button>
                </div>
            </div>
        ),
        { autoClose: false }
    );
};
