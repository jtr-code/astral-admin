import { useSnackbar } from "notistack";

export const useNotification = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showAlert = (
    variant: "default" | "error" | "success" | "warning" | "info",
    message: string
  ) => {
    enqueueSnackbar(message, {
      variant,
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
      autoHideDuration: 1000,
    });
  };

  return { showAlert };
};
