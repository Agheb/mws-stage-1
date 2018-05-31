import "../css/dialog.scss";
import { MDCSnackbar, MDCSnackbarFoundation } from "@material/snackbar";

export const showNotification = text => {
  let snackbar = document.querySelector(".snackbar-container");
  snackbar.innerHTML = `
<div class="mdc-snackbar mdc-snackbar--align-start"
aria-live="assertive"
aria-atomic="true"
aria-hidden="true">
<div class="mdc-snackbar__text">
Hello this a test
</div>
<div class="mdc-snackbar__action-wrapper">
<button type="button" class="mdc-snackbar__action-button"></button>
</div>
</div>`;

  const snackbarJS = new MDCSnackbar(document.querySelector(".mdc-snackbar"));
  const dataObj = {
    message: text,
    actionText: "Refresh",
    actionHandler: () => {
      window.location.reload();
    }
  };

  snackbarJS.show(dataObj);
};
