import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-new-user',
  imports: [
    CommonModule,
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
      firstname: [null],
      lastname: [null],
      email: [null, Validators.email]
    });
  }

  async onAddUser(): Promise<void> {
    const login = this.userForm.get('login')?.value;
    if (!login) return;
    
    try {
      await firstValueFrom(this.usersService.getUserFromIdentifier('login', login));
      this.userForm.get('login')?.setErrors({ loginTaken: true });
    } catch (error: any) {
      if (error?.status === 404) {
        try {
          await firstValueFrom(this.usersService.addNewUser(this.userForm.value));
          this.dialogRef.close();
        } catch (postError: any) {
          console.error('Failed to add user', postError);
          alert("Echec du POST de l'utilisateur");
        }
      } else {
        console.error('Failed to create user', error);
        alert("Echec de la création de l'utilisateur");
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
