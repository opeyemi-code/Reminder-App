import { checkTimeElapsed } from "./timeElapse.js";
import { removeReminder } from "./removeReminderBtn.js";
import { editReminder } from "./editReminder.js";

const titleField = document.getElementById("title-field");
const descriptionField = document.getElementById("description-field");
const dateField = document.getElementById("date-field");
const timeField = document.getElementById("time-field");
export const reminderContainer = document.querySelector(
  ".reminder-container .row"
);
let editBtns, removeReminderBtns;
const btn = document.getElementById("btn");

btn.addEventListener("click", setReminder);

export const reminders = JSON.parse(localStorage.getItem("value")) || [];

function setMinimumDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month =
    String(now.getMonth() + 1).length === 1
      ? `0${now.getMonth() + 1}`
      : now.getMonth();
  const date = now.getDate();
  console.log(month);
  dateField.min = `${year}-${month}-${date}`;
}

setMinimumDate();

function displayErrorMassage(inputField, message) {
  inputField.nextElementSibling.innerText = message;
  inputField.nextElementSibling.setAttribute("style", "visibility: visible");
  inputField.setAttribute("style", "border: 1px solid red !important");
}

function removeErrorMessage(inputField) {
  inputField.nextElementSibling.removeAttribute("style");
  inputField.nextElementSibling.setAttribute("style", "visibility: hidden");
  inputField.style = "border: 1px solid blue !important";
}

function createReminderElement(reminder) {
  const div = document.createElement("div");
  div.className = `card reminder-card mt-3`;

  div.id = reminder.id;
  div.innerHTML = `
      <div class='d-flex justify-content-between align-items-center'>
      <h2 class='card-title text-capitalize'>${reminder.title}</h2>
      <button class="edit-btn btn btn-primary" type="button">
      <img src="./Images/icons8-edit-48.png" alt="Edit" height="35" width="35" title="Edit">
      </button>
      </div>
      <hr>
      <p class='card-body'>${reminder.description}</p>
      <hr>
      <div class='d-flex justify-content-between align-items-center'>
      <h3 class='fs-6 date'>${reminder.date}</h3>
      <h3 class='fs-6 time'>${reminder.time}</h3>
      <button class='remove-reminder-btn' type='button'>X</button>
      </div>`;

  return div;
}

export function displayReminder(reminder) {
  const reminderElement = createReminderElement(reminder);
  reminderContainer.appendChild(reminderElement);

  addRemoveReminderEventListeners();

  addEditBtnsEventListeners();

  checkTimeElapsed();
}

reminders.forEach((reminder) => displayReminder(reminder));

function setReminder() {
  const inputFields = document.querySelectorAll("input");
  const newArr = Array.from(inputFields).every(
    (inputField) => inputField.value.length > 0
  );

  if (
    newArr &&
    titleField.value.length <= 12 &&
    descriptionField.value.length <= 32
  ) {
    const reminder = {
      id: reminders.length,
      title: titleField.value,
      description: descriptionField.value,
      date: dateField.value,
      time: timeField.value,
    };

    reminders.push(reminder);

    localStorage.setItem("value", JSON.stringify(reminders));

    displayReminder(reminder);

    // Clear all error messages
    inputFields.forEach((inputField) => {
      removeErrorMessage(inputField);
    });

    // reset all input fields
    inputFields.forEach((inputField) => {
      inputField.value = "";
    });
  } else {
    inputFields.forEach((inputField) => {
      if (inputField.value.trim() === "") {
        displayErrorMassage(inputField, "Input field cannot be empty");
      } else {
        removeErrorMessage(inputField);
      }
    });

    if (titleField.value.length > 12) {
      displayErrorMassage(
        titleField,
        "Title cannot be more than 12 characters"
      );
    }

    if (descriptionField.value.length > 32) {
      displayErrorMassage(
        descriptionField,
        "Description cannot be more than 32 characters"
      );
    }
  }
}

function addRemoveReminderEventListeners() {
  removeReminderBtns = document.querySelectorAll(".remove-reminder-btn");
  removeReminderBtns.forEach((removeReminderBtn) => {
    removeReminderBtn.addEventListener("click", removeReminder);
  });
}

function addEditBtnsEventListeners() {
  editBtns = document.querySelectorAll(".edit-btn");
  editBtns.forEach((editBtn) => {
    editBtn.addEventListener("click", editReminder);
  });
}

export { editBtns, removeReminderBtns, btn };
