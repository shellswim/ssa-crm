const icons = {
  success: {
    colour: {
      large: {
        url: "/assets/images/customAlertIcons/success-coloured.webp"
      },
      small: {
        url: "/assets/images/customAlertIcons/success-coloured@40px.webp"

      }
    },
    white: {
      large: {
        url: "/assets/images/customAlertIcons/success-white.webp"
      },
      small: {
        url: "/assets/images/customAlertIcons/success-white@40px.webp"

      }
    }
  },
  error: {
    colour: {
      large: {
        url: "/assets/images/customAlertIcons/error-coloured.webp"
      },
      small: {
        url: "/assets/images/customAlertIcons/error-coloured@40px.webp"

      }
    },
    white: {
      large: {
        url: "/assets/images/customAlertIcons/error-white.webp"
      },
      small: {
        url: "/assets/images/customAlertIcons/error-white@40px.webp"

      }
    }
  },
  warning: {
    colour: {
      large: {
        url: "/assets/images/customAlertIcons/warning-coloured.webp"
      },
      small: {
        url: "/assets/images/customAlertIcons/warning-coloured@40px.webp"

      }
    },
    white: {
      large: {
        url: "/assets/images/customAlertIcons/warning-white.webp"
      },
      small: {
        url: "/assets/images/customAlertIcons/warning-white@40px.webp"

      }
    }
  },
  info: {
    colour: {
      large: {
        url: "/assets/images/customAlertIcons/info-coloured.webp"
      },
      small: {
        url: "/assets/images/customAlertIcons/info-coloured@40px.webp"

      }
    },
    white: {
      large: {
        url: "/assets/images/customAlertIcons/info-white.webp"
      },
      small: {
        url: "/assets/images/customAlertIcons/info-white@40px.webp"

      }
    }
  },
  question: {
    colour: {
      large: {
        url: "/assets/images/customAlertIcons/question-coloured.webp"
      },
      small: {
        url: "/assets/images/customAlertIcons/question-coloured@40px.webp"

      }
    },
    white: {
      large: {
        url: "/assets/images/customAlertIcons/question-white.webp"
      },
      small: {
        url: "/assets/images/customAlertIcons/question-white@40px.webp"

      }
    }
  }
}
function swal_confirm(alerticon, alerttitle, showdeny, denytext, showcancel, canceltext, confirmtext, confirmationdialog, denydialog, message) {
  return new Promise(function (resolve, reject) {
    Swal.fire({
      allowOutsideClick: false,
      title: alerttitle,
      showDenyButton: showdeny,
      showCancelButton: showcancel,
      confirmButtonText: confirmtext,
      cancelButtonText: canceltext,
      denyButtonText: denytext,
      imageUrl: icons[alerticon].colour.large.url,
      imageWidth: 100,
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
          swal_alert('info','Cancelled','No changes were saved.','');
          //Swal.fire('Successfully cancelled.', '', 'info');
        }
        resolve(false);
      }
    });
  });
}
function swal_alert(icon, title, message, footer, position = 'top') {
  return new Promise(function (resolve,reject) {
    Swal.fire({
      allowOutsideClick: false,
      imageUrl: icons[icon].colour.large.url,
      imageWidth: 100,
      title: title,
      html: message,
      footer: footer,
      position: position
    }).then((result) => {
      resolve();
    });
  });
}
function swal_toast(icon, title, message, toast, timer, timeprogressbar, footer) {
    Swal.fire({
      imageUrl: icons[icon].colour.small.url,
      title: title,
      html: message,
      footer: footer,
      toast: toast,
      timer: timer,
      timerProgressBar: timeprogressbar,
      position: 'top-end',
      showConfirmButton: false,
      confirmButtonText: 'Close',
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
        toast.addEventListener('mouseup', function(e) {
          Swal.close()
        })
      }
    })
}
function swal_toast_colored(icon, title, message, toast, timer, timeprogressbar, footer) {
    Swal.fire({
      imageUrl: icons[icon].white.small.url,
      title: title,
      html: message,
      footer: footer,
      toast: toast,
      timer: timer,
      timerProgressBar: timeprogressbar,
      position: 'top-end',
      showConfirmButton: false,
      confirmButtonText: 'Close',
      customClass: {
        popup: `colored-toast clickable user-select-none swal2-icon-${icon}`
      },
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
        toast.addEventListener('mouseup', function(e) {
          Swal.close()
        })
      }
    })
}

var images = new Array();
function preload() {
  for (i = 0; i < preload.arguments.length; i++) {
    images[i] = new Image()
    images[i].src = preload.arguments[i]
  }
}
preload(
  '/assets/images/customAlertIcons/success-coloured.webp',
  '/assets/images/customAlertIcons/success-coloured@40px.webp',
  '/assets/images/customAlertIcons/success-white.webp',
  '/assets/images/customAlertIcons/success-white@40px.webp',
  '/assets/images/customAlertIcons/error-coloured.webp',
  '/assets/images/customAlertIcons/error-coloured@40px.webp',
  '/assets/images/customAlertIcons/error-white.webp',
  '/assets/images/customAlertIcons/error-white@40px.webp',
  '/assets/images/customAlertIcons/warning-coloured.webp',
  '/assets/images/customAlertIcons/warning-coloured@40px.webp',
  '/assets/images/customAlertIcons/warning-white.webp',
  '/assets/images/customAlertIcons/warning-white@40px.webp',
  '/assets/images/customAlertIcons/info-coloured.webp',
  '/assets/images/customAlertIcons/info-coloured@40px.webp',
  '/assets/images/customAlertIcons/info-white.webp',
  '/assets/images/customAlertIcons/info-white@40px.webp',
  '/assets/images/customAlertIcons/question-coloured.webp',
  '/assets/images/customAlertIcons/question-coloured@40px.webp',
  '/assets/images/customAlertIcons/question-white.webp',
  '/assets/images/customAlertIcons/question-white@40px.webp'
)