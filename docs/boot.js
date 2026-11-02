import("./app.js?v=9").catch((error) => {
  const app = document.querySelector("#app");
  app.textContent = "";
  const message = document.createElement("p");
  message.className = "loading";
  message.textContent = "SIDE QUEST couldn’t open: " + error.message;
  const button = document.createElement("button");
  button.className = "btn primary";
  button.textContent = "Try again";
  button.addEventListener("click", () => location.reload());
  app.append(message, button);
});
