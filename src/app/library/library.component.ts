import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Libraries } from '../model/libraries';
import { LibraryServiceService } from '../Service/library-service.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit, OnDestroy {

  allLibraries: Libraries[] = [];
  isFetching: boolean = false;
  editMode: boolean = false;
  currentLibraryId: string;
  errorMessage: string = null;
  errorSub: Subscription;
  submitted:boolean=false;
  

  BuildingHasError=true;
  floorHasError=true;

  selectMain=false;
  selectHariri=true;


  buildings = ['Main', 'Hariri'];
  mainFloors = ['1','2','3','4','5'];
  haririFloors = ['1','2','3','4','5','6','7','8','9','10','11'];




  @ViewChild('libraryForm') form: NgForm;


  userModel = new Libraries(" "," "," "," "," ");

  constructor(private libraryService: LibraryServiceService){}


  // when main building selected, show main floors only
  selectMainFun(){
    this.selectMain=true;
    this.selectHariri=false;
  }


  // when hariri building selected, show hariri floors only
  selectHaririFun(){
    this.selectHariri=true;
    this.selectMain=false;
  }


  ngOnInit(){

    // get libraries from database on load
    this.fetchLibraries();
    this.errorSub = this.libraryService.error.subscribe((message) => {
      this.errorMessage = message;
    })
  }

  onLibrariesFetch(){
    this.fetchLibraries();
  }


  // submit or update library in database (according to edit mode) 
  onLibraryCreate(library: {libname: string, building: string, floor: string, fromtime:string, totime:string}){
    this.submitted=true;
    if(!this.editMode){
        this.libraryService.createLibrary(library);
        this.libraryService.fetchLibrary();
        this.form.reset();
    }else{
      this.libraryService.updateLibrary(this.currentLibraryId, library);
      this.form.reset();
      this.editMode=false;
    }
  }

  // get libraries from database
  private fetchLibraries(){
    this.isFetching = true;
    this.libraryService.fetchLibrary().subscribe((libraries) => {
      this.allLibraries = libraries;
      this.isFetching = false;
    }, (err) => {
      this.errorMessage = err.message;
    })
  }


  // delete library in database according to id
  onDeleteLibrary(id: string){
    this.libraryService.deleteLibrary(id);
  }

  // delete all libraries in database
  onDeleteAllLibraries(){
    this.libraryService.deleteAllLibraries();
  }


  // when edit button clicked get data from database and display in form
  onEditClicked(id: string){
    this.selectHaririFun();
    this.currentLibraryId = id;

    //Get the library based on the id
    let currentLibrary = this.allLibraries.find((l) => {return l.id === id});

    //Populate the form with the library details
    this.form.setValue({
      libname: currentLibrary.libname,
      building: currentLibrary.building,
      floor: currentLibrary.floor,
      fromtime: currentLibrary.fromtime,
      totime: currentLibrary.totime,
    });

    //Change the button value to update library
    this.editMode = true;
  
   
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }


  //when main is selected, show main floors, if hariri selected, show hariri floors, if none, display error (validation) 
  validateBuilding(value: any){
    if(value === 'Main' ){
      this.BuildingHasError=false;
      this.selectMainFun();
    }else if(value === 'Hariri'){
      this.BuildingHasError=false;
      this.selectHaririFun();
    }else{
      this.BuildingHasError=true;
    }
  }


  // check if floor is selected
  validateFloor(value:any){
    if(value === '1' || value === '2' || value === '3' || value === '4' || value === '5' || value === '6' || value === '7' || value === '8' || value === '9' || value === '10' || value === '11' ){
        this.floorHasError=false;
    }else{
      this.floorHasError=true;
    }
  }

  // cancel edit library 
  canceledit(){
    this.editMode=false;
    this.form.reset();
    this.selectHaririFun();
   
  }

}
