// src/boot/keyboard-shortcuts.js
export default ({ app }) => {
  // window.addEventListener("keydown", (event) => {
  //   // Check for the 'Alt' key (event.altKey) and the 'L' key (event.key === 'l' or event.keyCode === 76)
  //   if (event.altKey && event.key === "n") {
  //     window.alert(event.ctrlKey && event.key === "n");
  //     event.preventDefault(); // Prevent default browser behavior (e.g., focusing the address bar)
  //     // Call your specific Quasar function here
  //     // Example: trigger a global store action or open a dialog
  //   }
  // });
  // window.addEventListener("keydown", (event) => {
  //   // Check for Ctrl+N (Windows/Linux) or Cmd+N (Mac)
  //   if ((event.ctrlKey || event.metaKey) && event.key === "l") {
  //     window.alert((event.ctrlKey || event.metaKey) && event.key === "l");
  //     event.preventDefault(); // Prevent the default browser action
  //     // Add your custom logic here if needed
  //     console.log("Ctrl+N was pressed, default action prevented.");
  //   }
  //   // You can add more shortcuts here
  //   // Example: Ctrl+T for new tab
  //   if ((event.ctrlKey || event.metaKey) && event.key === "t") {
  //     event.preventDefault();
  //     console.log("Ctrl+T was pressed, default action prevented.");
  //   }
  // });
};
