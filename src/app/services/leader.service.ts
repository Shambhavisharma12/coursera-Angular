import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import { of } from 'rxjs';
import { delay } from 'rxjs/Operators'; 
import { Observable} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { baseURL } from '../shared/baseurl';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';


@Injectable({
  providedIn: 'root'
})
export class LeaderService {
  constructor(private http:HttpClient , private processHTTPMsgService:ProcessHTTPMsgService) { }

  getLeader(): Observable<Leader[]> {
   /*return new Promise(resolve=>{ setTimeout(()=>resolve(LEADERS),2000);
    });*/
    return this.http.get<Leader[]>(baseURL+'leadership').pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getleader(id:string):Observable<Leader>{
    /* return new Promise(resolve=>{ setTimeout(()=>resolve(PROMOTIONS.filter((promo)=>(promo.id === id))[0]),2000);
     });*/
     return this.http.get<Leader>(baseURL+'leadership/'+id).pipe(catchError(this.processHTTPMsgService.handleError))
    }
 
  getFesturedLeader():Observable<Leader>{
    /*return new Promise(resolve=>{ setTimeout(()=>resolve(LEADERS.filter((leader)=>leader.featured)[0]),2000);
    })*/
    return this.http.get<Leader[]>(baseURL+ 'leadership?featured=true').pipe(map(leaders=>leaders[0]))
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  
}
