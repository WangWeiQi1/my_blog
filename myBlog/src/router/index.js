import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Front = () => import('components/front/front');

const Blog = () => import('components/front/blog/blog');

const Essay = () => import('components/front/essay/essay');

const Message = () => import('components/front/message/message');

const Links = () => import('components/front/links/links');

const About = () => import('components/front/about/about');

const Index = () => import('components/index/index');

const Reg = () => import('components/reg/reg');

const Login = () => import('components/login/login');

const Admin = () => import('components/admin/admin');

const SetAvatar = () => import('components/setAvatar/setAvatar');

const AdminIndex = () => import('components/admin/admin_index');

const UserList = () => import('components/admin/userList');

const AddUsers = () => import('components/admin/addUsers');

const ArticleList = () => import('components/admin/articleList');

const AddArticles = () => import('components/admin/addArticles');

const CategoryList = () => import('components/admin/categoryList');

const AddCategories = () => import('components/admin/addCategories');

const EditCategory = () => import('components/admin/editCategory');

const EditArticle = () => import('components/admin/editArticle');

const AddEssays = () => import('components/admin/addEssays');

const EssayList = () => import('components/admin/essayList');

const BlogDetail = () => import('components/front/blog-detail/blog-detail');

const AddLinks = () => import('components/admin/addLinks');

const LinkList = () => import('components/admin/linkList');

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/front',
      component: Front,
      children: [
        {
          path: '/blog',
          component: Blog
        },
        {
          path: '/essay',
          component: Essay
        },
        {
          path: '/message',
          component: Message
        },
        {
          path: '/links',
          component: Links
        },
        {
          path: '/about',
          component: About
        },
        {
          path: '/blog/:id',
          component: BlogDetail
        }
      ]
    },
    {
      path: '/index',
      component: Index
    },
    {
      path: '/reg',
      component: Reg
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/setAvatar',
      component: SetAvatar
    },
    {
      path: '/admin',
      component: Admin,
      children: [
        {
          path: '/admin_index',
          component: AdminIndex
        },
        {
          path: '/userList',
          component: UserList
        },
        {
          path: '/addUsers',
          component: AddUsers
        },
        {
          path: '/articleList',
          component: ArticleList
        },
        {
          path: '/addArticles',
          component: AddArticles
        },
        {
          path: '/essayList',
          component: EssayList
        },
        {
          path: '/addEssays',
          component: AddEssays
        },
        {
          path: '/categoryList',
          component: CategoryList
        },
        {
          path: '/addCategories',
          component: AddCategories
        },
        {
          path: '/categoryList/:id',
          component: EditCategory
        },
        {
          path: '/addLinks',
          component: AddLinks
        },
        {
          path: '/linkList',
          component: LinkList
        },
        {
          path: '/articleList/:id',
          component: EditArticle
        }
      ]
    }
  ]
})
