const clear = document.getElementById('clear');
clear.addEventListener('click', (e) => {
       e.preventDefault();
       document.getElementById('country').value = '';
       document.getElementById('gender').value = '';
       document.getElementById('ageGroup').value = '';
       document.location.href = "http://localhost:3000/charts?country=&ageGroup=&gender=";
});

const clearAll = document.getElementById('clear-all');
clearAll.addEventListener('click', (e) => {
       e.preventDefault();
       document.getElementById('country').value = '';
       document.getElementById('gender').value = '';
       document.getElementById('ageGroup').value = '';
       document.location.href = "http://localhost:3000/charts/all?country=&ageGroup=&gender=";
});