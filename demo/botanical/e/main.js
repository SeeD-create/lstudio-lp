 
const REGISTRATION_URL = "";
const registerLink = document.querySelector('.register-link');
if (REGISTRATION_URL) {
  registerLink.href = REGISTRATION_URL;
} else {
  registerLink.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector('#registration-status').hidden = false;
  });
}
const sticky = document.querySelector('.sticky');
const updateSticky = () => {
  const hero = document.querySelector('.hero').getBoundingClientRect();
  const registration = document.querySelector('#registration').getBoundingClientRect();
  const closing = document.querySelector('#closing').getBoundingClientRect();
  sticky.hidden = hero.bottom > 0 || (registration.top < innerHeight && registration.bottom > 0) || closing.top < innerHeight;
};
addEventListener('scroll', updateSticky, {passive:true});
addEventListener('resize', updateSticky);
updateSticky();
