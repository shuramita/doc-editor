import Quill from 'quill';
const Module = Quill.import('core/module');
import * as moment from 'moment';

class Comment extends  Module{

    constructor(quill, options) {
        super(quill, options);
        this.editor = quill;
        this.options = options;
        // console.log(options);
        this.startTime = moment();
        this.userModule = quill.getModule('user');
        if(this.userModule) {
            this.user = this.userModule.getUser();
            console.log('Comment run with authenticated user',this.user);
        }else{
            throw `the Comment module require User module, it should loaded first!`;
        }

        // this.container = document.querySelector(options.container);
        // quill.on('selection-change', this.showCommandButton.bind(this));

        // this.toolbar = quill.getModule('toolbar');
        console.log(this.toolbar);
        // if (typeof this.toolbar !== 'undefined')
        //     this.toolbar.addHandler('thread', this.showCommandThread);

        let comments = document.getElementsByClassName('ql-thread');

        if (comments) {
            [].slice.call( comments ).forEach(function ( comment ) {
                comment.innerHTML = options.buttonIcon;
            });
        }
        // TODO: this will cause an issue with multiple instance listener
        document.addEventListener('click',(e)=>{
            if(e.target && e.target.nodeName === 'THREAD'){
                console.log('thread click');
                let data = Quill.find(e.target).formats().thread;
                    data.offsetTop = e.target.offsetTop;
                    data.top = `${e.target.offsetTop}px`;
                this.quill.emitter.emit('thread-click',data,e.target)
            }
        });
        this.collaborationModule = this.editor.getModule('collaborator');
        this.socket = this.collaborationModule.getSocket();
        this.docId = this.options.docId || this.collaborationModule.getDocId();

        this.listenThreadChange();

    }
    getSocket(){
        return this.editor.getModule('collaborator').getSocket()
    }
    showCommandThread(){
        console.log('showCommandThread');
    }
    getThreads(){
        return this.socket.database()
            .ref('/docs/' + this.docId+'/threads')
            .once('value')
            .then((snapshot)=> {
                console.log('FireBase Thread Snapshot:', snapshot.val());
                if(!snapshot.val()) {

                }
                return Promise.resolve(snapshot.val());
            });
    }
    listenThreadChange(){
        this.socket.database()
            .ref('/docs/' + this.docId+'/threads')
            .on('child_added',(snapshot)=> {
                // console.log('FireBase Thread Snapshot changed:', snapshot.val());
                if(snapshot.val()) {
                    console.log('FireBase Thread Snapshot changed:',snapshot.val());
                    let thread = snapshot.val();
                    if(this.user.id != thread.by.id) {
                        console.log('Trigger event someone-add-new-thread');
                        this.editor.emitter.emit('someone-add-new-thread',thread);
                    }

                }
            });
        this.socket.database()
            .ref('/docs/' + this.docId+'/threads/comment')
            .on('value',(snapshot)=> {
            // console.log('FireBase Comments Snapshot changed:', snapshot.val());
            if(snapshot.val()) {
                console.log('Someone added new comment:',snapshot.val());
                let comment = snapshot.val();
                let diff =  (comment && comment.createdAt) ? moment(comment.createdAt).diff(this.startTime) : -1;
                console.log("Time for comment",diff);
                if(comment.by.id != this.user.id && diff > 0) {
                    this.editor.emitter.emit('someone-add-new-comment',comment);
                }
            }
        })

    }

    createThread(selection){
        // let selection  = this.editor.getSelection();
        console.log("Selection on document",selection);
        let bounds = this.editor.getBounds(selection.index);
        console.log('Selection Bounds:',bounds);
        let threadId = moment().utc().valueOf();
       let thread = {
           id: threadId,
           by:this.user,
           createdAt: moment().toISOString(),
           position:{
               top: bounds.top+'px'
           }
       };
       console.log("store thread to firebase",thread);
       return this.socket.database().ref('/docs/' + this.docId+'/threads/'+threadId)
           .set(thread).then((response)=>{
               console.log('Firebase response after create thread',response);
               return Promise.resolve(thread);
           });
    }
    addComment(thread,commentText){
        console.log('Thread to add comment',thread);
        let commentId = moment().utc().valueOf();
        let comment = {
            id: commentId,
            text: commentText,
            by: this.user,
            createdAt: new Date().toISOString(),
            thread: thread.id
        }
        this.socket.database().ref('/docs/' + this.docId+'/threads/comment')
            .set(comment)
            .then((response)=>{
                console.log('The comment added to Notify new comment',response);
            });
        return this.socket.database().ref('/docs/' + this.docId+'/threads/'+thread.id+'/comments/'+commentId)
            .set(comment)
            .then((response)=>{
                console.log('Firebase response after create comment',response);
                return Promise.resolve(comment);
        });
    }
    static addThread(){
        let selectedRange = this.editor.getSelection();
        console.log('addThread');
        this.editor.formatText(selectedRange.index,selectedRange.length,{ thread:{ start:true, id: 100 }})
    }

}
// Comment.registerdEvents = false;

Comment.DEFAULTS = {
    buttonIcon: '<svg viewbox="0 0 18 18"><circle class="ql-fill" cx="7" cy="7" r="1"></circle><circle class="ql-fill" cx="11" cy="7" r="1"></circle><path class="ql-stroke" d="M7,10a2,2,0,0,0,4,0H7Z"></path><circle class="ql-stroke" cx="9" cy="9" r="6"></circle></svg>'
};
export {Comment as default}