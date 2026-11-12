// Enhancement: submit the contact form via fetch. Without JS the form posts normally.
// Delegated on document so it survives view-transition page swaps.
document.addEventListener('submit', async (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || !form.action.startsWith('https://formspree.io')) return;
  event.preventDefault();
  const status = form.querySelector<HTMLElement>('.status');
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!status || !button || button.disabled) return; // already sending: ignore repeat submits
  button.disabled = true;
  status.textContent = '';
  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      status.textContent =
        res.status < 500
          ? "Couldn't send your message. Please check the fields and try again."
          : 'The server had a problem sending your message. Please try again in a moment.';
      return;
    }
    form.reset();
    status.textContent = "Message sent — I'll get back to you soon.";
  } catch {
    status.textContent = "Couldn't reach the server. Check your connection and try again.";
  } finally {
    button.disabled = false;
  }
});

export {};
