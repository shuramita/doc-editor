import Module from 'quill/core/module';
import axios from 'axios';

class GoogleDoc extends  Module{

    constructor(quill, options) {
        super(quill, options);
        this.options = options;
        // console.log(this.options)
        const toolbar = this.quill.getModule('toolbar');
        toolbar.addHandler('google-doc',this.updateEditorFromGoogleDoc.bind(this));
        console.log('GoogleDoc: adding handler with key "google-doc"',this.updateEditorFromGoogleDoc);
        let toolbarButtons = document.getElementsByClassName('ql-google-doc');

        if (toolbarButtons) {
            [].slice.call( toolbarButtons ).forEach( ( toolbarButton )=> {
                toolbarButton.innerHTML = this.options.buttonIcon;
            });
        }
    }

    getHTMLDocContent(){
        let api = this.options.converterApi;
        return axios.get(`${api}/${this.options.docId}`);
    }
    updateEditorFromGoogleDoc(){
        console.log("GoogleDoc: get content from google doc cloud with Id",this.options.docId);
        this.getHTMLDocContent()
            .then(content=>{
                console.log(content);
                let domParser = new DOMParser();
                let doc = domParser.parseFromString(content.data, 'text/html');
                console.log(doc);
                let style = doc.querySelector('style');
                document.getElementById('externalStyle').innerHTML = '';
                document.getElementById('externalStyle').appendChild(style);
                this.quill.getModule('clipboard').dangerouslyPasteHTML(doc.querySelector('body').innerHTML);
            })
    }
}
GoogleDoc.DEFAULTS = {
    converterApi:'/api/doc',
    buttonIcon: '<?xml version="1.0" encoding="UTF-8"?>' +
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="48px" height="48px" viewBox="0 0 48 48" version="1.1">' +
        '<g id="surface225007">' +
        '<path style=" stroke:none;fill-rule:nonzero;fill:rgb(12.941176%,58.823529%,95.294118%);fill-opacity:1;" d="M 37 45 L 11 45 C 9.34375 45 8 43.65625 8 42 L 8 6 C 8 4.34375 9.34375 3 11 3 L 30 3 L 40 13 L 40 42 C 40 43.65625 38.65625 45 37 45 Z M 37 45 "/>' +
        '<path style=" stroke:none;fill-rule:nonzero;fill:rgb(73.333333%,87.058824%,98.431373%);fill-opacity:1;" d="M 40 13 L 30 13 L 30 3 Z M 40 13 "/>' +
        '<path style=" stroke:none;fill-rule:nonzero;fill:rgb(8.235294%,39.607843%,75.294118%);fill-opacity:1;" d="M 30 13 L 40 23 L 40 13 Z M 30 13 "/>' +
        '<path style=" stroke:none;fill-rule:nonzero;fill:rgb(89.019608%,94.901961%,99.215686%);fill-opacity:1;" d="M 15 23 L 33 23 L 33 25 L 15 25 Z M 15 27 L 33 27 L 33 29 L 15 29 Z M 15 31 L 33 31 L 33 33 L 15 33 Z M 15 35 L 25 35 L 25 37 L 15 37 Z M 15 35 "/>' +
        '</g>' +
        '</svg>'
};
export {GoogleDoc as default}