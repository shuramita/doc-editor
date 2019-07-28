import Quill from "quill";

const ToolTip = Quill.import('ui/tooltip');
class FieldBlotToolTip extends ToolTip {
    constructor(quill, boundsContainer) {
        super(quill,boundsContainer);
        this.editor = quill;
        this.root.classList.add('ql-field-tooltip');
        let input = this.root.querySelector('input');
        let updateAction = this.root.querySelector('a[type=submit]');
        updateAction.addEventListener('click',(e)=>{
            console.log('update fields');
            let fieldData = JSON.parse(input.dataset.field);
            console.log(fieldData);
            this.editor.getModule('field').updateFieldsValue(fieldData.name,input.value);
            // this.editor.emitter.emit()
            fieldData.data = input.value;
            console.log(fieldData);
            this.editor.emitter.emit('field-change', fieldData);
            this.hide();
            // this.editor.enable(true);
        });
    }
    showEditingField(data ){
        // this.editor.enable(false);
        console.log(this);
        //
        let input = this.root.querySelector('input');
        input.value = data.data;
        input.setAttribute('data-field',JSON.stringify(data));
        let selection = this.editor.getSelection();
        console.log(selection);
        let bound = this.editor.getBounds(selection.index);
        let label = this.root.querySelector('div[class=label]');
        label.innerText = data.title;
        // this.root.style('margin-bottom',bound.bottom+'px');
        console.log(bound);
        this.root.style.top =  data.top;
        this.root.style.left = Math.sqrt(bound.left * bound.left) +'px';
        input.focus();


    }

}
FieldBlotToolTip.TEMPLATE = `
 <div class="form-group">
        <div class="label"></div>
        <input class="form-control">
        <a type="submit" class="btn btn-primary mb-2 ql-action"></a>
    </div>    `;
export default FieldBlotToolTip;