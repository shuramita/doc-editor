<template>
    <div id="toolbarContainer">
                <span class="ql-formats">
                    <button class="ql-save"><i class="fas fa-save"></i></button>
                </span>
        <span class="ql-formats">
                    <select class="ql-font"></select>
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
                    <button class="ql-float" value="right"><i class="fas fa-align-right"></i> </button>
                    <button class="ql-column" value="2"><i class="fas fa-columns"></i></button>
                </span>
        <span class="ql-formats">
                    <button class="ql-link"></button>
                    <button class="ql-image"></button>
                    <button class="ql-video"></button>
                    <button class="ql-formula"></button>
                </span>

        <span class="ql-formats">
                    <button class="ql-clean"></button>
                </span>
        <span class="ql-formats">
                    <button class="ql-comments"><i class="fas fa-comments"></i></button>
                </span>
    </div>
</template>

<script>
    export default {
        name: "ToolBar"
    }
</script>

<style scoped>

</style>