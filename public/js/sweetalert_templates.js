function swal_confirm(alerticon, alerttitle, showdeny, denytext, showcancel, canceltext, confirmtext, confirmedcallback, confirmationdialog, denycallback, denydialog, message) {
  return new Promise(function (resolve, reject) {
    Swal.fire({
      title: alerttitle,
      showDenyButton: showdeny,
      showCancelButton: showcancel,
      confirmButtonText: confirmtext,
      cancelButtonText: canceltext,
      denyButtonText: denytext,
      icon: alerticon,
      html: message
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed && confirmedcallback) {
        if (confirmationdialog) {
          Swal.fire('Saved!', '', 'success');
        }
        resolve(true);
      } else if (result.isDenied && denycallback) {
        if (denydialog) {
          Swal.fire('Changes are not saved', '', 'info');
        }
        resolve(false);
      }
    })
  })
}