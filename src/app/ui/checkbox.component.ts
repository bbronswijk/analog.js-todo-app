import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-checkbox',
  template: `
    <div class="rounded-full bg-gradient-to-br h-6 w-6 duration-200 flex justify-center items-center cursor-pointer hover:from-check-start hover:to-check-end"
         [class.from-check-start]="value()"
         [class.to-check-end]="value()"
         [class.bg-border]="!value()"
         (click)="toggle()">
      <span class="border border-border absolute rounded-full h-6 w-6 hover:h-5 hover:w-5 hover:border-none flex justify-center items-center"
        [class.bg-card]="!value()">
        @if (value()) {
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9">
            <path fill="none" stroke="#FFF" stroke-width="2" d="M1 4.304L3.696 7l6-6"/>
          </svg>
        }
      </span>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CheckboxComponent,
      multi: true,
    },
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    NgClass
  ]
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() public class = '';

  public value = signal(false);

  /** Register the local onChange methods. */
  public onChange = (value: boolean): void => {};
  public onTouched = (): void => {};

  /** Function to allow angular to register the change method. */
  public registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  /** Function to allow angular to register the touched method. */
  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /** Toggle the form value. */
  public toggle(): void {
    this.value.update(value => !value);
    this.onChange(this.value())
  }

  /** Allow the angular form to be filled from the parent component. */
  public writeValue(value: boolean): void {
    this.value.set(value);
  }
}
