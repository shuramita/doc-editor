<template>
    <div class="add-thread-block form-row align-items-center" v-bind:style="{top: bounds.top+'px'}">
        <div class="col-sm-12 my-1">
            <label class="sr-only" for="commentBox">Username</label>
            <div class="input-group">
                <input type="text" class="form-control" v-model="commentContent" id="commentBox" placeholder="@enter you suggestion here">
                <div class="input-group-prepend" v-on:click="addNewComment">
                    <div class="input-group-text" >Submit</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CommentBox",
        props:['range','bounds','module'],
        data(){
            return {
                    commentContent:"",
                    user: null
            }
        },
        mounted(){
            this.user = this.module.editor.getModule('user').getUser();
            console.log('Active User: ',this.user);
            console.log('Thread Module:', this.module);
        },
        methods:{
            createThread(){
                // editor.getModule('thread');
                console.log('Let Create Thread');
                return this.module.createThread(this.range).then((thread)=>{
                    return Promise.resolve(thread);
                });
            },
            addComment(thread){
                return this.module.addComment(thread,this.commentContent);
            },
            addNewComment(){
                console.log('addNewComment');
                console.log('addNewComment: range',this.range);
                return this.createThread()
                    .then(thread=>{
                        this.$emit('threadAdded',thread);
                        return this.addComment(thread)
                            .then(comment=>{
                                this.$emit('commentAdded',comment);
                            })
                    })
            }
        },

    }
</script>

<style scoped>
.add-thread-block {
    position: absolute;
}
</style>