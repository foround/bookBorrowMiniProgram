import Taro from '@tarojs/taro'
// eslint-disable-next-line import/prefer-default-export
export function addBook(bookInfo){
    Taro.cloud.callFunction({
        name: "addBook",
        data: {...bookInfo},
        complete({result}){
            let {errMsg} = result
            if(errMsg === "collection.add:ok"){
                Taro.showToast({
                    title: "成功录入信息"
                })
            }else{
                Taro.showToast({
                    title: "录入失败",
                    icon: 'none'
                })
            }
        }
    })
}
export function queryByISBN(ISBN){
   return new Promise((resolve,reject) =>{
       Taro.cloud.callFunction({
           name: 'queryByISBN',
           data:{ISBN},
           success({result}){
               resolve(result.data)
           },
           fail(err){
               reject(err)
           }
       })
   })
   
}
export function queryById(id){
   return new Promise((resolve,reject) =>{
       Taro.cloud.callFunction({
           name: 'queryById',
           data:{id},
           success({result}){
               resolve(result.data)
           },
           fail(err){
               reject(err)
           }
       })
   })
   
}

 export function fetchBookList(){
     return new Promise((resolve,reject) =>{
         Taro.cloud.callFunction({
             name: 'bookList',
             success({result}){
                resolve(result.data)
            },
            fail(err){
                reject(err)
            }
         })
     })
 }