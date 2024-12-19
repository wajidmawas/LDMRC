import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
//import * as toast from 'toastr';
declare var toastr: any;
@Injectable()
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { 
    toastr.options.closeButton = true;
    toastr.options.positionClass = 'toast-bottom-right';
    toastr.options.showDuration = 1000;
  }

  showSuccess(message: string, title: string) {
    toastr.success(message, title, {
      positionClass: 'toast-bottom-right',
      timeOut: 5000,
      closeButton: true
    });
  }
  showError(message: string, title: string) {
    toastr.error(message, title, {
      positionClass: 'toast-bottom-right',
      timeOut: 5000,
      closeButton: true
    });
  }
  showWarning(message: string, title: string) {
    toastr.warning(message, title, {
      positionClass: 'toast-bottom-right',
      timeOut: 5000,
      closeButton: true
    });
  }

  showInfo(message: string, title: string) {
    toastr.info(message, title, {
      positionClass: 'toast-bottom-right',
      timeOut: 5000,
      closeButton: true
    });
  }
   
}
