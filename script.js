// Получаем элементы формы и контейнеры по data-атрибутам
const form = document.querySelector("[data-search-form]");
const input = document.querySelector("[data-search-input]");
const userInfoContainer = document.querySelector("[data-user-info-container]");
const reposContainer = document.querySelector("[data-repos-container]");

// Обработчик отправки формы поиска пользователя
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Предотвращаем стандартное поведение формы

  const username = input.value.trim(); // Получаем имя пользователя из поля ввода

  // Проверяем, что поле не пустое
  if (!username) {
    alert("Пожалуйста, введите имя пользователя GitHub");
    return;
  }

  // Показываем индикатор загрузки и очищаем контейнер репозиториев
  userInfoContainer.innerHTML = "<p>Загрузка...</p>";
  reposContainer.innerHTML = "";

  try {
    // Запрашиваем данные пользователя с помощью fetch
    const userResponse = await fetch(
      `https://api.github.com/users/${username}`
    );
    if (!userResponse.ok) throw new Error("Пользователь не найден");

    const userData = await userResponse.json();

    // Отображаем основную информацию о пользователе
    userInfoContainer.innerHTML = `
      <div>
        <img src="${userData.avatar_url}" alt="${userData.login}">
        <h2>${userData.name || userData.login}</h2>
        <p>${userData.bio || "Биография отсутствует"}</p>
      </div>
    `;

    // Запрашиваем список репозиториев пользователя
    const reposResponse = await fetch(userData.repos_url);
    if (!reposResponse.ok) throw new Error("Не удалось получить репозитории");

    const repos = await reposResponse.json();

    // Проверяем, есть ли репозитории, и отображаем их
    if (repos.length) {
      reposContainer.innerHTML = "<h3>Репозитории:</h3>";
      repos.forEach((repo) => {
        reposContainer.innerHTML += `
          <div class="repo">
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
          </div>
        `;
      });
    } else {
      reposContainer.innerHTML = "<p>Репозитории не найдены</p>";
    }
  } catch (error) {
    // В случае ошибки выводим сообщение
    userInfoContainer.innerHTML = `<p>${error.message}</p>`;
    reposContainer.innerHTML = "";
  }
});
