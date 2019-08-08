import Quill from 'quill';
import InsertBlot from "../formats/InsertBlot";
import DeleteBlot from "../formats/DeleteBlot";
const Delta = Quill.import('delta');
const Module = Quill.import('core/module');
Quill.register({
    'formats/ins':InsertBlot,
    'formats/del':DeleteBlot,
}, true);
class TrackChange extends  Module{
    constructor(quill, options) {
        super(quill, options);
        this.editor = quill;
        this.options = options;
        this.user = this.getUser();
        this.editor.on('text-change',this.applyTrackChange.bind(this));
        this.changes = [
            'insert',
            'delete'
        ];
        this.format = {
            insert:{
                blot:'ins',
            },
            delete:{
                blot:'ins'
            }
        }
        let toolbarButtons = document.getElementsByClassName('ql-trackChange');

        if (toolbarButtons) {
            [].slice.call( toolbarButtons ).forEach( ( toolbarButton )=> {
                toolbarButton.innerHTML = this.options.buttonIcon;
            });
        }
    }
    getUser(){
        return this.options.user;
    }
    applyTrackChange(delta, oldContents, source){
        if(!this.options.enabled || source === 'silent' ) return;
        // TODO: Sometime we must find a signal from the change to see that should apply the change or not?
        let changeType = this.inHandledChanges(delta);
        if( changeType !== '') {
            console.log('TrackChange: Start apply the change into doc',delta);
            // code block
            let change = this.getChange(delta,oldContents,source);
            console.log('TrackChange: The change that will be applied',change)
            switch(changeType) {
                case 'insert':
                    this.quill.formatText(change.index,change.length,{ins:true},'silent');
                    break;
                case 'delete':
                    // code block

                    if(change.changeDelta) {
                        let retainDelta = new Delta().retain(change.index)
                        const changeDelta =  retainDelta.concat(change.changeDelta); //.retain(change.index);

                        console.log('TrackChange: Change delta before apply del blot', changeDelta );
                        changeDelta.map((ch,key)=>{
                            if(changeDelta.ops[key]['insert']) {
                                changeDelta.ops[key].attributes = changeDelta.ops[key].attributes || {};
                                changeDelta.ops[key].attributes.del = true;
                            }
                            // change.changeDelta.ops[key] = ch;
                            // return ch;
                        })
                        // change.changeDelta.ops.attributes.del = true;
                        console.log('TrackChange: Let see how the delta look like', changeDelta );
                        this.quill.updateContents(changeDelta,'silent');
                    }

                    break;
                default:
                // code block
            }

        }
    }
    inHandledChanges(delta){
        let handledChange  = '';
        this.changes.map((value)=>{
            if(delta.ops && delta.ops.length > 1 && delta.ops[1].hasOwnProperty(value)) {
                handledChange = value;
            }
        });
        return handledChange;
    }
    getFormat(value){
            return this.format[value];
    }
    getChange(delta,oldContents,source){
        console.log('TrackChange: Find the text that added or deleted from old content:',oldContents);
        let text = '';
        let changeDelta = new Delta();
        switch(this.inHandledChanges(delta)) {
            case 'insert':
                // code block
                text = delta.ops[1].insert
                // this.quill.format()
                break;
            case 'delete':
                // code block
                // let base = new Delta(JSON.parse(JSON.stringify(oldContents.ops)));
                // let change =  new Delta(JSON.parse(JSON.stringify(delta.ops)));
                // const inverted = change.invert(base);
                //https://github.com/quilljs/delta/#slice
                changeDelta = oldContents.slice(delta.ops[0].retain, delta.ops[0].retain + delta.ops[1].delete);
                console.log('TrackChange: inverted delta ',changeDelta);
                text = changeDelta.ops[0].insert;
                break;
            default:
            // code block
        }
        let change = {
            index: delta.ops[0].retain,
            text:text,
            length:text.length,
            changeDelta: changeDelta
        }
        return change
    }
    toggleEnabled(){
        this.options.enabled = !this.options.enabled;
    }
}

TrackChange.DEFAULTS = {
    buttonIcon: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-notch" class="svg-inline--fa fa-circle-notch fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M288 39.056v16.659c0 10.804 7.281 20.159 17.686 23.066C383.204 100.434 440 171.518 440 256c0 101.689-82.295 184-184 184-101.689 0-184-82.295-184-184 0-84.47 56.786-155.564 134.312-177.219C216.719 75.874 224 66.517 224 55.712V39.064c0-15.709-14.834-27.153-30.046-23.234C86.603 43.482 7.394 141.206 8.003 257.332c.72 137.052 111.477 246.956 248.531 246.667C393.255 503.711 504 392.788 504 256c0-115.633-79.14-212.779-186.211-240.236C302.678 11.889 288 23.456 288 39.056z"></path></svg>'
};
export {TrackChange as default}