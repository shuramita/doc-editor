import Quill from 'quill';
const Module = Quill.import('core/module');

import PouchDB from 'pouchdb';
import MemoryAdapter from 'pouchdb-adapter-memory'
import PouchDBFind from 'pouchdb-find';
PouchDB.plugin(MemoryAdapter);
PouchDB.plugin(PouchDBFind);
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";


class Collaborator extends  Module{

    constructor(quill, options) {
        super(quill, options);
        this.editor = quill;
        this.options = options;
        this.dbName = this.options.dbName || 'local_collaborator';
        this.docId = this.options.docId;
        this.host = this.options.host;
        console.log(this.dbName);
        this.remoteDB = new PouchDB(`${this.host}/${this.dbName}`);
        this.localDB = new PouchDB(this.dbName);
        this.user = this.options.user;

        this.localDB.sync(this.remoteDB, {
            live: true,
            retry: true
        }).on('complete', ()=> {
            // yay, we're in sync!
            console.log("ay, we're in sync!");
            this.initDocument();
        }).on('change', function (change) {
            console.log('yo, something changed!',change);
        }).on('paused', function (info) {
            console.log('replication was paused, usually because of a lost connection',info);
        }).on('active', function (info) {
            console.log('replication was resumed',info);
        }).on('error', function (err) {
            console.log("boo, we hit an error!");
        });
        this.initDocument().then(doc=>{
            this.editor.on('text-change',this.updateDoc.bind(this));
            this.listenOnNewChanges();
        });

        var firebaseConfig = {
            apiKey: "AIzaSyAr5cefhF7nJy46Czz9ysiOaVPiSMqBr9U",
            authDomain: "localcollaborator.firebaseapp.com",
            databaseURL: "https://localcollaborator.firebaseio.com",
            projectId: "localcollaborator",
            storageBucket: "",
            messagingSenderId: "217328388248",
            appId: "1:217328388248:web:7c4dc7e911b826ea"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
    }

    initDocument(){
       return this.remoteDB.get(this.docId)
           .then(doc=>{
                // if found collaborating document,
                   console.log('Remote Document', doc);
                   doc.changes = doc.changes || [];
                   this.doc = doc;
                   console.log(this.doc);
                   return Promise.resolve(this.doc);
                })
           .catch(error=>{
                   let localDocDeltas = this.editor.getContents();
                   console.log(localDocDeltas);
                   this.doc = {
                       _id: this.docId,
                       deltas:localDocDeltas.ops,
                       changes:[]
                   };
                   return this.remoteDB.put(this.doc)
                       .then(()=>{
                           return Promise.resolve(this.doc);
                       });
            });


    }
    updateDoc(delta,oldContents, source){
        console.log(delta);
        this.doc.changes.push(JSON.parse(JSON.stringify(delta)));
        console.log('Document before update', this.doc);
        this.doc.change = delta;
        this.doc.change.by = this.user;

        this.remoteDB.put(this.doc,{force:true})
            .then(doc=>{

            })
    }
    listenOnNewChanges(){
        this.remoteDB.changes({
            since: 'now',
            live: true,
            include_docs: true
        }).on('change', (change)=> {
            // console.log('Collaborator: ',change);
            let theChange = change.doc.change;
            console.log('Collaborator: theChange',theChange);
            if(theChange.by.id !== this.user.id) {
                this.editor.updateContents(theChange.ops,'silent');
            }
        }).on('error', function (err) {
            // handle errors
            console.log(err);
        });
    }
}

Collaborator.DEFAULTS = {
    buttonIcon: '<svg viewbox="0 0 18 18"><circle class="ql-fill" cx="7" cy="7" r="1"></circle><circle class="ql-fill" cx="11" cy="7" r="1"></circle><path class="ql-stroke" d="M7,10a2,2,0,0,0,4,0H7Z"></path><circle class="ql-stroke" cx="9" cy="9" r="6"></circle></svg>'
};
export {Collaborator as default}