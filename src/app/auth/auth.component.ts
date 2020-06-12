import {Component, ComponentFactoryResolver, OnDestroy, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthResponseData, AuthService} from './auth.service';
import {Observable, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {AlertComponent} from '../shared/alert/alert.component';
import {PlaceholderDirective} from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy {
  isLoggedIn = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;
  private closeSub: Subscription;

  constructor(private authService: AuthService, private compFact: ComponentFactoryResolver,private router: Router) {
  }

  onSwitch() {
    this.isLoggedIn = !this.isLoggedIn;
  }

  onSubmit(auth: NgForm) {
    if (!auth.valid) {
      return;
    }
    const email = auth.value.email;
    const password = auth.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoggedIn) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      }, errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.showError(errorMessage);
        this.isLoading = false;
      });

    auth.reset();
  }

  private showError(message: string) {
    const alert = this.compFact.resolveComponentFactory(AlertComponent);
    const hostView = this.alertHost.viewContainerRef;

    hostView.clear();
    const compRef = hostView.createComponent(alert);

    compRef.instance.message = message;
    this.closeSub = compRef.instance.close.subscribe(
      () => {
        this.closeSub.unsubscribe();
        hostView.clear();
      }
    );
  }

  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }
}

