import toast from "react-hot-toast";

export const showConfirmToast = (
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
) => {
  const id = toast.custom(
    () => (
      <div className="w-[90vw] max-w-sm rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-900 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-honey-gold/80 shadow-sm"></div>
          <div className="flex-1">
            <p className="font-medium">{message}</p>
            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  onCancel?.();
                  toast.dismiss(id);
                }}
                className="rounded-full border border-yellow-200 px-3 py-1.5 text-xs font-semibold text-yellow-800 hover:bg-yellow-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  toast.dismiss(id);
                }}
                className="rounded-full bg-honey-gold px-4 py-1.5 text-xs font-semibold text-white hover:bg-yellow-600"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    ),
    { duration: Infinity },
  );
};
