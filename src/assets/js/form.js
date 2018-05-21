import "../css/form.scss";

export default {
  render: () => {
    let reviewform = document.createElement("div");
    reviewform.classList.add(
      "mdc-text-field",
      "mdc-text-field--textarea",
      "form"
    );
    reviewform.innerHTML = ` <textarea id="textarea" class="mdc-text-field__input" rows="4" cols="40"></textarea>
    <label for="textarea" class="mdc-floating-label">Textarea Label</label>`;

    return reviewform;
  }
};
