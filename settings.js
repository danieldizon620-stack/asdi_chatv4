'use strict';
const form=document.getElementById('form'),input=document.getElementById('server'),status=document.getElementById('status');
window.asdiSettings.getServer().then(value=>input.value=value).catch(e=>status.textContent=e.message);
form.addEventListener('submit',async e=>{e.preventDefault();status.textContent='Saving...';try{await window.asdiSettings.saveServer(input.value);}catch(error){status.textContent=error.message;}});
