import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree
} from "@angular/router";
import { Ack } from "./models/acks";
import { UserService } from "./services/user.service";
  
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService: UserService,
        private router: Router) { }
    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Promise<boolean> {
        var cookies = document.cookie;
        var cookiearray = cookies.split(';');
        var token = cookiearray[0].split('=')[1];
        const isUserLoggedIn: Ack = await this.authService.verifyCookie({token: token}).toPromise();
        console.log(isUserLoggedIn);
        if(!isUserLoggedIn.status){
          this.router.navigateByUrl('');
        }else
        return isUserLoggedIn.status;   
    }
}