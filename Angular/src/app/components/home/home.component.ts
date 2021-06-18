import { map, tap } from 'rxjs/operators';
import { UserData } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

import { UserService } from '../../services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '../../models/user.model';
import { PageEvent } from '@angular/material';

declare var M: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [OrderService, UserService, AuthService]
})
export class HomeComponent implements OnInit {
  userData: UserData = null;
  pageEvent: PageEvent;
  userColumns: string[] = ['name', 'email', 'createdAt'];
  page: Number = 1;
  perPage: Number = 10;
  emailSearch: string = "";

  constructor(private orderService: OrderService, private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
    this.resetOrderForm();
    this.resetUserForm();
  }

  //Users
  resetUserForm(form?: NgForm) {
    const defaultValues = {
      _id: "",
      name: "",
      email: "",
      password: "",
      createdAt: new Date(),
    };

    if (form) form.reset(defaultValues);

    this.authService.selectedUser = defaultValues;
    this.refreshUserList();
  }

  onSubmitUser(form: NgForm) {
    if (form.value._id == "") { //Create new user
      this.authService.register(form.value).subscribe((res) => {
        this.resetUserForm(form);
        M.toast({ html: "Salvo com sucesso!", classes: 'rounded' })
      }, (err) => M.toast({ html: err.error, classes: 'rounded' }));
    } else { //Update existing user
      this.userService.putUser(form.value).subscribe((res) => {
        this.resetUserForm(form);
        M.toast({ html: "Atualizado com sucesso!", classes: 'rounded' })
      }, (err) => M.toast({ html: err.error, classes: 'rounded' }));
    }
  }

  refreshUserList() {
    this.userService.getUserList(this.page, this.perPage).pipe(
      map((res: UserData) => this.userData = res)
    ).subscribe();
  }

  onEditUser(user: User) {
    user.password = "";
    this.authService.selectedUser = user;
  }

  onDeleteUser(_id: string, form: NgForm) {
    if (confirm('Tem certeza que deseja excluir esse usuário?')) {
      this.userService.deleteUser(_id).subscribe((res) => {
        this.resetUserForm(form);
        M.toast({ html: "Deletado com sucesso!", classes: 'rounded' })
      }, (err) => M.toast({ html: err.error, classes: 'rounded' }));
    }
  }

  searchEmail() {
    if (this.emailSearch == "") {
      this.refreshUserList();
    } else {
      this.userService.searchByEmail(this.emailSearch).pipe(
        map((res: UserData) => this.userData = res)
      ).subscribe();
    }
  }

  onPaginateChange(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.perPage = event.pageSize;

    this.refreshUserList();
  }

  //Orders
  resetOrderForm(form?: NgForm) {
    const defaultValues = {
      _id: "",
      content: "",
      amount: 1,
    };

    if (form) form.reset(defaultValues);

    this.orderService.selectedOrder = defaultValues;
    this.refreshOrderList();
  }

  onSubmitOrder(form: NgForm) {
    if (form.value._id == "") { //Create new order
      this.orderService.postOrder(form.value).subscribe((res) => {
        this.resetOrderForm(form);
        M.toast({ html: "Salvo com sucesso!", classes: 'rounded' })
      }, (err) => M.toast({ html: err.error, classes: 'rounded' }));
    } else { //Update existing order
      this.orderService.putOrder(form.value).subscribe((res) => {
        this.resetOrderForm(form);
        M.toast({ html: "Atualizado com sucesso!", classes: 'rounded' })
      }, (err) => M.toast({ html: err.error, classes: 'rounded' }));
    }
  }

  refreshOrderList() {
    this.orderService.getOrderList().subscribe((res) => {
      this.orderService.orders = res as Order[];
    });
  }

  onEditOrder(order: Order) {
    this.orderService.selectedOrder = order;
  }

  onDeleteOrder(_id: string, form: NgForm) {
    if (confirm('Tem certeza que deseja excluir esse pedido?')) {
      this.orderService.deleteOrder(_id).subscribe((res) => {
        this.resetOrderForm(form);
        M.toast({ html: "Deletado com sucesso!", classes: 'rounded' })
      }, (err) => M.toast({ html: err.error, classes: 'rounded' }));
    }
  }

}
