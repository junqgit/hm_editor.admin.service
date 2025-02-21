import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core'
import {environment} from '../../../environments/environment';

@Component({
  selector: 'editor-wrapper',
  templateUrl: './editor-wrapper.component.html',
  styleUrls: ['./editor-wrapper.css']
})
export class EditorWrapperComponent implements OnInit{


  @Input() intEditorUrl:string;

  ngOnInit(): void {

    if(this.intEditorUrl) {
      let iframe = <HTMLIFrameElement>this.editorFrame.nativeElement;
      iframe.contentWindow.location.href =this.editorUrl+ this.intEditorUrl;
    }

  }
  @Input() editorDisplay: boolean;
  @Output() editorDisplayChange=new EventEmitter();

  @ViewChild('editorFrame')
  editorFrame: ElementRef;
  editorUrl: string = environment.editorUrl;

  setEditorUrl(url: string) {
     let iframe = <HTMLIFrameElement>this.editorFrame.nativeElement;
     iframe.contentWindow.location.href =this.editorUrl+ url;
  }

  editorWrapperStyle: string = "editorWrapper";
  changeEditorWrapperHeight(){
    if(this.editorWrapperStyle=="editorWrapper"){
      this.editorWrapperStyle = "editorWrapper-fullScreen";
    }else{
      this.editorWrapperStyle = "editorWrapper";
    }

  }
}
