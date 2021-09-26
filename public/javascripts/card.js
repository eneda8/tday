const stripe = Stripe('pk_live_51JdHWwFFNejXIVDn65Nwb4TQHCLnP23NPPoh104KN16e7GCPm765YHT9WXkEUcnDxNkMmGPi6Ck6DfYD5ts0XBJT00Xv8seH7G');
const elements = stripe.elements();

let style = {};

const card = elements.create('card', { style });
card.mount('#card-element');

const form = document.querySelector('form');
const errorEl = document.querySelector('#card-errors');

const stripeTokenHandler = token => {
  const hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token.id);
  form.appendChild(hiddenInput);

  form.submit();
}

form.addEventListener('submit', e => {
  e.preventDefault();

  stripe.createToken(card).then(res => {
    if (res.error) errorEl.textContent = res.error.message;
    else stripeTokenHandler(res.token);
  })
})
 
