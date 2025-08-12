var tablinks = document.getElementsByClassName("tab-links");
var tabcontents = document.getElementsByClassName("tab-contents");

function opentab(evt, tabname){
    for (const tablink of tablinks) {
        tablink.classList.remove("active-link");
    }
    for (const tabcontent of tabcontents) {
        tabcontent.classList.remove("active-tab");
    }
    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add("active-link");
    }
    document.getElementById(tabname).classList.add("active-tab");
}

// Mobile side menu controls
var sidemenu = document.getElementById("sidemenu");
function openmenu(){ sidemenu.style.right = "0"; }
function closemenu(){ sidemenu.style.right = "-240px"; }

// Google Sheets form handler
const scriptURL = 'https://script.google.com/macros/s/AKfycbw3OYjHoEg7HOfiVjF3Sk4qqjf9YvrYZ-J_8DfxetqakBcE-rBs3amuRH_VfYTJYRHpPQ/exec'
const form = document.querySelector('form.submit-to-google-sheet');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
      .then(response => console.log('Success!', response))
      .catch(error => console.error('Error!', error.message))
  });
}

// Close menu after clicking a link (mobile UX)
Array.from(document.querySelectorAll('.sidemenu a')).forEach(link => {
  link.addEventListener('click', closemenu);
});

