<template>
    <div>
        <div class="row">
            <div class="col">  <div id="toolbarContainer">
                    <span class="ql-formats">
                        <select class="ql-font">
                                <option value="Playfair Display">Playfair Display</option>
                                <option value="Arial">Arial</option>
                                <option value="Caveat">Caveat</option>
                        </select>
                        <select class="ql-size"></select>
                    </span>
                <span class="ql-formats">
                        <button class="ql-bold"></button>
                        <button class="ql-italic"></button>
                        <button class="ql-underline"></button>
                        <button class="ql-strike"></button>
                    </span>
                <span class="ql-formats">
                    <button class="ql-direction" value="rtl"></button>
                    <select class="ql-align"></select>
                </span>
                <span class="ql-formats">
                  <button class="ql-list" value="ordered"></button>
                  <button class="ql-list" value="bullet"></button>
                  <button class="ql-indent" value="-1"></button>
                  <button class="ql-indent" value="+1"></button>
                </span>
                <span class="ql-formats">
                        <button class="ql-link"></button>
                        <button class="ql-image"></button>
                    <!--<button class="ql-video"></button>-->
                    <!--<button class="ql-formula"></button>-->
                    </span>

                <span class="ql-formats">
                        <button class="ql-clean"></button>
                    </span>
                <span class="ql-formats">
                        <select class="ql-field">
                            <option v-for="field in fields" :value="field.name" :data-field="JSON.stringify(field)"> {{field.title}}</option>
                        </select>
                    </span>
                <span class="ql-formats">
                        <button class="ql-trackChange"></button>
                        <button class="ql-table" value="2"></button>
                        <button class="ql-google-doc"></button>
                    </span>
            </div> </div>
        </div>
        <div class="row  my-5">
            <div class="col-md-2 my-5">
                <div class="fields form-group" v-if="!term.readOnly" v-for="field in fields">
                    <div class="form-group">
                        <label :for="field.title">{{field.title}}</label>
                        <input :type="field.type" class="form-control" :id="field.name" v-model="field.data" @input="changeFieldValue(field)" >
                        <small class="form-text text-muted">{{field.description}}</small>
                    </div>
                </div>
            </div>
            <div class="col-md-7">
                <div class="block">
                    <div id="externalStyle"></div>

                    <div :id="id"></div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="comments" id="comments">
                    <CommentBox v-if="showCommentBox" v-bind:module="commentModule" v-bind:range="commentRange" v-bind:bounds="commentBounds"
                                v-on:commentAdded="updateCommentThread"
                                v-on:threadAdded="userAddNewThread"
                    ></CommentBox>
                    <div class="thread-contents" v-for="(thread,key) in threads">
                        <div class="thread" v-if="thread.show && thread.position" v-bind:style="{ top: thread.position.top}">
                            <div>{{thread.id}}</div>
                            <div class="comment" v-for="comment in thread.comments"> User {{comment.by.name}} said: {{comment.text}} </div>
                            <input v-model="thread.newComment"> <button v-on:click="sendComment(thread)">SEND</button>
                        </div>

                    </div>
                </div>
            </div>


            <hr>

        </div>
    </div>


</template>

<script>

    import Quill from 'quill';

    import User from './modules/User';
    import Comment from "./modules/Comment";
    import Field from "./modules/Field";
    import TrackChange from "./modules/TrackChange";
    import FireBaseCollaborator from "./modules/FireBaseCollaborator";
    import GoogleDoc from './modules/GoogleDoc';
    import HtmlImport from "./modules/HtmlImport";

    Quill.register('modules/user', User);
    Quill.register('modules/comment', Comment);
    Quill.register('modules/field', Field);
    Quill.register('modules/collaborator', FireBaseCollaborator);
    Quill.register('modules/trackChange', TrackChange);
    Quill.register('modules/googleDoc', GoogleDoc);
    Quill.register('modules/htmlImport', HtmlImport);

    import CommentBox from './vue/CommentBox';

    console.log('Import list', Quill.imports);
    export default {
        components:{
            CommentBox
        },
        props: ['doc'],

        name: "Term",
        data(){
            return {
                id: null,
                editor: null,
                newComment: "",
                threads:{},
                contractAmount: null,
                term: this.doc,
                fields:{
                    nonePeakRatePerDay: {
                        name:"nonePeakRatePerDay",
                        title:"None Peak Rate Per Day",
                        description:"None Peak Rate Per day",
                        type:"money",
                        data:"S$662.00"
                    },
                    nonePeakRatePerWeekend: {
                        name:"nonePeakRatePerWeekend",
                        type:"money",
                        data:"S$907.00",
                        title:"None Peak Rate Per Weekend",},
                    locationAddress: {
                        name:"locationAddress",
                        type:"address",
                        data:"21 Choa Chu Kang North 6, #02-01 YewTee Point Singapore 689578",
                        title:"Address of location"
                    }
                },
                showCommentBox:false,
                commentRange:{},
                commentBounds:{},
                commentModule:null,
                user:{
                    id: Math.random().toString(36).substr(2, 9),
                    name:'Tam Nguyen'
                },
                // table: true
            }
        },
        created(){
            this.id = "quill-editor-"+Math.random().toString(36).substr(2, 9);
        },
        mounted() {
            let option = {
                theme: 'snow',
                readOnly: this.doc.readOnly,
                modules: {
                    // Note: the order of module are important to other table reuse
                    toolbar: {
                        container:"#toolbarContainer",
                        handlers:{
                            table:()=>{
                                this.editor.getModule('table').insertTable(2,2);
                            },
                            'google-doc':()=>{
                                console.log('google doc toolbar handler');
                            },
                            trackChange:()=>{
                                this.editor.getModule('trackChange').toggleEnabled();
                            }
                        }
                    },
                    user:{
                        user: this.user
                    },
                    collaborator:{
                        docId:'1001',
                        user:this.user,
                        provider: 'firebase',
                        services:{
                            firebase:{
                                apiKey: "AIzaSyAr5cefhF7nJy46Czz9ysiOaVPiSMqBr9U",
                                authDomain: "localcollaborator.firebaseapp.com",
                                databaseURL: "https://localcollaborator.firebaseio.com",
                                projectId: "localcollaborator",
                                storageBucket: "",
                                messagingSenderId: "217328388248",
                                appId: "1:217328388248:web:7c4dc7e911b826ea"
                            },
                            PouchDB:{
                                host:'http://54.169.170.167:5984',
                            }
                        }
                    },
                    comment:{
                        enabled:true,
                        container: '#comments'
                    },
                    field:{
                        fields:this.fields
                    },
                    trackChange:{
                        enabled: false
                    },
                    table: true,
                    googleDoc:{
                        docId: '1Ii8uAtEug7PHezao5se2dbt2JseAMr3ZqLL2aAHNoS4'
                    },
                    htmlImport:{
                        enabled: false,
                    }
                }
            }
            this.editor = new Quill("#"+this.id, option);

            // TODO: we should not set content at this point because that other module can modify the data with latest state
            this.editor.setContents(this.doc.deltas,'silent');

            // setup comment module and pass to sub component
            this.commentModule = this.editor.getModule('comment');
            this.editor.on('field-change',(field) => {
                console.log('listener field changed',field);
                this.$emit('fieldChange',field);
                this.fields[field.name] = field;
            });



            this.editor.on('editor-change',(event)=>{
                this.term = this.editor.getContents().ops;
            });
            // this.fields = this.editor.getModule('field').getFields();
            // console.log('Fields extracted from content',this.fields);

            // TODO: will move to Module later
            this.editor.on('selection-change',(range, oldRange, source)=>{
                console.log('user select text, we will show comment box ');

                if(range && range.length) {
                    this.showCommentBox = true;
                    this.commentRange = range;
                    this.commentBounds = this.editor.getBounds(range.index);
                }

            });

            this.editor.on('thread-click',(thread)=>{
                console.log(thread);
                Object.keys(this.threads).forEach((threadId)=>{
                    if(threadId != thread.id) {
                        this.threads[threadId].show = false;
                    }else{
                        this.threads[threadId].show = true;
                        this.threads[threadId].position.top = thread.top;

                    }
                });
                // this.threads[thread.id].show = true;
                this.showCommentBox = false;
            })
            this.editor.on('field-click',(field,tooltip)=>{
                console.log(field);
                tooltip.show();
            });
            this.getThreads().then((threads)=>{
                console.log('Thread from Comment Module: ',threads);
                this.threads = threads || {};
            })
            this.editor.on('someone-add-new-thread',this.someOneAddedNewThread);
            this.editor.on('someone-add-new-comment',this.someOneAddedNewComment);
        },
        watch:{
            showCommentBox(value){
                if(value === true && this.threads && this.threads.length) {
                    Object.keys(this.threads).forEach((threadId)=>{
                        this.threads[threadId].show = false;
                    });
                }
            },
            commentRange: function(val, oldVal){
                console.log(val);
                if(val === {}) {

                }else{
                    // this.editor.formatText(oldVal.index,oldVal.length,{mark:false});
                }
            }
        },
        methods:{
            sendComment(thread){
                console.log(thread.newComment);
                console.log(thread);
                thread.comments = thread.comments || {};
                this.commentModule.addComment(thread,thread.newComment,this.user).then(comment=>{
                    // thread.comments.push(comment);
                    // thread.comments[comment.id] = comment;
                    this.$set(thread.comments,comment.id,comment);
                    thread.newComment = null;
                })
            },
            changeFieldValue(field){
                this.editor.getModule('field').updateFieldsValue(field.name,field.data);
            },
            someOneAddedNewThread(thread){
                let threadId = thread.id;
                let comments = {};
                thread.show = true;
                console.log('Thread Comment: Some one added new thread?',thread);
                // this.threads[threadId] = {id:threadId,position:thread.position,comments:comments};
                this.$set(this.threads,threadId,{id:threadId, show:true, position:thread.position, comments:comments});
            },
            someOneAddedNewComment(comment){
                let threadId = comment.thread;
                console.log('Thread Comment: Some one added new comments?',comment);
                // this.$set(this.threads,threadId,thread);
                // this.threads[threadId].comments[comment.id] = comment;

                this.$set(this.threads[threadId].comments,comment.id,comment);
            },
            userAddNewThread(thread){
                let threadId = thread.id;
                let comments = thread.comments || {};
                thread.show = true;
                console.log('Thread Comment: I  added new thread?',thread);
                this.$set(this.threads,threadId,{id:threadId,position:thread.position,comments:comments});
            },
            userAddNewComment(comment){

            },
            updateCommentThread(comment){
                console.log('Comment Added',comment);
                let threadId = comment.thread;
                if(!this.threads.hasOwnProperty(threadId)) {
                    this.$set(this.threads,threadId,{
                        id:threadId,
                        position:thread.position,
                        comments:{},
                        show:true
                    });
                }
                // this.threads[threadId].comments.push(comment);
                // this.threads[threadId].comments.push(comment);
                this.$set(this.threads[threadId].comments,comment.id,comment);
                this.threads[threadId].show = true;
                // comment.thread = null;
                // this.editor.formatText(this.commentRange.index,this.commentRange.length,{mark:false});
                this.editor.formatText(this.commentRange.index,this.commentRange.length,{thread:{id:threadId}});
                this.showCommentBox = false;
                this.commentRange = {};
            },
            getThreads(){
                return this.editor.getModule('comment').getThreads();
            }
        }
    }
</script>

<style>
    @import '~quill/dist/quill.core.css';
    @import '~quill/dist/quill.bubble.css';
    @import '~quill/dist/quill.snow.css';
    /*., .block*/
    .ql-toolbar {
        width: 100%;
        position: fixed;
        top: 10px;
        z-index: 9;
        background: white;
    }
    .ql-snow .ql-picker-label::before {
        width: max-content;
    }
    .ql-container {
        width: 21cm;
        min-height: 29.7cm;
        padding: 2cm;
        margin: 1.5cm auto;
        border: 1px #D3D3D3 solid;
        border-radius: 5px;
        background: white;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    }
    .ql-tooltip {
        z-index: 9;
    }
    .ql-editor .thread {
        background: red;
    }
    .comments {
        /*display: none;*/
    }
    .comments .thread {
        position: absolute;
    }
    .field {
        border: 1px solid #cdcdcd;
        /*padding-left: 5px;*/
        padding-right: 5px;
    }
    .field::before {
        content: ' ';
        width: 100%;
        background: red;
    }
    .ql-picker.ql-field {
        width: 118px;
    }
    .ql-picker.ql-field > span.ql-picker-label::before {
        content: 'Insert Field';
    }

    .ql-picker.ql-field > span.ql-picker-options > span.ql-picker-item::before {
        content: attr(data-label);
    }
    mark {
        padding: 0px;
    }
    .ql-field-tooltip::before {
        content: '' !important;
        display: block;
    }
    ins{
        color: blue ;
    }
    del{
        color: red;
    }
    ::-moz-selection { background: yellow; }
    ::selection { background: yellow; }
</style>