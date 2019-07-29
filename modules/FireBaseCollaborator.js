import Quill from 'quill';
const Module = Quill.import('core/module');

// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
import * as moment from 'moment';

class FireBaseCollaborator extends  Module{

    constructor(quill, options) {
        super(quill, options);
        this.editor = quill;
        this.options = options;
        this.dbName = this.options.dbName || 'local_collaborator';
        this.docId = this.options.docId;
        this.host = this.options.host;
        this.user = this.options.user;
        this.doc = {};
        // Initialize Firebase
        firebase.initializeApp(this.options.services[this.options.provider]);
        this.startTime = moment();
        this.initDocument();
    }
    getSocket(){
        return firebase;
    }
    getDocId(){
        return this.docId;
    }
    initDocument(){
        //
        console.log('FireBaseCollaborator: checking if any document existed in firebase;');
        // reset document
        // this.editor.setContents('');
        firebase.database().ref('/docs/' + this.docId)
            .once('value')
            .then((snapshot)=> {
                console.log('FireBase Snapshot:', snapshot.val());
                if(!snapshot.val()){
                    this.doc.ops = this.editor.getContents().ops;
                    this.doc.changes = [];
                    this.doc.change = {};
                    firebase.database().ref('/docs/' + this.docId)
                        .set(this.doc)
                        .then(doc=>{
                                // console.log('Document After init:',doc);
                                // return Promise.resolve(this.doc);
                            this.listenOnNewChanges();
                            this.editor.on('text-change',this.updateDoc.bind(this));
                        });

                }else{
                    this.doc = snapshot.val();
                    this.editor.setContents(this.doc.ops,'silent');
                    // this.doc.changes.forEach(change=>{
                        // this.editor.updateContents(change,'silent');
                    // })
                    // return Promise.resolve(this.doc);
                    this.listenOnNewChanges();
                    this.editor.on('text-change',this.updateDoc.bind(this));
                }
            });

    }
    updateDoc(delta,oldContents, source){
        this.doc.ops = this.editor.getContents().ops;
        this.doc.change = {
            ops:delta.ops,
            user:this.user,
            createdAt: moment().toISOString()
        };
        if(!this.doc.changes) this.doc.changes = [];
        this.doc.changes.push(delta);

        console.log(this.doc);
        firebase.database().ref('docs/' + this.docId + '/change')
            .set(this.doc.change);
        firebase.database().ref('docs/' + this.docId + '/ops')
            .set(this.doc.ops);
    }
    listenOnNewChanges(){
        firebase.database().ref('docs/' + this.docId + '/change').on('value', (snapshot)=> {
            console.log(snapshot.val());
            let theChange = snapshot.val();
            console.log('Collaborator: theChange',theChange);
            let diff =  (theChange && theChange.createdAt) ? moment(theChange.createdAt).diff(this.startTime): -1;
            if(theChange && theChange.user.id !== this.user.id && diff > 0) {
                this.editor.updateContents(theChange.ops,'silent');
            }
        });
    }
}

FireBaseCollaborator.DEFAULTS = {
    buttonIcon: '<svg viewbox="0 0 18 18"><circle class="ql-fill" cx="7" cy="7" r="1"></circle><circle class="ql-fill" cx="11" cy="7" r="1"></circle><path class="ql-stroke" d="M7,10a2,2,0,0,0,4,0H7Z"></path><circle class="ql-stroke" cx="9" cy="9" r="6"></circle></svg>'
};
export {FireBaseCollaborator as default}