import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ContatoService } from 'src/domain/contatoService.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificacaoEntity } from 'src/domain/notificacao.model';
import { Canal } from 'src/domain/canal.enum';


@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {

    formEmail: FormGroup;


  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private notifcacao: ContatoService) {
      this.formEmail = this.fb.group({
        infoUser:['kauvergasta12@gmail.com', Validators.required],
        subject:['', Validators.required],
        message:['', Validators.required]
      })
     }

  ngOnInit(): void {
  }

  notificar(){
    console.log('o formulário está invalido?: '+ this.formEmail.valid)
    if(this.formEmail.valid){

      const email: NotificacaoEntity = {
        title: this.formEmail.get('subject')?.value,
        infoUser: this.formEmail.get('infoUser')?.value,
        message: this.formEmail.get('message')?.value,
        type: Canal.EMAIL,
      }

            this.notifcacao.generatorEmail(email)
      .subscribe({
        next:(response)=> {console.log("Email is sent", response);
          this.formEmail.reset();
          this.formEmail.patchValue({
          infoUser: 'kauvergasta12@gmail.com'
      });
        }, error: (error) => {console.error("Error",error)}
      });
    }
  }

}
