import { reminders, editBtns, removeReminderBtns, btn } from "./index.js";
const reminder_cards = document.getElementsByClassName("reminder-card");

const body = document.querySelector(".custom-container");

const audio = new Audio("./alarm-clock-short-6402.mp3");
audio.volume = 1.0;
let modalDisplayed = false;

function displayModal(dueReminders) {
  const card = document.createElement("div");
  card.className = "modal-card";
  card.id = "modal";
  card.innerHTML = `
      <div class='modal-content'>
      <div class='d-flex justify-content-between align-items-center my-2 px-2 border-bottom pb-1'>
      <h2 class='card-title text-success'>Reminder</h2>
      <button class='close close-modal btn btn-dark ms-5' type='button'>X</button>
      </div>
      <p class='card-body'>${
        dueReminders.length > 1 ? "Reminders" : "Reminder"
      } due: ${dueReminders.join(", ")}</p>
      <hr>
      <button class='close-modal btn btn-danger float-end mb-3 mx-2' type='button'>close</button>
      </div>`;

  body.appendChild(card);
  btn.setAttribute("disabled", !modalDisplayed);
  editBtns.forEach((btn) => {
    btn.setAttribute("disabled", !modalDisplayed);
  });
  removeReminderBtns.forEach((removeReminderBtn) => {
    removeReminderBtn.setAttribute("disabled", !modalDisplayed);
  });

  const closeModalBtns = document.querySelectorAll(".close-modal");

  closeModalBtns.forEach((closeModalBtn) =>
    closeModalBtn.addEventListener("click", closeModal)
  );
}

function closeModal(e) {
  const modal = document.getElementById("modal");
  modal.remove();
  audio.pause();
  audio.currentTime = 0;
  btn.removeAttribute("disabled");
  editBtns.forEach((btn) => {
    btn.removeAttribute("disabled");
  });
  removeReminderBtns.forEach((removeReminderBtn) => {
    removeReminderBtn.removeAttribute("disabled");
  });
  e.preventDefault();
}

const checkTimeElapsed = () => {
  setInterval(() => {
    const now = new Date();
    let dueReminders = [];

    Array.from(reminder_cards).forEach((reminder_card) => {
      const [year, month, date] = reminder_card
        .querySelector(".date")
        .innerText.split("-");
      const [hours, minutes] = reminder_card
        .querySelector(".time")
        .innerText.split(":");

      const reminderTime = new Date(
        Number(year),
        Number(month) - 1,
        Number(date),
        Number(hours),
        Number(minutes)
      );

      const timeDifference = reminderTime.getTime() - now.getTime();

      if (timeDifference <= 0 && timeDifference > -60000) {
        dueReminders.push(reminder_card.querySelector(".card-title").innerText);
        setTimeout(() => {
          removeDueReminder(reminder_card);
        }, 30000);
      }
    });

    if (dueReminders.length > 0) {
      displayModal(dueReminders);
      if (audio.paused) {
        try {
          audio.play();
        } catch (error) {
          console.error("Failed to play audio:", error);
        }
      }
    }
  }, 60000);
};

function removeDueReminder(reminder_card) {
  reminder_card.remove();

  const cardId = parseInt(reminder_card.id);

  const index = reminders.findIndex((reminder) => reminder.id === cardId);

  if (index !== -1) {
    reminders.splice(index, 1);
    localStorage.setItem("value", JSON.stringify(reminders));
  }
}

export { checkTimeElapsed };
