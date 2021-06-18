import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

declare var M: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [AuthService]
})
export class RegisterComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.resetForm();
  }

  resetForm(form?: NgForm) {
    const defaultValues = {
      _id: "",
      name: "",
      password: "",
      email: "",
      createdAt: new Date(),
    };

    if (form) form.reset(defaultValues);

    this.authService.selectedUser = defaultValues;
  }

  onSubmit(form: NgForm) {
    this.authService.register(form.value).subscribe(() => this.router.navigate(['/login']), (err) => M.toast({ html: err.error, classes: 'rounded' }));
  }

}
