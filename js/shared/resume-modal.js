const resumeDialog = document.querySelector('.resume-dialog');
const resumeOpeners = document.querySelectorAll('[data-resume-open]');
const resumeClosers = document.querySelectorAll('[data-resume-close]');

if (resumeDialog) {
    resumeOpeners.forEach((button) => {
        button.addEventListener('click', () => {
            if (typeof resumeDialog.showModal === 'function') {
                resumeDialog.showModal();
                return;
            }

            resumeDialog.setAttribute('open', 'open');
        });
    });

    resumeClosers.forEach((button) => {
        button.addEventListener('click', () => {
            if (typeof resumeDialog.close === 'function') {
                resumeDialog.close();
                return;
            }

            resumeDialog.removeAttribute('open');
        });
    });

    resumeDialog.addEventListener('click', (event) => {
        const bounds = resumeDialog.getBoundingClientRect();
        const clickedOutside =
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom;

        if (!clickedOutside) {
            return;
        }

        if (typeof resumeDialog.close === 'function') {
            resumeDialog.close();
            return;
        }

        resumeDialog.removeAttribute('open');
    });
}
