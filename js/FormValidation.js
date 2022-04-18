let isUpdate = false;
employeePayrollObject = {};
window.addEventListener('DOMContentLoaded', () => {
    validName();
    salaryRange();
    checkForUpdate();
});

function validName() {
    const name = document.querySelector("#name");
    const textError = document.querySelector(".text-error");
    name.addEventListener('input', function () {
        try {
            let empData = new EmployeePayrollData();
            empData.name = name.value;
            textError.textContent = "";
        } catch (e) {
            textError.textContent = e;
        }
    });
}

/** set event listener on salary range*/
function salaryRange() {
    const salary = document.querySelector("#salary");
    const output = document.querySelector('.salary-output');
    salary.addEventListener('input', function () {
        output.textContent = salary.value;
    });
}

/** On form submit populate employee payroll data object */
const save = (event) => {
    let employeePayrollData = createEmployeePayroll();
    createAndUpdateLocalStorage(employeePayrollData);
    event.preventDefault();
    event.stopPropagation();
    try {
        setEmployeePayrollObject();
        createAndUpdateLocalStorage();
        resetForm();
        window.location.replace(siteProperties.homePage);
    } catch (e) {
        return;
    }

}
const setEmployeePayrollObject = () => {
    employeePayrollObject._name = getInputValueById('#name');
    employeePayrollObject._profilePic = getInputValueById('[name=profile]').pop();
    employeePayrollObject._gender = getInputValueById('[name=gender]').pop();
    employeePayrollObject._department = getInputValueById('[name=department]');
    employeePayrollObject._salary = getInputValueById('#salary');
    employeePayrollObject._note = getInputValueById('#notes');
    let date = getInputValueById('#day') + " " + getInputValueById('#month') + " " + getInputValueById('#year');
    employeePayrollObject._startDate = date;
}
const createEmployeePayroll = () => {
    let employeePayrollData = new EmployeePayrollData();
    try {
        employeePayrollData.name = getInputValueById('#name');
        setTextValue('.text-error', "");
    } catch (e) {
        setTextValue('.text-error', e);
    }

    try {
        let date = getInputValueById('#day') + " " + getInputValueById('#month') + " " + getInputValueById('#year');
        employeePayrollData.startDate = new Date(Date.parse(date));
        setTextValue('.date-error', "");
    } catch (e) {
        setTextValue('.date-error', e);
    }

    employeePayrollData.profilePic = getSelectedValues('[name=profile]').pop();
    employeePayrollData.gender = getSelectedValues('[name=gender]').pop();
    employeePayrollData.department = getSelectedValues('[name=department]');
    employeePayrollData.salary = getInputValueById('#salary');
    employeePayrollData.note = getInputValueById('#notes');
    employeePayrollData.id = new Date().getTime() + 1;
    alert(employeePayrollData.toString());
    return employeePayrollData;
}

const getInputValueById = (id) => {
    let value = document.querySelector(id).value;
    return value;
}

const setTextValue = (id, message) => {
    const textError = document.querySelector(id);
    textError.textContent = message;
}

const getSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    let setItems = [];
    allItems.forEach(item => {
        if (item.checked == true)
            setItems.push(item.value);
    });
    return setItems;
}

/** save employee object into local storage */
const createAndUpdateLocalStorage = () => {
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    if (employeePayrollList) {
        let empPayrollData = employeePayrollList.find(empData => empData._id == employeePayrollObject._id);
        if (!empPayrollData) {
            employeePayrollList.push(createEmployeePayrollData());
        } else {
            const index = employeePayrollList.map(empData => empData._id)
                .indexOf(empPayrollData._id);
        }
    } else {
        employeePayrollList = [createEmployeePayrollData()]
    }
    localStorage.setItem('EmployeePayrollList', JSON.stringify(employeePayrollList));
    alert("data stored with name " + empData.name);
}
const createEmployeePayrollData = (id) => {
    let employeePayrollData = new EmployeePayrollData();
    if (!id) employeePayrollData.id = createNewEmployeeId();
    else employeePayrollData.id = id;
    setEmployeePayrollData(employeePayrollData);
    return employeePayrollData;
}
const setEmployeePayrollData = (employeePayrollData) => {
    try {
        employeePayrollData.name = employeePayrollObject._name;
    } catch (e) {
        setTextValue('.text-error', e);
        throw e;
    }
    employeePayrollData.profilePic = employeePayrollObject._profilePic;
    employeePayrollData.gender = employeePayrollObject._gender;
    employeePayrollData.department = employeePayrollObject._department;
    employeePayrollData.salary = employeePayrollObject._salary;
    employeePayrollData.note = employeePayrollObject._note;
    try {
        employeePayrollData.startDate = new Date(Date.parse(employeePayrollObject._startDate));
    } catch (e) {
        setTextValue('.date-error', e);
        throw e;
    }
    alert(employeePayrollData.toString());
}
const createEmployeeId = () => {
    let empId = localStorage.getItem("EmployeeID");
    empId = !empId ? 1 : (parseInt(empId) + 1).toString();
    localStorage.setItem("EmployeeID", empId);
    return empId;
}
/** Reset employee payroll form */

const resetForm = () => {
    setTextValue('#name', '');
    unsetSelectedValues('[name=profile]');
    unsetSelectedValues('[name=gender]');
    unsetSelectedValues('[name=department]');
    setValue('#salary', '');
    setValue('#notes', '');
    setSelectedIndex('#day', 0);
    setSelectedIndex('#month', 0);
    setSelectedIndex('#year', 0);
}

const unsetSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        item.checked = false;
    });
}

const setValue = (id, value) => {
    const element = document.querySelector(id);
    element.value = value;
}

/** check for Update and set the valuees of the form elements  */
const checkForUpdate = () => {
    let jsonData = localStorage.getItem('edit-emp');
    isUpdate = jsonData ? true : false;
    if (!isUpdate)
        return;
    employeePayrollObject = JSON.parse(jsonData);
    setForm();
}

const setForm = () => {
    setValue('#name', employeePayrollObject._name);
    setSelectValue('[name=profile]', employeePayrollObject._profilePic);
    setSelectValue('[name=gender]', employeePayrollObject._gender);
    setSelectValue('[name=department]', employeePayrollObject._department);
    setValue('#salary', employeePayrollObject._salary);
    setTextValue('.salary-output', employeePayrollObject._salary)
    setValue('#notes', employeePayrollObject._note);

    let date = stringify(employeePayrollObject._startDate).split(" ");
    setValue('#day', date[0]);
    setValue('#month', date[1]);
    setValue('#year', date[2]);
}

const setSelectValue = (propertyValue, value) => {
    let allitem = document.querySelectorAll(propertyValue);
    allitem.forEach(item => {
        if (Array.isArray(value)) {
            if (value.includes(item.value)) {
                item.checked = true;
            }
        } else if (item.value == value) {
            item.checked = true;
        }
    });
}
const setSelectedIndex = (id, index) => {
    const element = document.querySelector(id);
    element.selectedIndex = index;
}