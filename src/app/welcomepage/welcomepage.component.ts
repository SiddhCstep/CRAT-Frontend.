import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthserviceService } from '../service/authservice.service'



enum FormState {
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD
}


interface JwtResponse {
  refresh: string;
  access: string;
}



@Component({
  selector: 'app-welcomepage',
  templateUrl: './welcomepage.component.html',
  styleUrl: './welcomepage.component.css'
})


export class WelcomepageComponent implements OnInit {

  [x: string]: any;
  FormState = FormState;
  currentState: FormState = FormState.LOGIN;
  expandedBox: string = '';
  loginForm: FormGroup;
  registerForm: FormGroup;
  forgotPasword: FormGroup;
  showLoginPassword: boolean = false;
  showRegisterPassword: boolean = false;
  showRegisterConfirmPassword: boolean = false;
  lodershow: boolean = false;
  errormsg: string = ""
  sucessmassege: string = ""
  nameerror: string = "";
  emailerror: string = "";
  passworderror: string = "";
  re_password: string = "";
  resistationerror: string = ''


  constructor(private fb: FormBuilder, private router: Router, private authservice: AuthserviceService) {


    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, { validators: this['passwordMatchValidator'] });

    this.forgotPasword = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });


  }


  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
  expandBox(boxName: string) {
    if (sessionStorage.getItem('jwtToken')) {
      this.router.navigate(['/home'])
    } else {
      this.expandedBox = boxName;
    }
  }




  shrinkBox() {
    this.expandedBox = '';
    this.resetForms(); // Reset forms when popup is closed
  }

  toggleForm(state: FormState) {
    this.currentState = state;
    this.resetForms(); // Reset forms when switching between forms
  }


  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }



  // onSubmitLogin() {}
  onSubmitLogin() {
    if (this.loginForm.valid) {
      // //console.log(this.loginForm.value);
      this.expandedBox = ''
      this.lodershow = true;

      this.loginForm.value


      this.authservice.login(this.loginForm.value).subscribe((data) => {

        const expirationTime = Date.now() + 1000 * 60 * 60 * 2; // 2 hours from now

        const checkExpiration = () => {
          if (Date.now() >= expirationTime) {
            alert("You need to login again");
            sessionStorage.removeItem('jwtToken');
            this.router.navigate(['']);
          } else {
            setTimeout(checkExpiration, 1000); // Recheck every second
          }
        }

        setTimeout(checkExpiration, 1000 * 60 * 60 * 2); // Initial timer


        sessionStorage.setItem('jwtToken', data.access);
        this.lodershow = false;
        this.router.navigate(['/home']);

      }, (error) => {
        // //console.log(error);
        // //console.log(error.error.detail
        // );

        if (error.error.detail) {
          this.errormsg = error.error.detail;
        } else {
          this.errormsg = error.message;
        }

        // //console.log( this.errormsg);
        this.lodershow = false;
        this.expandedBox = 'something-notdefind'
      })
    }
  }

  onSubmitRegister() {

    if (this.registerForm.valid) {

      this.emailerror = ""
      this.sucessmassege = ""
      // Handle registration logic here
      // //console.log(this.registerForm.value);

      this.expandedBox = ''
      this.lodershow = true;
      this.authservice.register({
        "email": this.registerForm.value.email,
        "name": this.registerForm.value.fullName,
        "password": this.registerForm.value.password,
        "re_password": this.registerForm.value.confirmPassword,
      }
      ).subscribe((data) => {
        // //console.log(data);
        this.lodershow = false;
        this.expandedBox = 'something-notdefind'
        this.sucessmassege = "Registration successful"
      }, (error) => {
        // //console.log(error);
        // //console.log(error.error
        // );

        if (error.error?.email) {

          this.emailerror = error.error?.email[0]
        }

        if (error.error?.password) {
          this.passworderror = error.error?.password[0]
        }

        if (error.message
        ) {
          this.resistationerror = error.message;

        }
        // this.errormsg = error.error?.password[0];
        this.errormsg = error.error;
        this.lodershow = false;
        this.expandedBox = 'something-notdefind'
        // this.router.navigate(['/home']);
      })
    }
  }
  onSubmitForgotPassword() {

    if (this.forgotPasword.valid) {
      this.emailerror = ""
      this.sucessmassege = ""
      // Handle forgot password logic here
      // //console.log(this.forgotPasword.value);

      this.expandedBox = ''
      this.lodershow = true;

     

      this.authservice.forgotpassword( this.forgotPasword.value).subscribe((data) => {
        // //console.log(data);
        this.lodershow = false;
        this.expandedBox = 'something-notdefind'
        this.sucessmassege = "Password reset link sent to your email."

      }, (error) => {
        // //console.log(error);
        this.lodershow = false;
        this.expandedBox = 'something-notdefind'
        if (error.error?.email) {

          this.emailerror = error.error?.email
        }
      })

    }
  }











  get loginEmail() {
    return this.loginForm.get('email');
  }

  get loginPassword() {
    return this.loginForm.get('password');
  }

  get registerFullName() {
    return this.registerForm.get('fullName');
  }

  get registerEmail() {
    return this.registerForm.get('email');
  }

  get registerPassword() {
    return this.registerForm.get('password');
  }

  get registerConfirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  get forgotpassword() {
    return this.forgotPasword.get('email')
  }





  togglePasswordVisibility(type: string) {
    if (type === 'login') {
      this.showLoginPassword = !this.showLoginPassword;
    } else if (type === 'register') {
      this.showRegisterPassword = !this.showRegisterPassword;
    } else if (type === 'confirm') {
      this.showRegisterConfirmPassword = !this.showRegisterConfirmPassword;
    }
  }


  resetForms() {
    this.loginForm.reset();
    this.registerForm.reset();
    this.forgotPasword.reset();

    // Clear all error and success messages
    this.errormsg = "";
    this.sucessmassege = "";
    this.nameerror = "";
    this.emailerror = "";
    this.passworderror = "";
    this.re_password = "";
    this.resistationerror = '';
  }
}
