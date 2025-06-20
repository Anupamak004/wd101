let userform = document.getElementById("user_form");

window.addEventListener("DOMContentLoaded", () => {
    const dobInput = document.getElementById("dob");
    const today = new Date();
    const minAge = 18;
    const maxAge = 55;

    const toDateString = (date) => {
        return date.toISOString().split("T")[0];
    };

    const maxDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
    const minDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());

    dobInput.max = toDateString(maxDate);
    dobInput.min = toDateString(minDate);

    displayEntries();
});

const getAge = (dob) => {
    const dobDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    const dayDiff = today.getDate() - dobDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
};

const retrieveEntries = () => {
    let entries = localStorage.getItem("user-entries");
    if (entries) {
        entries = JSON.parse(entries);
    } else {
        entries = [];
    }
    return entries;
};

const displayEntries = () => {
    const entries = retrieveEntries();

    const tableEntries = entries.map((entry) => {
        return `<tr>
            <td class="border px-4 py-2">${entry.name}</td>
            <td class="border px-4 py-2">${entry.email}</td>
            <td class="border px-4 py-2">${entry.password}</td>
            <td class="border px-4 py-2">${entry.dob}</td>
            <td class="border px-4 py-2">${entry.acceptTerms}</td>
        </tr>`;
    }).join("\n");

    const table = `
        <table class="table-auto w-full border border-collapse border-gray-300">
            <thead>
                <tr>
                    <th class="px-4 py-2 border">Name</th>
                    <th class="px-4 py-2 border">Email</th>
                    <th class="px-4 py-2 border">Password</th>
                    <th class="px-4 py-2 border">Dob</th>
                    <th class="px-4 py-2 border">Accepted terms?</th>
                </tr>
            </thead>
            <tbody>
                ${tableEntries}
            </tbody>
        </table>`;

    document.getElementById("user-entries").innerHTML = table;
};

const saveUserForm = (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const dob = document.getElementById("dob").value;
    const acceptTerms = document.getElementById("terms").checked;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    const age = getAge(dob);
    if (age < 18 || age > 55) {
        alert("Age must be between 18 and 55 years.");
        return;
    }

    const entry = { name, email, password, dob, acceptTerms };
    let entries = retrieveEntries();
    entries.push(entry);
    localStorage.setItem("user-entries", JSON.stringify(entries));
    displayEntries();
    userform.reset();
};

userform.addEventListener("submit", saveUserForm);
