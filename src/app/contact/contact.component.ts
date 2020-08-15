import { Component, OnInit ,ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType} from '../shared/feedback';
import { visibility, flyInOut,expand } from '../animations/app.animation';
import {  FeedbackService } from '../services/feedback.service';
import { FEEDBACK } from '../shared/feedbacks';



@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      visibility(),
      expand(),
    ]
})
export class ContactComponent implements OnInit {

  @ViewChild('fform') feedbackFormDirective;

  feedBackForm: FormGroup;
  feedBack:Feedback;
  feedbackcopy: null;
  formStatus: Object = {
    sent: false,
    dataSent: null,
    hasError: false,
    errorMessage: null
};
  contactType=ContactType;
  errMess: string;
  loader:boolean;
  visibility = 'shown';
  
  constructor(private fb:FormBuilder,private feedbackservice:FeedbackService) {
    this.createForm();
   }


   formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };





  ngOnInit() {
    
  }
  createForm(): void{
    this.feedBackForm=this.fb.group({
      firstname:['',[Validators.required, Validators.minLength(2),Validators.maxLength(25)]],
      lastname:['',[Validators.required, Validators.minLength(2),Validators.maxLength(25)]],
      telnum:['',[Validators.required, Validators.pattern]],
      email:['',[Validators.required, Validators.email]],
      agree:false,
      contacttype:'None',
      message:'',

    });

    
    this.feedBackForm.valueChanges.subscribe(data=>this.onValueChanged(data));
    this.onValueChanged();
  }
  onSubmit(){
    this .formStatus[ 'sent' ] = true;
    this.feedBack=this.feedBackForm.value;
    console.log(this.feedBack);
   
    this.feedBackForm.reset({
      firstname:'',
      lastname:'',
      telnum:'',
      email:'',
      agree:false,
      contacttype:'None',
      message:''
    });
    this.feedbackFormDirective.resetForm();
   /* this.feedbackservice.submitFeedback(this.feedBack).subscribe(
      feedBack=>{this.feedbackcopy;
        console .log( 'POST Request is successful ', this .feedBack );
      }
    )*/
  
   setTimeout( () => {
      this.feedbackservice.submitFeedback(this.feedBack).subscribe(
        feedback=>{
          console .log( 'POST Request is successful ', this .feedBack );
          this .formStatus[ 'dataSent' ] = this .feedBack;

          setTimeout( () => {
            this .formStatus[ 'sent' ] = false;
            this .formStatus[ 'hasError' ] = false;
            this .formStatus[ 'dataSent' ] = null;
        }, 2500 );

    },
    error => {
        this .feedBack = null;
        this .formStatus[ 'hasError' ] = true;
        this .formStatus[ 'errorMessage' ] = <any>error;

        if( this .formStatus[ 'hasError' ] ) {
            setTimeout( () => {
                this .formStatus[ 'sent' ] = false;
                this .formStatus[ 'hasError' ] = false;
            }, 2500 );
        }
    }
      )
  },2500)
}

  
  onValueChanged(data?: any) {
    if (!this.feedBackForm) { return; }
    const form = this.feedBackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
    

}
