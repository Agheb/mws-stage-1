import "../css/dialog.scss";
import { MDCTextField } from "@material/textfield";
import { MDCSelect } from "@material/select";
import { MDCDialog, MDCDialogFoundation, util } from "@material/dialog";

export default {
  handleImport: event => {
    let dialogHTML = document.querySelector(".dialog-container");
    dialogHTML.innerHTML = `
    <aside id="my-mdc-dialog" class="mdc-dialog" role="alertdialog" aria-labelledby="my-mdc-dialog-label" aria-describedby="my-mdc-dialog-description">
    <div class="mdc-dialog__surface">
      <header class="mdc-dialog__header">
        <h2 id="my-mdc-dialog-label" class="mdc-dialog__header__title">
          Add Review
        </h2>
      </header>
      <section class="mdc-dialog__body">

        <div class="text-field-container">
          <div class="mdc-text-field text-field-name  mdc-text-field--outlined">
            <input type="text" id="text-field--outlined" class="mdc-text-field__input">
            <label class="mdc-floating-label" for="text-field--outlined">Name</label>
            <div class="mdc-notched-outline">
              <svg>
                <path class="mdc-notched-outline__path" />
              </svg>
            </div>
            <div class="mdc-notched-outline__idle"></div>
          </div>
          <div class="mdc-select">
            <select class="mdc-select__native-control">
            <option value="5" selected> 5 Stars (exceptional)</option>
            <option value="4"> 4 Stars (good)</option>
            <option value="3"> 3 Stars (acceptable) </option>
            <option value="2"> 2 Stars (bad) </option>
            <option value="3"> 1 Stars (avoid) </option>
            </select>
            <label class="mdc-floating-label mdc-floating-label--float-above">Rating</label>
            <div class="mdc-line-ripple"></div>
          </div>
        </div>
        <div class="mdc-text-field text-field-review mdc-text-field--textarea">
          <textarea id="textarea" class="mdc-text-field__input" rows="4" cols="100"></textarea>
          <label for="textarea" class="mdc-floating-label">Review</label>
        </div>

      </section>
      <footer class="mdc-dialog__footer">
        <button type="button" class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--cancel">Decline</button>
        <button type="button" class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--accept">Accept</button>
      </footer>
    </div>
    <div class="mdc-dialog__backdrop"></div>
  </aside>`;

    const namefield = new MDCTextField(
      document.querySelector(".text-field-name")
    );
    const reviewtext = new MDCTextField(
      document.querySelector(".text-field-review")
    );
    const select = new MDCSelect(document.querySelector(".mdc-select"));
    const dialog = new MDCDialog(document.querySelector("#my-mdc-dialog"));
    dialog.lastFocusedTarget = event.target;
    dialog.show();
  }
};
