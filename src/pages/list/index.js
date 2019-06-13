import Taro , { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtList, AtListItem } from "taro-ui"
import {fetchBookList} from '../../utils/db'
import HeaderBanner from '../../component/HeaderBanner'

export default class Index extends Component {

   config = {
       navigationBarTitleText: '图书列表'
  }

  state={
    bookList: []
  }

  async componentWillMount () {
    let bookList = await fetchBookList();
    this.setState({bookList})
  }
  componentDidMount () {} 
  render() {
    let bookItems = this.state.bookList.map(book =>{
      console.log(book)
      let {title,author,totalNum,images,_id} = book;
      return <AtListItem
        title={title}
        note={`作者：${author}`}
        extraText={`数量：${totalNum}`}
        thumb={images[0].url}
        key={_id}
      />
    })
    return (
      <View>
        <HeaderBanner></HeaderBanner>
        <AtList>
          {bookItems}
        </AtList>
      </View>
    );
  }
}