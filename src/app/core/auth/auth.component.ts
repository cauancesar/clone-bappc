import { Component, OnInit } from '@angular/core';
import { Errors } from '../models/errors.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ListErrorsComponent } from "../../shared/components/list-errors/list-errors.component";
import { CommonModule } from '@angular/common';
import { InputsComponent } from '../../shared/components/inputs/inputs.component';
import { CustomSelectComponent, SelectOption } from '../../shared/components/select-inputs/select-inputs.component';
import { ButtonsComponent } from '../../shared/components/buttons/buttons.component';

enum AuthType {
  LOGIN = 'login',
  REGISTER = 'register'
}

export interface AuthForm {
  email: FormControl<string>
  senha: FormControl<string>
  cpf?: FormControl<string>
  servidor?: FormControl<string>
  user?: FormControl<string>
}

@Component({
  selector: 'app-auth',
  imports: [RouterLink, ReactiveFormsModule, ListErrorsComponent, CommonModule, InputsComponent, CustomSelectComponent, ButtonsComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {
  authType: AuthType | '' = ''
  title = ''
  errors: Errors = { errors: {}}
  isSubmitting = false
  authForm: FormGroup<AuthForm>
  servers: SelectOption[] = [
    { value: 'Global', label: 'Global' },
    { value: 'Japão', label: 'Japão' },
    { value: 'Ásia', label: 'Ásia' },
    { value: 'Coreia', label: 'Coreia' }
  ]

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.authForm = new FormGroup<AuthForm> ({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      senha: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
        nonNullable: true,
      }),
    })
  }

  ngOnInit(): void {
    this.authType = this.route.snapshot.url.at(-1)!.path as AuthType
    this.title = this.authType === AuthType.LOGIN ? 'Entrar' : 'Cadastrar-se'
    if (this.authType === AuthType.REGISTER) {
      this.authForm.addControl(
        'cpf',
        new FormControl('', {
          validators: [Validators.required],
          nonNullable: true,
        }),
      )
      this.authForm.addControl(
        'servidor',
        new FormControl('', {
          validators: [Validators.required],
          nonNullable: true,
        }),
      )
      this.authForm.addControl(
        'user',
        new FormControl('', {
          validators: [Validators.required],
          nonNullable: true,
        }),
      )
    }
  }

  submitForm(): void {
    console.log('Form submitted:', this.authForm.value);
  }
}
