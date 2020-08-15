import { Injectable } from '@angular/core';
import {Promotion} from '../shared/promotion';
import {PROMOTIONS} from '../shared/promotions';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { map, catchError } from 'rxjs/operators';
import { Observable} from 'rxjs';
import { baseURL } from '../shared/baseurl';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class PromotionsService {

  constructor(private http:HttpClient , private processHTTPMsgService:ProcessHTTPMsgService) { }

  getPromotions(): Observable<Promotion[]> {
  /* return new Promise(resolve=>{
      setTimeout(()=>resolve(PROMOTIONS),2000);
    });*/
    return this.http.get<Promotion[]>(baseURL+'promotions').pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getPromotion(id:string):Observable<Promotion>{
   /* return new Promise(resolve=>{ setTimeout(()=>resolve(PROMOTIONS.filter((promo)=>(promo.id === id))[0]),2000);
    });*/
    return this.http.get<Promotion>(baseURL+'promotions/'+id).pipe(catchError(this.processHTTPMsgService.handleError))


  }
  getFeaturedPromotion(): Observable<Promotion>{
   /* return new Promise(resolve=>{ setTimeout(()=>resolve(PROMOTIONS.filter((promo)=>promo.featured)[0]),2000);
    });*/
    return this.http.get<Promotion[]>(baseURL+ 'promotions?featured=true').pipe(map(promotions=>promotions[0]))
    .pipe(catchError(this.processHTTPMsgService.handleError));
   // return of(PROMOTIONS.filter((promo)=>promo.featured)[0]).pipe(delay(2000));

  }
}
