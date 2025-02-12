const passEl = document.getElementById("pass");
const copiedEl = document.getElementById("copied");
const copyIcon = document.getElementById("copy");
const inputRangeEl = document.getElementById("character-length");
const passLengthEl = document.getElementById("length-value");
const checkBoxes = document.querySelectorAll("input[type='checkbox']");
const checkBoxesStates = [{
    category: 'uppercase',
    isChecked: false
}, {
    category: 'lowercase',
    isChecked: false
}, {
    category: 'numbers',
    isChecked: false
}, {
    category: 'symbols',
    isChecked: false
}];
const levelEl = document.querySelector(".level");
const levelTextEl = document.querySelector(".level-text");
const generateBtn = document.getElementById("generate");
const levelStates = [{
    level: 1,
    state: "too weak"
}, {
    level: 2,
    state: "weak"
}, {
    level: 3,
    state: "medium"
}, {
    level: 4,
    state: "strong"
}];
let passLength;
let passLevel;
let passStrength;
let passGenerated;

function initialisation() {
    passEl.classList.add("empty");
    copiedEl.classList.add("hide");
    passLengthEl.textContent = inputRangeEl.value;
    passLength = 0;
    deselectAllCheckBoxes();
    levelTextEl.classList.add("hide");
    passLevel = 0;
}

initialisation();

function generatePassword(length = 10, options = {}) {
    const includeNumbers = options.numbers;
    const includeSymbols = options.symbols;
    const includeUppercase = options.uppercase;
    const includeLowercase = options.lowercase;

    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';

    let allChars = '';
    let mandatoryChars = '';

    if (includeNumbers) {
        mandatoryChars += randomChar(numbers);
        allChars += numbers;
    }
    if (includeSymbols) {
        mandatoryChars += randomChar(symbols);
        allChars += symbols;
    }
    if (includeUppercase) {
        mandatoryChars += randomChar(uppercaseChars);
        allChars += uppercaseChars;
    }
    if (includeLowercase) {
        mandatoryChars += randomChar(lowercaseChars);
        allChars += lowercaseChars;
    }

    if (!mandatoryChars) {
        throw new Error('At least one character type must be selected!');
    }

    let remainingLength = length - mandatoryChars.length;
    let password = mandatoryChars;

    for (let i = 0; i < remainingLength; i++) {
        const randomIndex = Math.floor(Math.random() * allChars.length);
        password += allChars[randomIndex];
    }

    password = password.split('').sort(() => Math.random() - 0.5).join('');

    return password;
}


function randomChar(chars) {
    return chars[Math.floor(Math.random() * chars.length)];
}

function deselectAllCheckBoxes() {
    Object.values(checkBoxes).map((el) => {
        el.checked = false;
    });
}

function checkLevelStrength() {
    passLevel = 0;
    Object.values(checkBoxesStates).map((el) => {
        if (el.isChecked) {
            passLevel += 1;
        }
    });
    if (passLength < 8 && passLevel > 3) {
        passLevel--;
    }
    checkLevelState();
    strengthText();
    updateStrengthDOMLevel();
}

function checkLevelState() {
    for (const state of Object.values(levelStates)) {
        if (passLevel === state.level && passLength > 3) {
            passStrength = state.state.toUpperCase();
        }
    }
    if (!passLevel && passLength < 4)
        passStrength = "";
}

function strengthText() {
    if (passLevel && passLength > 3) {
        levelTextEl.textContent = passStrength;
        levelTextEl.classList.remove("hide");
    } else {
        levelTextEl.classList.add("hide");
    }
}

function updateStrengthDOMLevel() {
    const rectEl = levelEl.children;
    const classColor = passStrength === "TOO WEAK" ? "too-weak" : passStrength;
    let i = 0;

    if (passStrength && passLength > 3) {
        for (const rect of Object.values(rectEl)) {
            removeAllStrengthClasses(rect);
            if (i < passLevel) {
                rect.classList.add(classColor.toLowerCase());
                i++;
            }
        }
    } else {
        for (const rect of Object.values(rectEl)) {
            removeAllStrengthClasses(rect);
        }
    }
}

function removeAllStrengthClasses(el) {
    el.classList.remove("too-weak");
    el.classList.remove("weak");
    el.classList.remove("medium");
    el.classList.remove("strong");
}

function isCategoryChecked(val) {
    for (const el of Object.values(checkBoxesStates)) {
        if (el.category === val)
            return el.isChecked;
    }
}

function updatePassDOM(password) {
    if (password && passLength > 3) {
        passEl.textContent = password;
        passEl.classList.remove("empty");
    } else {
        passEl.textContent = "P4$5W0rD!";
        passEl.classList.add("empty");
    }
}

copyIcon.addEventListener("click", () => {
    if (passGenerated) {
        navigator.clipboard.writeText(passEl.textContent)
            .then(() => {
                copiedEl.classList.remove("hide");
            }).catch(err => {
                console.log(err);
            });
    } else {
        copiedEl.classList.add("hide");
    }
});

generateBtn.addEventListener("click", () => {
    checkLevelStrength();
    console.log(passLevel + " " + passStrength);
    if (passLength < 4) {
        passGenerated = "";
        updatePassDOM(passGenerated);
        alert("Min password length is 4!");
    }
    if (passLevel === 0) {
        passGenerated = "";
        updatePassDOM(passGenerated);
        alert("At least one character type must be selected!");
    }

    copiedEl.classList.add("hide");
    passGenerated = generatePassword(passLength, {
        numbers: isCategoryChecked("numbers"),
        symbols: isCategoryChecked("symbols"),
        uppercase: isCategoryChecked("uppercase"),
        lowercase: isCategoryChecked("lowercase")
    });

    updatePassDOM(passGenerated);
});

inputRangeEl.addEventListener("input", (event) => {
    passLengthEl.textContent = event.currentTarget.value;
    passLength = Number(event.currentTarget.value);
    checkLevelStrength();
});

Object.values(checkBoxes).map((el) => {
    el.addEventListener("click", (event) => {
        if (event.target.name === 'uppercase') {
            checkBoxesStates[0].isChecked = event.target.checked;
            checkLevelStrength();
        }
        if (event.target.name === 'lowercase') {
            checkBoxesStates[1].isChecked = event.target.checked;
            checkLevelStrength();
        }
        if (event.target.name === 'numbers') {
            checkBoxesStates[2].isChecked = event.target.checked;
            checkLevelStrength();
        }
        if (event.target.name === 'symbols') {
            checkBoxesStates[3].isChecked = event.target.checked;
            checkLevelStrength();
        }
    });
});
