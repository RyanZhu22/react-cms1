import request from './request'

// login
export const RegisterApi = (params) => request.post('/register', params)

// register
export const LoginApi = (params) => request.post('/login', params)

// get the list of article
export const ArticleListApi = (params) => request.get('/article', {params})

// add article
export const ArticleAddApi = (params) => request.post('/article/add', params)

// search article
export const ArticleSearchApi = (params) => request.get(`/article/${params.id}`)

// re-edit/update article
export const ArticleUpdateApi = (params) => request.put('/article/update', params)

// delete article
export const ArticleDelApi = (params) => request.post('/article/remove', params)

// get user data
export const GetUserDataApi = () => request.get('/info')

// change user data
export const ChangeUserDataApi = (params) => request.put('/info', params)
