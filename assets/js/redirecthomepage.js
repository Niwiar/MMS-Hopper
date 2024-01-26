 // Replace "destination.html" with the actual URL of the page you want to redirect to
    const destinationURL = "login.html";

    // Function to perform the redirection
    function autoRedirect() {
      window.location.href = destinationURL;
    }

    // Call the autoRedirect function when the page loads
    window.onload = autoRedirect;