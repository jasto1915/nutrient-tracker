import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {User} from '../../models/user';

/**
 * Collects the body metrics the daily targets are derived from. Shown until a
 * user exists, which is the only state this app has.
 */
@Component({
  selector: 'app-setup-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './setup-form.component.html',
})

export class SetupFormComponent {
  @Output() submitted = new EventEmitter<User>();

  // Left blank rather than defaulted, so the dropdowns open with nothing chosen
  // and the backend's validation catches a skipped field.
  user: User = {
    name: "",
    age: 0,
    gender: "",
    height: 0,
    weight: 0,
    activityLevel: "",
    goal: "",
  };

  submit(){
    this.submitted.emit(this.user);
  }
}
