import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { SharedService } from './Shared.Service';

export const roleGuard = (action: string, featureId:string) => () => {
    const authService = inject(SharedService);
    const router = inject(Router);
  
    if(authService.getIsActionAssigned(action, featureId)) 
    {
        return true;
    }
    else 
    {
        router.navigate(['dashboard']);
        return false;
    }
  };
  