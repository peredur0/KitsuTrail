import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-new-user',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions
  ],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.scss'
})
export class NewUserComponent implements OnInit{
  userForm!: FormGroup;

  readonly dialogRef = inject(MatDialogRef<NewUserComponent>);
  private formBuilder = inject(FormBuilder);
  private usersService = inject(UsersService);

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      login: [null, Validators.required],
      firstname: [''],
      lastname: [''],
      email: ['', Validators.email]
    });
  }

  onAddUser(): void {
    console.log('On ajoute un utilisateur');
    console.log(this.userForm.value)
    this.dialogRef.close();
  }

  onNoClick(): void {
    console.log("No click ou annulé");
    this.dialogRef.close();
  }
}
