import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-inputs',
  imports: [CommonModule],
  templateUrl: './inputs.component.html',
  styleUrl: './inputs.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputsComponent),
      multi: true,
    },
  ],
})
export class InputsComponent implements ControlValueAccessor {
  @Input() type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'tel'
    | 'cpf'
    | 'url' = 'text';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() errorMessage: string = '';
  @Input() hasError: boolean = false;
  @Input() icon: string = '';
  @Input() inputId: string = `input-${Math.random().toString(36).substr(2, 9)}`;

  value: string = '';
  showPassword: boolean = false;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  getEyeIcon(): string {
    return this.showPassword ? 'mdi-eye' : 'mdi-eye-closed';
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: any): void {
    let value = event.target.value;

    if (this.type === 'cpf') {
      value = this.formatCPF(value);
      event.target.value = value;

      this.hasError = !this.isValidCPF(value);
    }

    this.value = value;
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouched();
  }

  onFocus(): void {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  getInputType(): string {
    if (this.type === 'password') {
      return this.showPassword ? 'text' : 'password';
    }
    if (this.type === 'cpf') {
      return 'text';
    }
    return this.type;
  }

  formatCPF(value: string): string {
    const numbers = value.replace(/\D/g, '');

    const limitedNumbers = numbers.slice(0, 11);

    if (limitedNumbers.length <= 3) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 6) {
      return limitedNumbers.replace(/(\d{3})(\d+)/, '$1.$2');
    } else if (limitedNumbers.length <= 9) {
      return limitedNumbers.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    } else {
      return limitedNumbers.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        '$1.$2.$3-$4',
      );
    }
  }

  isValidCPF(cpf: string): boolean {
    const numbers = cpf.replace(/\D/g, '');

    if (numbers.length !== 11) {
      return false;
    }

    if (/^(\d)\1{10}$/.test(numbers)) {
      return false;
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.charAt(10))) return false;

    return true;
  }
}
