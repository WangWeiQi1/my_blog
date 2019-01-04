<template>
  <el-main>
    <Card title="编辑文章">
      <div class="article-title1">
        <el-input
          placeholder="请输入文章标题"
          v-model="title"
          clearable>
        </el-input>
      </div>
      <div class="fenlei1">
        <el-select v-model="value" placeholder="请选择分类">
          <el-option
            v-for="item in categories"
            :key="item.name"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </div>
      <div class="blog-description1">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入文章简介"
          v-model="textarea">
        </el-input>
      </div>
      <div class="blog-type1">
        <el-select v-model="blogType" placeholder="请选择文章类型">
          <el-option
            v-for="item in blogTypes"
            :key="item.name"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </div>
      <div class="uploadCover1">
        <el-upload
          :with-credentials="true"
          :action="doUpload"
          ref="upload"
          :limit="1"
          :auto-upload="false"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :on-success="handleAvatarSuccess"
          list-type="picture"
          :before-upload="beforeAvatarUpload">
          <el-button size="small" type="primary">更改封面</el-button>
        </el-upload>
      </div>
      <div class="content1">
        <mavon-editor v-model="content"></mavon-editor>
      </div>
      <div class="footer1">
        <el-button type="success" @click="editArticles">确认修改</el-button>
      </div>
    </Card>
  </el-main>
</template>

<script>
  import Card from 'base/card/card'
  import {mavonEditor} from 'mavon-editor'
  import 'mavon-editor/dist/css/index.css'
  import axios from 'axios'
  import qs from 'qs'
  axios.defaults.withCredentials = true;
  export default {
    data(){
      return{
        title: '',
        content: '',
        categories: [],
        doUpload: 'http://localhost:3000/admin/editBlog',
        value: '',
        blogTypes: [{name: '原创'},{name: '转载'}],
        textarea: '',
        blogType: '',
        fileList: []
      }
    },
    created(){
      this.title = this.$route.query.item.title;
      this.content = this.$route.query.item.content;
      this.value = this.$route.query.item.category.name;
      this.textarea = this.$route.query.item.description;
      this.blogType = this.$route.query.item.blogType;
      this.getAllCategories();
    },
    methods:{
      getAllCategories(){
        var url = 'http://localhost:3000/admin/categories';
        axios.get(url).then(res => {
          if(res.data.code === 0){
            this.categories = res.data.categories;
          }
        })
      },
      handlePreview(){

      },
      handleRemove(){

      },
      handleAvatarSuccess(res,file){
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file){
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG && !isPNG) {
          this.$message.error('上传头像图片只能是JPG或PNG格式!');
          return false;
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
          return false;
        }
        let fd = new FormData();
        fd.append('file',file);
        fd.append('id',this.$route.query.item._id);
        fd.append('title',this.title);
        fd.append('content',this.content);
        fd.append('description',this.textarea);
        fd.append('blogType',this.blogType);
        fd.append('category',this.value);
        fd.append('addTime',Date.now());
        axios.post(this.doUpload,fd).then(res => {
          if(res.data.code === 0){
            this.$message({
              message: '修改成功',
              duration: 1000,
              type: 'success'
            });
            setTimeout(() => {
              this.$router.push('/articleList');
            })
          }
        })
      },
      editArticles(){
        if(this.title === ''){
          this.$message({
            message: '标题不能为空',
            duration: 1000,
            type: 'warning'
          });
          return;
        }
        if(this.content === ''){
          this.$message({
            message: '内容不能为空',
            duration: 1000,
            type: 'warning'
          });
          return;
        }
        if(this.value === ''){
          this.$message({
            message: '请选择文章分类',
            duration: 1000,
            type: 'warning'
          });
          return;
        }
        if(this.textarea === ''){
          this.$message({
            message: '请输入文章简介',
            duration: 1000,
            type: 'warning'
          });
          return;
        }
        if(this.blogType === ''){
          this.$message({
            message: '请选择文章类型',
            duration: 1000,
            type: 'warning'
          });
          return;
        }
        this.$refs.upload.submit();
      }
    },
    components:{
      Card,
      mavonEditor
    }
  }
</script>

<style lang="stylus">
  .article-title1
    margin-bottom: 20px
    width: 50%
  .content1
    margin-top: 90px
  .fenlei1
    margin-top: -60px
    margin-left: 52%
    color: aqua
  .footer1
    text-align: center;
    margin-top: 30px;
  .blog-description1
    width: 50%
    position: relative;
    top: 20px;
  .blog-type1
    position: relative;
    left: 52%;
    top: -30px;
  .uploadCover1
    height: 60px
    margin-left: 75%;
    margin-top: -130px;
</style>
