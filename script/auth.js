const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const urlParams = new URLSearchParams(window.location.search);

$("#buttonLogin").on("click", async (e) => {
  e.preventDefault();
  const Username = $("#inputUsername").val();
  const Password = $("#inputPassword").val();
  const LocID = $("#inputLocID").val();
  $.ajax({
    url: "/auth/login",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ Username, Password, LocID }),
  })
    .fail((err) => {
      resetForm();
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.responseJSON.message,
      });
    })
    .done(() => {
      resetForm();
      urlParams.has("redirectFrom")
        ? (window.location.href = urlParams.get("redirectFrom"))
        : (window.location.href = "/");
    });
});

const resetForm = () => {
  $("#inputUsername").val("");
  $("#inputPassword").val("");
};

$("#buttonLogout").on("click", () =>
  $.ajax({ url: "/auth/logout", type: "POST" }).done(
    () =>
      (window.location.href = `/login?redirectFrom=${window.location.pathname}`)
  )
);

const showInfo = () => {
  $("#infoUser").text(getCookie("Name") || "guest");
  $("#infoLoc").text(getCookie("Location") || "-");
};
showInfo();
