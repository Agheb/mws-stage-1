import "../css/snackbar.scss";
import { MDCSnackbar, MDCSnackbarFoundation } from "@material/snackbar";

export const showNotification = text => {
  let snackbar = document.querySelector(".snackbar-container");
  snackbar.innerHTML = `
<div class="mdc-snackbar mdc-snackbar--align-start"
aria-live="assertive"
aria-atomic="true"
aria-hidden="true">
<div class="mdc-snackbar__text"></div>
<div class="mdc-snackbar__action-wrapper">
<button type="button" class="mdc-snackbar__action-button"></button>
</div>
</div>`;

  const snackbarJS = new MDCSnackbar(document.querySelector(".mdc-snackbar"));
  const dataObj = {
    message: text,
    timeout: 5000,
    actionText: "Reload",
    actionHandler: () => {
      window.location.reload();
    }
  };

  snackbarJS.show(dataObj);
};
