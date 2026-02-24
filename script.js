const allInitiatives = [
    { title: "Еко-толока: Парк Перемоги", status: "active", date: "20.03.2026", volunteers: 30, id: "count-0", description: "Разом прибираємо та озеленюємо парк Перемоги. Принеси рукавиці та гарний настрій — решту підготуємо ми!" },
    { title: "Допомога притулку 'Сіріус'", status: "active", date: "25.03.2026", volunteers: 10, id: "count-1", description: "Допомагаємо найбільшому притулку для тварин: годуємо, вигулюємо та спілкуємося з пухнастими мешканцями." },
    { title: "IT-курси для літніх людей", status: "active", date: "Квітень 2026", volunteers: 5, id: "count-2", description: "Навчаємо людей старшого віку користуватися смартфонами, інтернетом та держпослугами онлайн." },
    { title: "Збір теплого одягу", status: "completed", date: "10.02.2026", volunteers: 0, id: "count-3", description: "Зібрали та передали понад 200 одиниць теплого одягу для переселенців і малозабезпечених родин." }
];

function getJoinedIds() {
    return JSON.parse(localStorage.getItem('joinedIds')) || [];
}

function getVolunteersCount() {
    return JSON.parse(localStorage.getItem('volunteersCount')) || {};
}

function applyCardStyles() {
    const cards = document.querySelectorAll('.card');
    for (let i = 0; i < cards.length; i++) {
        if (i % 2 === 0) {
            cards[i].style.borderLeft = '3px solid var(--accent)';
        } else {
            cards[i].style.borderLeft = '3px solid var(--accent-light)';
        }
    }
}

function addNavHoverEffects() {
    const navLinks = document.querySelectorAll('nav ul li a');
    for (let i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener('mouseover', function () {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-2px)';
            }
        });
        navLinks[i].addEventListener('mouseout', function () {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0)';
            }
        });
    }
}

function initToggleSection() {
    const toggleBtn = document.getElementById('toggle-about-btn');
    const aboutSection = document.getElementById('about');
    if (!toggleBtn || !aboutSection) return;

    toggleBtn.addEventListener('click', function () {
        if (aboutSection.style.display === 'none') {
            aboutSection.style.display = 'block';
            toggleBtn.textContent = 'Приховати інформацію ▲';
        } else {
            aboutSection.style.display = 'none';
            toggleBtn.textContent = 'Показати інформацію ▼';
        }
    });
}

function initFormValidation() {
    const form = document.querySelector('.initiative-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const title = document.getElementById('title').value.trim();
        const date = document.getElementById('date').value.trim();
        const location = document.getElementById('location').value.trim();
        const description = document.getElementById('description').value.trim();

        const fields = [
            { value: title, name: 'Назва ініціативи' },
            { value: date, name: 'Дата проведення' },
            { value: location, name: 'Місце проведення' },
            { value: description, name: 'Опис ініціативи' }
        ];

        let errorMessage = '';

        for (let i = 0; i < fields.length; i++) {
            if (fields[i].value === '') {
                errorMessage = 'Будь ласка, заповніть поле: "' + fields[i].name + '"';
                break;
            }
        }

        if (!errorMessage && date) {
            const parts = date.split('-');
            const selectedDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                errorMessage = 'Дата проведення не може бути в минулому. Оберіть майбутню дату.';
            }
        }

        if (!errorMessage && description.length > 300) {
            errorMessage = 'Опис занадто довгий (' + description.length + '/300 символів). Скоротіть текст.';
        }

        const resultBox = document.getElementById('form-result');

        if (errorMessage) {
            resultBox.innerHTML = `<div class="form-error">⚠️ ${errorMessage}</div>`;
        } else {
            resultBox.innerHTML = `
                <div class="form-success">
                    <h3>✅ Ініціативу надіслано!</h3>
                    <p><strong>Назва:</strong> ${title}</p>
                    <p><strong>Дата:</strong> ${date}</p>
                    <p><strong>Місце:</strong> ${location}</p>
                    <p><strong>Опис:</strong> ${description}</p>
                </div>
            `;
            form.reset();
        }
    });
}

function filterProjects(status) {
    const btnActive = document.getElementById('btn-active');
    const btnCompleted = document.getElementById('btn-completed');
    if (btnActive && btnCompleted) {
        btnActive.classList.toggle('filter-btn--active', status === 'active');
        btnCompleted.classList.toggle('filter-btn--active', status === 'completed');
    }

    const container = document.getElementById('projects-container');
    if (!container) return;
    container.innerHTML = '';

    const joinedIds = getJoinedIds();
    const volunteersCount = getVolunteersCount();

    let i = 0;
    while (i < allInitiatives.length) {
        let item = allInitiatives[i];

        if (item.status === status) {
            const isJoined = joinedIds.includes(item.id);
            const displayCount = volunteersCount[item.id] !== undefined
                ? volunteersCount[item.id]
                : item.volunteers;

            let buttonHtml;
            if (status !== 'active') {
                buttonHtml = `<button class="join-btn" disabled style="background: #ccc;">Завершено</button>`;
            } else if (isJoined) {
                buttonHtml = `<button class="join-btn" disabled style="background: #816d90;">Ви приєдналися</button>`;
            } else {
                buttonHtml = `<button class="join-btn" onclick="window.location.href='form-registr.html?id=${item.id}';">Приєднатися</button>`;
            }

            let card = document.createElement('article');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-content">
                    <h3>${item.title}</h3>
                    <p>📅 Дата: ${item.date}</p>
                    <p>👥 Потрібно волонтерів: <span id="${item.id}">${displayCount}</span></p>
                    <p class="card-description">${item.description}</p>
                </div>
                ${buttonHtml}
            `;
            container.appendChild(card);
        }

        i++;
    }

    
    applyCardStyles();

    
    const cards = document.querySelectorAll('.card');
    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener('mouseover', function () {
            this.style.boxShadow = '0 12px 32px rgba(108, 63, 197, 0.25)';
        });
        cards[i].addEventListener('mouseout', function () {
            this.style.boxShadow = '';
        });
    }
}

function joinWithCounter(button, initiativeId) {
    const initiative = allInitiatives.find(item => item.id === initiativeId);
    if (!initiative) return;

    const volunteersCount = getVolunteersCount();
    const currentCount = volunteersCount[initiativeId] !== undefined
        ? volunteersCount[initiativeId]
        : initiative.volunteers;

    const newCount = Math.max(0, currentCount - 1);

    volunteersCount[initiativeId] = newCount;
    localStorage.setItem('volunteersCount', JSON.stringify(volunteersCount));

    const joinedIds = getJoinedIds();
    if (!joinedIds.includes(initiativeId)) {
        joinedIds.push(initiativeId);
        localStorage.setItem('joinedIds', JSON.stringify(joinedIds));
    }

    const title = initiative.title;
    const MyProject = JSON.parse(localStorage.getItem('MyProject')) || [];
    if (!MyProject.includes(title)) {
        MyProject.push(title);
        localStorage.setItem('MyProject', JSON.stringify(MyProject));
    }

    const counterElement = document.getElementById(initiativeId);
    if (counterElement) counterElement.textContent = newCount;

    button.textContent = "Ви приєдналися";
    button.disabled = true;
    button.style.backgroundColor = "#8f5bab";
}

function displayMyInitiatives() {
    const container = document.getElementById('myList');
    if (!container) return;

    const MyProject = JSON.parse(localStorage.getItem('MyProject')) || [];
    container.innerHTML = '';

    if (MyProject.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Ви ще не приєдналися до жодної ініціативи.</p>
            </div>
        `;
        return;
    }

    let i = 0;
    while (i < MyProject.length) {
        const projectTitle = MyProject[i];
        const initiative = allInitiatives.find(item => item.title === projectTitle);

        const card = document.createElement('article');
        card.className = 'card';

        const volunteersCount = getVolunteersCount();
        const displayCount = initiative
            ? (volunteersCount[initiative.id] !== undefined ? volunteersCount[initiative.id] : initiative.volunteers)
            : '—';
        const displayDate = initiative ? initiative.date : '—';

        const currentIndex = i;

        card.innerHTML = `
            <div class="card-content">
                <h3>${projectTitle}</h3>
                <p>📅 Дата: ${displayDate}</p>
                <p>👥 Залишилось місць: ${displayCount}</p>
                <span class="joined-badge">✅ Ви учасник</span>
            </div>
        `;

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'cancel-btn';
        cancelBtn.textContent = 'Скасувати участь';
        cancelBtn.onclick = () => removeFromList(currentIndex);

        card.appendChild(cancelBtn);
        container.appendChild(card);
        i++;
    }

    
    applyCardStyles();
}

function removeFromList(index) {
    const MyProject = JSON.parse(localStorage.getItem('MyProject')) || [];
    const removedTitle = MyProject[index];
    MyProject.splice(index, 1);
    localStorage.setItem('MyProject', JSON.stringify(MyProject));

    const initiative = allInitiatives.find(item => item.title === removedTitle);
    if (initiative) {
        let joinedIds = getJoinedIds();
        joinedIds = joinedIds.filter(id => id !== initiative.id);
        localStorage.setItem('joinedIds', JSON.stringify(joinedIds));

        const volunteersCount = getVolunteersCount();
        volunteersCount[initiative.id] = (volunteersCount[initiative.id] !== undefined)
            ? volunteersCount[initiative.id] + 1
            : initiative.volunteers;
        localStorage.setItem('volunteersCount', JSON.stringify(volunteersCount));
    }

    displayMyInitiatives();
}

window.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('projects-container')) {
        filterProjects('active');
    }
    if (document.getElementById('myList')) {
        displayMyInitiatives();
    }

    
    addNavHoverEffects();

    
    initToggleSection();

    
    initFormValidation();

    
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    
    const descriptionInput = document.getElementById('description');
    if (descriptionInput) {
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.textContent = '0 / 300';
        descriptionInput.parentNode.appendChild(counter);

        descriptionInput.addEventListener('input', function () {
            const len = this.value.length;
            counter.textContent = `${len} / 300`;
            if (len > 300) {
                counter.classList.add('char-counter--over');
            } else {
                counter.classList.remove('char-counter--over');
            }
        });
    }
});
