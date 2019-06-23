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
      let {title,author,totalNum,images,_id} = book;
      return <AtListItem
        title={title}
        note={`作者：${author}`}
        extraText={`数量：${totalNum}`}
        thumb={images[0].url}
        key={_id}
        onClick={this.naviToDetail.bind(this,_id)}
      />
    })
    return (
      <View>
        <HeaderBanner onChange={this.onChange}></HeaderBanner>
        <AtList>
          {bookItems}
        </AtList>
      </View>
    );
  }
  onChange(params){
    console.log(params)
  }
  naviToDetail(id){
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`,
    })
  }
}