// Enhancement: submit the contact form via fetch. Without JS the form posts normally.
// Delegated on document so it survives view-transition page swaps.
document.addEventListener('submit', async (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || !form.action.startsWith('https://formspree.io')) return;
  event.preventDefault();
  const status = form.querySelector<HTMLElement>('.status');
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!status || !button) return;
  button.disabled = true;
  status.textContent = '';
  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(String(res.status));
    form.reset();
    status.textContent = "Message sent — I'll get back to you soon.";
  } catch {
    status.textContent = 'Oops! There was a problem submitting your form.';
  } finally {
    button.disabled = false;
  }
});

export {};
