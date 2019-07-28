import Quill from 'quill';
const Module = Quill.import('core/module');
import FieldBlot from '../formats/FieldBlot';
import FieldBlotToolTip from '../ui/FieldBlotToolTip';

class Field extends  Module{
    constructor(quill, options) {
        super(quill, options);
        this.editor = quill;
        this.options = options;
        this.container = document.querySelector(options.container);
        // this.toolbar = quill.getModule('toolbar');
        // console.log(this.toolbar);
        // this.toolbar.addHandler('thread', this.showCommandThread);

        // let qlFields = document.querySelectorAll('.ql-field option');
        // if (qlFields) {
        //     [].slice.call( qlFields ).forEach(function ( qlField ) {
        //
        //     });
        // }
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
Comment.DEFAULTS = {
    buttonIcon: '<svg viewbox="0 0 18 18"><circle class="ql-fill" cx="7" cy="7" r="1"></circle><circle class="ql-fill" cx="11" cy="7" r="1"></circle><path class="ql-stroke" d="M7,10a2,2,0,0,0,4,0H7Z"></path><circle class="ql-stroke" cx="9" cy="9" r="6"></circle></svg>'
};
export {Field as default}