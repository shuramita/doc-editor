import Quill from 'quill';
const Module = Quill.import('core/module');
import FieldBlot from '../formats/FieldBlot';
import FieldBlotToolTip from '../ui/FieldBlotToolTip';
Quill.register({
    'formats/field': FieldBlot,
}, true);

class Field extends  Module{
    // tokenRgx ='(\\{\\{.*?\\}\\})';


    constructor(quill, options) {
        super(quill, options);
        this.editor = quill;
        // this.options = options;
        this.container = document.querySelector(options.container);
        this.tokenRgx = new RegExp('(\\{\\{.*?\\}\\})','g');
        this.toolbar = this.editor.getModule('toolbar');
        // console.log(this.toolbar);
        // this.toolbar.addHandler('thread', this.showCommandThread);

        let qlFieldScanButtons = document.querySelectorAll('.ql-field-scan');
        if (qlFieldScanButtons) {
            [].slice.call( qlFieldScanButtons ).forEach( ( qlFieldScanButton ) =>{
                console.log('Field: register scan event for toolbar button');
                qlFieldScanButton.innerHTML = options.scanIcon;
                qlFieldScanButton.addEventListener('click',()=>{
                    let tokens = this.scanTokens();
                    tokens.forEach(token=>{
                        console.log(token);
                        token.indices.forEach(index=>{
                            // this.quill.formatText(index,token.token.length,{'field':{name:token.token,type:'string'}})
                        })

                    })
                });
            });
        }
        // console.log('FIELDS',fields);
        this.editor.on('text-change',this.handleFieldChange.bind(this));
        this.tooltip = new FieldBlotToolTip(quill,this.options.bounds);
        console.log('Field Module: constructor tooltip', this.tooltip);
        // this.tooltip.show();
        document.addEventListener('click',(e)=>{
            if(e.target && e.target.nodeName === FieldBlot.tagName){

                console.log('Field Module: field click');
                let data = Quill.find(e.target).formats().field;
                data.offsetTop = e.target.offsetTop;
                data.top = `${e.target.offsetTop}px`;
                data.title = this.options.fields[data.name].title;
                this.tooltip.showEditingField(data, this);
                this.editor.emitter.emit('field-click',data,this.tooltip);
            }
        });
    }
    handleFieldChange(delta, oldDelta, source){
        let range = this.editor.getSelection();
        if(range) {
           let [blot,offset] =  this.editor.getLeaf(range.index);

           if(blot.parent instanceof FieldBlot) {
               // get blot the present the field
               let fieldBlot = blot.parent;
               let field = fieldBlot.formats().field;
               field.data = fieldBlot.domNode.innerText;
               // trigger event
               this.editor.emitter.emit('field-change', field);
               // update other fields same type in document
               this.updateFieldsValue(field.name,field.data,this.editor.getIndex(fieldBlot));
           }
        }
    }

    updateFieldsValue(fieldName,value, excepts=-1){
        console.log(fieldName);
        let fieldNodes = document.querySelectorAll(`${FieldBlot.tagName}[name=${fieldName}]`);
        // TODO: it has problem with cursor when update multiple place,
        if(fieldNodes) {
            [].slice.call(fieldNodes).forEach((fieldNode)=>{
                console.log('Field Module:', fieldNode);
                let fieldBlot = Quill.find(fieldNode);
                console.log('Field Module:', fieldBlot);
                let blotIndex = this.editor.getIndex(fieldBlot);
                console.log('Field Module:  blot index at', blotIndex);
                if(blotIndex !== excepts) {
                    if(value == '') {
                        fieldBlot.domNode.innerText = ' ';
                    }else{
                        fieldBlot.domNode.innerText = value;
                    }
                }

            })
        }
    }
    getFields(){
        return this.options.fields;
    }
    scanFields(){
        let fieldNodes = document.querySelectorAll(`${FieldBlot.tagName}[class=${FieldBlot.className}]`);
        let fields = {};
        let fieldTypes = [];
        if(fieldNodes) {
            [].slice.call(fieldNodes).forEach((fieldNode)=>{
                let fieldBlot = Quill.find(fieldNode);
                let format = fieldBlot.formats().field;
                console.log('Field Module:', format);
                if(fieldTypes.indexOf(format.name) === -1) {
                    fields[format.name] = format;
                    fieldTypes.push(format.name);
                }
            })
        }
        return fields;
    }
    /*
       This function using to scan all definition of token with regular express
    * */
    scanTokens(regx = null){
        regx = regx || this.tokenRgx;
        let totalText = this.quill.getText();
        // ES 6
        let allFoundTokens = totalText.match(regx);
        console.log('Field: detected tokens',allFoundTokens);
        let fields = [];
        if(allFoundTokens) {
            let tokens = [...new Set(allFoundTokens)];
            console.log('Field: all scanned fields',tokens);
            tokens.forEach(token=>{
                fields.push({
                    token: token,
                    indices: this.getIndicesOf(totalText,token)
                })

            })
            console.log('Field: all scanned fields', fields);
            return fields;
        }


    }

    getIndicesOf(str, searchStr) {
        let searchStrLen = searchStr.length;
        let startIndex = 0,
            index,
            indices = [];
        while (
            (index = str.toUpperCase().indexOf(searchStr.toUpperCase(), startIndex)) >
            -1
            ) {
            indices.push(index);
            startIndex = index + searchStrLen;
        }
            console.log('Field:',indices);
        return indices;
    }
    static getFieldFromDocument(name){
        let fieldNodes = document.querySelectorAll(`${FieldBlot.tagName}[class=${FieldBlot.className}]`);
        for(let i=0;i<fieldNodes.length;i++) {
            let fieldNode = fieldNodes[i];
            let fieldBlot = Quill.find(fieldNode);
            let format = fieldBlot.formats().field;
            if(format.name === name) {
               return  format;
            }
        }
    }
    static getField(name){
        let option = document.querySelector(`option[value=${name}]`);
        console.log('static getField(name)',option.dataset.field);
        if(option) return JSON.parse(option.dataset.field);
    }

}
Field.DEFAULTS = {
    buttonIcon: '<svg viewbox="0 0 18 18"><circle class="ql-fill" cx="7" cy="7" r="1"></circle><circle class="ql-fill" cx="11" cy="7" r="1"></circle><path class="ql-stroke" d="M7,10a2,2,0,0,0,4,0H7Z"></path><circle class="ql-stroke" cx="9" cy="9" r="6"></circle></svg>',
    scanIcon:'<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="qrcode" class="svg-inline--fa fa-qrcode fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M0 224h192V32H0v192zM64 96h64v64H64V96zm192-64v192h192V32H256zm128 128h-64V96h64v64zM0 480h192V288H0v192zm64-128h64v64H64v-64zm352-64h32v128h-96v-32h-32v96h-64V288h96v32h64v-32zm0 160h32v32h-32v-32zm-64 0h32v32h-32v-32z"></path></svg>'
};
export {Field as default}