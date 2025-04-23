function emailSend() {
    try {
        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        // Show loading state
        const submitButton = document.querySelector('#contactForm button[type="submit"]');
        const originalText = submitButton ? submitButton.textContent : 'Send Message';
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
        }

        // Secure API call
        fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': '1C23E1763400BACA1AC6CB73635FDB6CA714'
            },
            body: JSON.stringify({
                name: name,
                phone: phone,
                email: email,
                message: message
            })
        })
        .then(response => {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
            
            if (response.ok) {
                swal({
                    title: "Success!",
                    text: "Message sent successfully!",
                    icon: "success",
                    button: "OK",
                });
                document.getElementById("contactForm").reset();
            } else {
                return response.json().then(err => { throw err; });
            }
        })
        .catch(error => {
            console.error("Error:", error);
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
            
            swal({
                title: "Error!",
                text: error.message || "Failed to send message. Please try again.",
                icon: "error",
                button: "OK",
            });
        });
    } catch (error) {
        console.error("Function error:", error);
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
        
        swal({
            title: "Error!",
            text: "Something went wrong. Please try again.",
            icon: "error",
            button: "OK",
        });
    }
    return false;
}