import Quill from 'quill';
const Delta = Quill.import('delta');
const Module = Quill.import('core/module');

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
            if(delta.ops && delta.ops[1].hasOwnProperty(value)) {
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
}

export {TrackChange as default}