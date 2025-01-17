import {Component, input} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FormsModule} from '@angular/forms';
import {DatabaseService} from './database.service';
import {ExternalAPIService} from './external-api.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  text = 'DeepNeuron-OnHit-Stage2';
  textInput = "";

  constructor(private db: DatabaseService, private extapi: ExternalAPIService) {
  }

  sendInput(){
    let data = {text:this.textInput};

    this.extapi.parseLanguage(data).subscribe((data:any) => {
      this.text = data
      console.log(data)
    })

   }
}
