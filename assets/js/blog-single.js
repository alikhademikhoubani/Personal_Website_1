(function initCommentForm() {
    const form = document.getElementById('commentForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('commentName').value.trim();
        const email = document.getElementById('commentEmail').value.trim();
        const message = document.getElementById('commentMessage').value.trim();

        let isValid = true;

        if (name.length < 3) {
            alert('لطفاً نام خود را وارد کنید (حداقل ۳ کاراکتر).');
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('لطفاً یک ایمیل معتبر وارد کنید.');
            isValid = false;
        } else if (message.length < 5) {
            alert('لطفاً متن دیدگاه خود را وارد کنید.');
            isValid = false;
        }

        if (isValid) {
            alert('دیدگاه شما با موفقیت ارسال شد. متشکریم!');
            form.reset();
        }
    });
})();