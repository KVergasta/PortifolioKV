import { Canal } from "./canal.enum";
import { StatusNotificacao } from "./statusNotificacao.enum";

export interface NotificacaoEntity {
  id?: string;
  title?: string;
  message?: string;
  infoUser?: string;
  status?: StatusNotificacao;
  type?: Canal;
  userIp?: string;
  date?: string
}
