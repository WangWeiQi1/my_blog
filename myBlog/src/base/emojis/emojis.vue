<template>
    <div class="emojis-container" v-show="showEmojis">
        <ul class="emojis-box">
            <li class="emojis-item" v-for="emoji in emojis" :key="emoji" @click="selectEmoji(emoji)">
                <img :src="`${url}${emoji}.gif`" alt="emojis">
            </li>
        </ul>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        props: {
            showEmojis: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                emojis: [],
                url: 'http://localhost:3000/emojis/'
            }
        },
        created() {
            this.emojis = ['微笑','皱眉','色','发呆','得意','流泪','害羞','闭嘴','睡','大哭','尴尬','怒','调皮','呲牙','惊讶','难过','囧','抓狂','吐','左哼哼','右哼哼','坏笑','奋斗','大笑','抠鼻','拜拜','流汗','疑问','阴险','鼓掌'];
        },
        methods: {
            selectEmoji(item) {
                this.$emit('selectEmoji', item);
            }
        }
    }
</script>

<style scoped>
    .emojis-container {
        position: relative;
        width: 300px;
        background: rgba(255, 255, 255, .5);
        border: 1px solid #ccc;
        border-radius: 5px;
        z-index: 100;
    }
    .emojis-box {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .emojis-item {
        float: left;
        padding: 3px;
    }
</style>

