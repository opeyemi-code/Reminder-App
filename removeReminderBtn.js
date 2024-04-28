import { reminders } from "./index.js";

function removeReminder(e) {
  const parentCardElement = e.currentTarget.closest(".reminder-card");

  parentCardElement.remove();

  const cardId = parseInt(parentCardElement.id);

  // Remove reminder from localStorage
  // Find the index of the reminder with the specified ID
  const index = reminders.findIndex((reminder) => reminder.id === cardId);

  if (index !== -1) {
    // Remove the reminder at the found index
    reminders.splice(index, 1);

    // Update the reminders variable with the modified array
    localStorage.setItem("value", JSON.stringify(reminders));
  }

  e.preventDefault();
}

export { removeReminder };
