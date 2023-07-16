// Import stylesheets
import './style.css';
import { Observable } from 'rxjs';
import { ajax, AjaxResponse, AjaxRequest, AjaxError } from 'rxjs/ajax';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h1>Gestione DB</h1>`;

var key: string; //assume il valore preso dall'input o dalla generazione della nuova chiave
const URL: string =
  'https://eu-central-1.aws.data.mongodb-api.com/app/kvaas-giwjg/endpoint';
var lista: Array<any>;
document.getElementById('get').addEventListener('click', getValue);
document.getElementById('set').addEventListener('click', setValue);
document.getElementById('new').addEventListener('click', newKey);

function getValue() {
  const obs = ajax({
    method: 'GET',
    url: URL + '/get?key=' + document.getElementById('chiave').value,
    crossDomain: true,
  });
  obs.subscribe({
    next: (res: AjaxResponse<any>) => {
      //dalla chiamata AJAX ottengo la lista in formato JSON
      lista = JSON.parse(res.response); //la trasformo da JSON ad Array di Oggetti e la assegno ad una var globale
      console.log(lista);
    },
    error: (err: AjaxError) => console.error(err.response),
  });
}

function setValue() {
  if (lista == null)
    lista = [
      {
        autore: document.getElementById('author').value,
        titolo: document.getElementById('title').value,
      },
    ];
  else
    lista.push({
      autore: document.getElementById('author').value,
      titolo: document.getElementById('title').value,
    }); //una volta selezionato il Data Base d'interesse, aggiungo gli elementi
  let jsList = JSON.stringify(lista); //ritrasformo da Array[Obj] in JSON per caricarlo sul server con AJAX
  console.log(jsList);
  const obs = ajax({
    method: 'POST',
    url: URL + '/set?key=' + document.getElementById('chiave').value,
    crossDomain: true,
    body: jsList,
  });
  obs.subscribe({
    next: (res: AjaxResponse<any>) => {
      document.getElementById('result').innerHTML = ' Caricato con successo!';
    },
    error: (err: AjaxError) =>
      (document.getElementById('result').innerHTML =
        'Errore nel caricamento: ' + err.response),
  });
}

function newKey() {
  //richiesta per una nuova chiave DB
  const obs = ajax({
    method: 'GET',
    url: URL + '/new?secret=ssw2022',
    crossDomain: true,
  });
  obs.subscribe({
    next: (res: AjaxResponse<any>) => {
      key = res.response;
      document.getElementById('valore').innerHTML = key;
    },
    error: (err: AjaxError) => console.error(err.response),
  });
}
/*Codici DB:
77a2224b
0cce527a
98510c87
c34185c1*/
