/**
 * Move focus to the first invalid field after a failed submit (P20).
 *
 * Colouring a border and attaching `role="alert"` to each error is not enough on
 * a form this size: every invalid field announces at once, in DOM order, and a
 * buyer who pressed Submit has no way to tell which announcement belongs to
 * which field. Focus settles it — the invalid field becomes the current context
 * and its own error is read as part of that field's description.
 *
 * It runs on the next frame because errors are React state: the `aria-invalid`
 * attributes do not exist yet at the moment the submit handler returns.
 */
export function focusFirstInvalid(form: HTMLFormElement | null): void {
  if (!form) return;

  requestAnimationFrame(() => {
    const target = form.querySelector<HTMLElement>('[aria-invalid="true"]');
    target?.focus();
  });
}
