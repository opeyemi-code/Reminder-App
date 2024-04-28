import {
  reminders,
  displayReminder,
  reminderContainer,
  editBtns,
  removeReminderBtns,
} from "./index.js";

const customContainer = document.querySelector(".custom-container");
let editTitle, editDescription, editDate, editTime, editInputFields;
let saveEditButton;
let closeEditButton;

let displayEditModal = false;

function editReminder(e) {
  const parentElementId = parseInt(
    e.currentTarget.parentElement.parentElement.id
  );
  const currentReminderIndex = reminders.findIndex(
    (reminder) => reminder.id === parentElementId
  );

  if (!displayEditModal) {
    editModal(currentReminderIndex);
  }

  editBtns.forEach((btn) => {
    btn.setAttribute("disabled", displayEditModal);
  });
  removeReminderBtns.forEach((removeReminderBtn) => {
    removeReminderBtn.setAttribute("disabled", displayEditModal);
  });

  addValueToEditableInput(currentReminderIndex);
  //   SaveEdit(currentReminderIndex)
}

function editModal(currentReminderIndex) {
  const editCard = document.createElement("div");
  editCard.className = `edit-card position-absolute top-50 start-50 translate-middle`;

  editCard.innerHTML = `
      <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header d-flex justify-content-between px-3">
          <h5 class="modal-title">Edit Reminder</h5>
          <button type="button" class="btn-close close-edit-btn" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label for="edit-title" class="form-label">Title</label>
              <input type="text" class="form-control edit-input-fields" id="edit-title" value="" maxLength='12'>
              <small></small>
            </div>
            <div class="mb-3">
              <label for="edit-description" class="form-label">Description</label>
              <input type="text" class="form-control edit-input-fields" id="edit-description">
              <small></small>
            </div>
            <div class="row">
              <div class="col">
                <label for="edit-date" class="form-label">Date</label>
                <input type="date" class="form-control edit-input-fields" id="edit-date">
                <small></small>
              </div>
              <div class="col mt-3">
                <label for="edit-time" class="form-label">Time</label>
                <input type="time" class="form-control edit-input-fields" id="edit-time">
                <small></small>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer pb-3 pe-3">
          <button id="save-edit-btn" class="btn btn-success" type="button">Save</button>
        </div>
      </div>
    </div>`;
  customContainer.appendChild(editCard);

  editTitle = document.getElementById("edit-title");
  editDescription = document.getElementById("edit-description");
  editDate = document.getElementById("edit-date");
  editTime = document.getElementById("edit-time");
  editInputFields = document.getElementsByClassName("edit-input-fields");

  saveEditButton = document.getElementById("save-edit-btn");
  closeEditButton = document.querySelector(".close-edit-btn");

  saveEditButton.addEventListener("click", () =>
    SaveEdit(currentReminderIndex)
  );

  closeEditButton.addEventListener("click", () =>
    closeEditModal(closeEditButton)
  );
}

export { editReminder };

function addValueToEditableInput(currentReminderIndex) {
  editTitle.value = reminders[currentReminderIndex].title;
  editDescription.value = reminders[currentReminderIndex].description;
  editDate.value = reminders[currentReminderIndex].date;
  editTime.value = reminders[currentReminderIndex].time;
}

function SaveEdit(currentReminderIndex) {
  const newArr = Array.from(editInputFields).every(
    (editInputField) => editInputField.value.length > 0
  );

  if (
    newArr &&
    editTitle.value.length <= 12 &&
    editDescription.value.length <= 32
  ) {
    reminders[currentReminderIndex] = {
      id: currentReminderIndex,
      title: editTitle.value,
      description: editDescription.value,
      date: editDate.value,
      time: editTime.value,
    };
    localStorage.setItem("value", JSON.stringify(reminders));

    reminderContainer.innerHTML = "";
    reminders.forEach((reminder) => {
      displayReminder(reminder);
    });

    saveEditButton.parentElement.parentElement.remove();
    editBtns.forEach((btn) => {
      btn.removeAttribute("disabled");
    });
    removeReminderBtns.forEach((removeReminderBtn) => {
      removeReminderBtn.removeAttribute("disabled");
    });
  } else {
    Array.from(editInputFields).forEach((editInputField) => {
      if (editInputField.value.trim() === "") {
        editInputField.setAttribute(
          "style",
          "border: 1px solid red !important"
        );
      } else {
        editInputField.style = "border: 1px solid blue !important";
      }
    });

    if (editTitle.value.length > 12) {
      editTitle.setAttribute("style", "border: 1px solid red !important");
    }

    if (editDescription.value.length > 32) {
      editDescription.setAttribute("style", "border: 1px solid red !important");
    }
  }

  // e.preventDefault();
}

function closeEditModal(closeEditButton) {
  // e.preventDeFault();
  const editCardModal = document.querySelector(".edit-card");
  editCardModal.remove();
  editBtns.forEach((btn) => {
    btn.removeAttribute("disabled");
  });
}
