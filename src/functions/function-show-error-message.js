import { Dialog, Loading } from "quasar";

export default function showErrorMessage(errorMessage) {
  Loading.hide();
  Dialog.create({
    title: "Error",
    message: errorMessage
  });
}
