import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export type ButtonType = 'confirm'
export type ButtonSize = 'small' | 'medium' | 'large';
const COLORS = {
  black: '#000',
  white: '#fff',
}

@Component({
  selector: 'app-buttons',
  imports: [CommonModule],
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonsComponent {
  @Input() type: ButtonType = 'confirm';
  @Input() htmlType = 'button'
  @Input() label: string = '';
  @Input() size: ButtonSize = 'medium';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() outline: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() icon?: string;
  @Input() iconPosition: 'left' | 'right' = 'left';

  @Output() buttonClick = new EventEmitter<Event>();

  get buttonClasses(): string {
    const classes = [
      'btn',
      `btn-${this.size}`,
      this.outline ? 'btn-outline' : '',
      this.fullWidth ? 'btn-full-width' : '',
      this.disabled ? 'btn-disabled' : '',
      this.loading ? 'btn-loading' : '',
    ];

    return classes.filter((cls) => cls).join(' ');
  }

  get customStyles(): { [key: string]: string } {
    const styles: { [key: string]: string } = {}

    if (this.type === 'confirm') {
      styles['background-color'] = COLORS.white
      styles['color'] = COLORS.black
    }

    return styles
  }

  onClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit(event);
    }
  }
}
