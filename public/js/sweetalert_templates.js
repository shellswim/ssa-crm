function swal_confirm(alerticon, alerttitle, showdeny, denytext, showcancel, canceltext, confirmtext, confirmationdialog, denydialog, message) {
  return new Promise(function (resolve, reject) {
    Swal.fire({
      title: alerttitle,
      showDenyButton: showdeny,
      showCancelButton: showcancel,
      confirmButtonText: confirmtext,
      cancelButtonText: canceltext,
      denyButtonText: denytext,
      icon: alerticon,
      html: message,
      position: 'top'
    }).then((result) => {
      if (result.isConfirmed) {
        if (confirmationdialog) {
          Swal.fire('Saved!', '', 'success');
        }
        resolve(true);
      } else if (result.isDenied) {
        if (denydialog) {
          Swal.fire('Changes are not saved', '', 'info');
        }
        resolve(false);
      }
    });
  });
}
function swal_alert(icon, title, message, footer) {
  return new Promise(function (resolve,reject) {
    Swal.fire({
      icon: icon,
      title: title,
      html: message,
      footer: footer,
      position: 'top'
    }).then((result) => {
      resolve();
    });
  });
}
function swal_toast(icon, title, message, toast, timer, timeprogressbar, footer) {
    Swal.fire({
      icon: icon,
      title: title,
      html: message,
      footer: footer,
      toast: toast,
      timer: timer,
      timerProgressBar: timeprogressbar,
      position: 'bottom-end',
      showConfirmButton: true,
      confirmButtonText: 'Close',
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
}