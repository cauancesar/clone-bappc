import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-inputs.component.html',
  styleUrls: ['./select-inputs.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true
    }
  ]
})
export class CustomSelectComponent implements ControlValueAccessor {
  @Input() options: SelectOption[] = [];
  @Input() label: string = '';
  @Input() placeholder: string = 'Selecione uma opção';
  @Input() disabled: boolean = false;
  @Input() errorMessage: string = '';
  @Input() hasError: boolean = false;
  @Input() icon: string = '';
  @Input() selectId: string = `select-${Math.random().toString(36).substr(2, 9)}`;
  @Input() allowClear: boolean = false;

  value: any = null;
  isOpen: boolean = false;
  highlightedIndex: number = -1;
  selectedOption: SelectOption | null = null;

  private onChange = (value: any) => {};
  private onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
    this.selectedOption = this.options.find(option => option.value === value) || null;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleDropdown(): void {
    if (this.disabled) return;

    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.highlightedIndex = this.selectedOption ? this.getOptionIndex(this.selectedOption) : 0;

      setTimeout(() => {
        document.addEventListener('click', this.closeDropdown.bind(this));
      });
    } else {
      document.removeEventListener('click', this.closeDropdown.bind(this));
    }
  }

  closeDropdown(event?: Event): void {
    if (event && event.target) {
      const target = event.target as HTMLElement;
      if (target.closest('.select-container')) {
        return;
      }
    }

    this.isOpen = false;
    this.onTouched();
    document.removeEventListener('click', this.closeDropdown.bind(this));
  }

  selectOption(option: SelectOption): void {
    if (option.disabled) return;

    this.value = option.value;
    this.selectedOption = option;
    this.onChange(this.value);
    this.closeDropdown();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!this.isOpen) {
          this.toggleDropdown();
        } else if (this.highlightedIndex >= 0) {
          const option = this.options[this.highlightedIndex];
          if (option && !option.disabled) {
            this.selectOption(option);
          }
        }
        break;

      case 'Escape':
        this.closeDropdown();
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen) {
          this.toggleDropdown();
        } else {
          this.highlightNext();
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (this.isOpen) {
          this.highlightPrevious();
        }
        break;
    }
  }

  highlightNext(): void {
    const availableOptions = this.options.filter(option => !option.disabled);
    if (availableOptions.length === 0) return;

    let nextIndex = this.highlightedIndex + 1;
    if (nextIndex >= this.options.length) {
      nextIndex = 0;
    }

    while (this.options[nextIndex]?.disabled && nextIndex < this.options.length - 1) {
      nextIndex++;
    }

    this.highlightedIndex = nextIndex;
  }

  highlightPrevious(): void {
    const availableOptions = this.options.filter(option => !option.disabled);
    if (availableOptions.length === 0) return;

    let prevIndex = this.highlightedIndex - 1;
    if (prevIndex < 0) {
      prevIndex = this.options.length - 1;
    }

    while (this.options[prevIndex]?.disabled && prevIndex > 0) {
      prevIndex--;
    }

    this.highlightedIndex = prevIndex;
  }

  getOptionIndex(option: SelectOption): number {
    return this.options.findIndex(opt => opt.value === option.value);
  }

  trackByValue(index: number, option: SelectOption): any {
    return option.value;
  }

  clearSelection(): void {
    this.value = null;
    this.selectedOption = null;
    this.onChange(null);
  }
}
