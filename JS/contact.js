

const btn = document.getElementById('button');
document.getElementById('form')
 .addEventListener('submit', function(event) {
   event.preventDefault(); // Prevents default form submission

   btn.value = 'Sending...'; // Change button text during submission

   const serviceID = 'service_raf1jwf'; // Default EmailJS service
   const templateID = 'template_bcfzg1k'; // Replace with your actual EmailJS template ID
   emailjs.init('d2iOJ0PLaeyO6C3Lb');
   // Send the form using EmailJS
   emailjs.sendForm(serviceID, templateID, this)
    .then(() => {
      btn.value = 'Send Email'; // Reset button text
      alert('Email sent successfully!');
    }, (err) => {
      btn.value = 'Send Email'; // Reset button text
      alert('Failed to send email: ' + JSON.stringify(err)); // Show error
    });
});

document.getElementById('discord-icon').addEventListener('click', function() {
    const discordUsername = "anvarms"; // Replace with your actual Discord username and tag
    navigator.clipboard.writeText(discordUsername).then(() => {
        alert('Discord username copied: ' + discordUsername);
    }).catch(err => {
        alert('Failed to copy Discord username.');
        console.error(err);
    });
});
