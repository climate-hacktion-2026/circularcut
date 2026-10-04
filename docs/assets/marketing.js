document.querySelectorAll(".about-feedback-form").forEach((form) => {
  form.querySelectorAll(".role-toggle, .rating-row").forEach((group) => {
    group.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        group.querySelectorAll("button").forEach((choice) => choice.setAttribute("aria-pressed", String(choice === button)));
      });
    });
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.innerHTML = '<div class="about-feedback-preview"><div class="stamp stamp--ok"><b>Thanks!</b></div><h3>Preview only</h3><p>This form is not connected. Your response was not sent or stored.</p><button class="about-text-button" type="button">Try again</button></div>';
    form.querySelector("button").addEventListener("click", () => window.location.reload());
  });
});
