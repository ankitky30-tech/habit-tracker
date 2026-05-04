let habits = JSON.parse(localStorage.getItem("habits")) || [];

/* SAVE */
function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

/* DATES */
function getToday() {
  return new Date().toDateString();
}

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toDateString();
}

/* WEEK */
function getWeekDays() {
  const days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    days.push(d.toDateString());
  }

  return days;
}

/* SCREEN NAVIGATION */
function showScreen(screen) {
  document.getElementById("homeScreen").classList.add("hidden");
  document.getElementById("statsScreen").classList.add("hidden");
  document.getElementById("settingsScreen").classList.add("hidden");

  document.getElementById(screen + "Screen").classList.remove("hidden");
}

/* RENDER */
function renderHabits() {
  const list = document.getElementById("habitList");
  const progressText = document.getElementById("progressText");
  const progressFill = document.getElementById("progressFill");

  list.innerHTML = "";

  const today = getToday();
  const yesterday = getYesterday();
  const weekDays = getWeekDays();

  let completedCount = 0;

  habits.forEach((habit, index) => {
    if (!habit.history) habit.history = {};

    if (
      habit.lastCompleted &&
      habit.lastCompleted !== today &&
      habit.lastCompleted !== yesterday
    ) {
      habit.streak = 0;
    }

    if (habit.lastCompleted !== today) {
      habit.completed = false;
    }

    if (habit.completed) completedCount++;

    const li = document.createElement("li");

    const weekUI = weekDays
      .map(day => (habit.history[day] ? "✔" : "✖"))
      .join(" ");

    li.innerHTML = `
      <div style="flex:1">
        <div class="habit-name">${habit.name}</div>
        <div class="week">${weekUI}</div>
      </div>
      <span class="streak">🔥 ${habit.streak}</span>
    `;

    if (habit.completed) li.classList.add("completed");

    li.onclick = () => toggleHabit(index);

    const del = document.createElement("button");
    del.textContent = "✕";
    del.classList.add("delete");

    del.onclick = (e) => {
      e.stopPropagation();
      habits.splice(index, 1);
      saveHabits();
      renderHabits();
    };

    li.appendChild(del);
    list.appendChild(li);
  });

  const total = habits.length;
  progressText.textContent = `${completedCount} / ${total} completed`;

  const percent = total === 0 ? 0 : (completedCount / total) * 100;
  progressFill.style.width = percent + "%";

  saveHabits();
}

/* ADD */
function addHabit() {
  const input = document.getElementById("habitInput");
  const name = input.value.trim();

  if (!name) return;

  habits.push({
    name,
    completed: false,
    streak: 0,
    lastCompleted: null,
    history: {}
  });

  input.value = "";
  saveHabits();
  renderHabits();
}

/* TOGGLE */
function toggleHabit(index) {
  const habit = habits[index];
  const today = getToday();
  const yesterday = getYesterday();

  if (habit.completed) return;

  habit.completed = true;

  if (habit.lastCompleted === yesterday) {
    habit.streak += 1;
  } else {
    habit.streak = 1;
  }

  habit.lastCompleted = today;
  habit.history[today] = true;

  saveHabits();
  renderHabits();
}

/* INIT */
renderHabits();