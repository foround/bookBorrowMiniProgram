/* eslint-disable react/no-unused-state */
import Taro ,{ Component } from '@tarojs/taro';
import { AtDivider } from 'taro-ui'
import dayjs from 'dayjs'
import { View,} from '@tarojs/components';
import {queryById} from '../../utils/db'
import {UTIL_BOOK} from '../../state'
import './index.styl'

export default class Index extends Component {

   config = {
       navigationBarTitleText: ''
  }

  state={
    ISBN: "",
    author: "",
    category: "",
    createTime: "",
    imageUrl: "",
    summary: "",
    title: "",
    totalNum: 0,
    _id: ""
  }

  componentWillMount () {
    let {id} = this.$router.params
    let $this = this
    queryById(id).then(data =>{
        data.imageUrl = data.images[0].url
        let { ISBN, author, category, createTime, imageUrl, images, summary, title, totalNum, _id } = data;
        $this.setState({
          ISBN,
          author,
          category,
          createTime,
          imageUrl,
          images,
          summary,
          title,
          totalNum,
          _id
        })

    })
  }
  componentDidMount () {} 
  render() {
    let { author, category, createTime, imageUrl, summary, title, totalNum, _id } = this;
    let entryTime = dayjs(createTime).format('YYYY-MM-DD');
    return (
      <View>
        <View className='intro'>
          <View className='img-wrapper'>
            <image src={imageUrl} mode='widthFix'></image>
          </View>
          <View>
            <View className='at-article__h1'>
              {title}
            </View>
            <View className='at-article__info'>
              作者：{author}
            </View>
            <View className='at-article__info'>
              录入时间: {entryTime}
            </View>
            <View className='at-article__info'>
              书籍类型：{category === UTIL_BOOK? '工具书': '普通书'}
            </View>
            <View className='at-article__info'>
              书籍总数: {totalNum}本
              {category !== UTIL_BOOK? '(已借阅0本)': ''}
            </View>
          </View>
        </View>
        <AtDivider content='内容简介' />
        <View className='at-article__p'>
          {summary}
        </View>
        <View className='borrow-btn' type='primary' size='normal'>借阅图书</View>
      </View>
    );
  }
}