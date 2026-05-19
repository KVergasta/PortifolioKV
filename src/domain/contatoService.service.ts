import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NotificacaoEntity } from "./notificacao.model";

@Injectable({
  providedIn: 'root'
})
export class ContatoService{
  private readonly API ='http://localhost:8000/api/notification';

  constructor(
    private http: HttpClient,
  ){}


  generatorEmail(notificacao: NotificacaoEntity) : Observable<any>{
    return this.http.post<any>(`${this.API}/mail`, notificacao)
  }

}
