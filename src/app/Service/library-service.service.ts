import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, map, catchError, throwError } from 'rxjs';
import { Libraries } from '../model/libraries';
@Injectable({
  providedIn: 'root'
})
export class LibraryServiceService {

  error = new Subject<string>();
  constructor(private http: HttpClient){

  }

  //Create library in database
  createLibrary(libraries: {libname: string, building: string, floor: string, fromtime:string, totime:string}){
      console.log(libraries);
      const headers = new HttpHeaders({'Library': 'BAULibrary'});
      this.http.post<{name: string}>(
          'https://library-eff58-default-rtdb.firebaseio.com/libraries.json', 
          libraries, {headers: headers})
          .subscribe((res) => {
              console.log(res);
          }, (err) => {
              this.error.next(err.message);
          });
        
  }

  //fetch libraries from database
  fetchLibrary(){
      const header = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')

      const params = new HttpParams()
      .set('print', 'pretty').set('pageNum', 1);
      return this.http.get<{[key: string]: Libraries}>('https://library-eff58-default-rtdb.firebaseio.com/libraries.json', 
      {'headers' : header, params: params})
      .pipe(map((res) => {
          const libraries = [];
          for(const key in res){
              if(res.hasOwnProperty(key)){
                libraries.push({...res[key], id: key})
              }
          }
          return libraries;
      }), catchError((err) => {
          return throwError(err);
      }))
     
  }

  //delete a library from database
  deleteLibrary(id: string){
      let header = new HttpHeaders();
      header = header.append('myHeader1', 'Value1');
      header = header.append('myHeader2', 'Value2');
      this.http.delete('https://library-eff58-default-rtdb.firebaseio.com/libraries/'+id+'.json', {headers: header})
      .subscribe();
  }

  //delete all libraries from database
  deleteAllLibraries(){
      this.http.delete('https://library-eff58-default-rtdb.firebaseio.com/libraries.json')
      .subscribe();
  }

  //edit library in database   
  updateLibrary(id: string, value: Libraries){
      this.http.put('https://library-eff58-default-rtdb.firebaseio.com/libraries/'+id+'.json', value)
      .subscribe();
  
  }
}
