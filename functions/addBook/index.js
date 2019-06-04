// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const bookListCollection = db.collection('bookList')

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  const wxContext = cloud.getWXContext()
  let { title, author, summary, images, totalNum, category,ISBN} = event
  try{
    return await bookListCollection.add({
      data: {
        title,
        author,
        summary,
        images,
        totalNum,
        category,
        ISBN,
        createTime: +new Date()
      }
    })
  }catch(e){
    return e
  }
  
}