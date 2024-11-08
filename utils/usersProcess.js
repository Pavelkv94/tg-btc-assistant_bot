const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "../json_db/users_data.json");

function loadUserIds() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    const json = JSON.parse(data);
    return json.users || [];
  } catch (err) {
    console.error("Ошибка при загрузке пользователей:", err);
    return [];
  }
}

function saveUserId(userId) {
  const userIds = loadUserIds();
  if (!userIds.includes(userId)) {
    userIds.push(userId);
    fs.writeFileSync(dataFilePath, JSON.stringify({ users: userIds }, null, 2));
  }
}

module.exports = {
  saveUserId,
  loadUserIds,
};
