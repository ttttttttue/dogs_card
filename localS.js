const formDataFromLS = localStorage.getItem(document.forms.add_dogs_form.name);

const parsedData = formDataFromLS ? JSON.parse(formDataFromLS) : null;

if (parsedData) {
  Object.keys(parsedData).forEach((key) => {
    document.forms.add_dogs_form[key].value = parsedData[key];
  });
}

document.forms.add_dogs_form.addEventListener('input', (event) => {
  const data = Object.fromEntries(new FormData(document.forms.add_dogs_form).entries());
  localStorage.setItem(document.forms.add_dogs_form.name, JSON.stringify(data));
});
