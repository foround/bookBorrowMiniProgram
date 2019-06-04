/* eslint-disable import/no-commonjs */
import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await';
import { View } from '@tarojs/components'
import { AtTabs,AtTabsPane,AtImagePicker,AtInput,AtTextarea,AtButton } from 'taro-ui'
import './index.styl'
import { BOOK_SEARCH_URL } from '../../config';

const Fly = require('flyio/dist/npm/wx')

const fly = new Fly();
const filenameGenerator = () => +new Date()+Math.random().toString(36).substr(2)
export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }
  constructor () {
    super(...arguments)
    this.state = {
      current: 0,
      isbnCode:'',
      bookInfo:{
        title: '',
        author: '',
        summary: '',
        images: [],
        totalNum: 1
      }
    }
  }
  render () {
    const tabList = [{ title: 'ISBN码录入' }, { title: '直接录入' }]
    return (
      <AtTabs current={this.state.current} tabList={tabList} onClick={this.toggleTab.bind(this)}>
        <AtTabsPane current={this.state.current} index={0} >
          <View className='tab-pane'>
            <View className='isbn-button' onClick={this.scanBook.bind(this)}>扫描ISBN码</View>
            <View className='isbn-input'>
              <AtInput
                name='isbnCode'
                type='text'
                placeholder='请输入图书的ISBN码(不需要横线)'
                value={this.state.isbnCode}
              />
            </View>
            <View className='isbn-submit'>
              <AtButton
                circle
                type='primary'
                onClick={this.getBookInfo.bind(this)}
              >提交</AtButton>
            </View>
          </View>
        </AtTabsPane>
        <AtTabsPane current={this.state.current} index={1} className='tab-pane-form'>
            <AtInput
              name='title'
              title='书名'
              type='text'
              placeholder='请输入书名'
              value={this.state.bookInfo.title}
            />
            <AtInput
              name='author'
              title='作者'
              type='text'
              placeholder='请输入作者'
              value={this.state.bookInfo.author}
            />
            <AtInput
              name='author'
              title='数量'
              type='number'
              placeholder='请输入该书总数量'
              value={this.state.bookInfo.totalNum}
            />
            <AtTextarea
              className='at-text-area'
              value={this.state.bookInfo.summary}
              maxLength={300}
              height={200}
              placeholder='请输入书籍简介'
            />
            <AtImagePicker
              files={this.state.bookInfo.images}
              onChange={this.bindPickerChange.bind(this)}
            />
            <View className='submit-wrapper'>
              <AtButton 
                type='primary'
                className='submit-button'
                circle
                formType='submit'
              >
                提交
              </AtButton>
            </View>
        </AtTabsPane>
      </AtTabs>
    )
  }

  componentWillMount () {
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  toggleTab (value) {

    this.setState({
      current: value
    })
  }

  scanBook(){
    let $this = this
    Taro.scanCode({
      scanType: 'barCode',
      success (res) {
        $this.setState({
          isbnCode: res.result
        })
      },fail(){
        Taro.showToast({
          title: '扫描图书条形码失败，请重试',
          icon: 'none'
        })
      }
    })
  }
  bindPickerChange(newList,handle){
    let $this = this
    switch(handle){
      case 'add':
        console.log(newList)
        let len = newList.length;
        let imageUrl = newList[len-1].url;
        Taro.cloud.uploadFile({
          cloudPath: imageUrl.replace(/^(.*)\.(\w{3,4})/,`${filenameGenerator()}.$2`),
          filePath: imageUrl
        }).then(({fileID})=>{
          Taro.cloud.getTempFileURL({
            fileList: [{fileID}]
          }).then(({fileList}) =>{
            // eslint-disable-next-line no-shadow
            let newImages = fileList.map(({fileID,tempFileURL}) =>{
              return{
                fileID,
                url: tempFileURL
              }
            })
            let bookInfo = {
              ...$this.state.bookInfo,
              images:[...$this.state.bookInfo.images,...newImages]

            }
            $this.setState({bookInfo})
          })
        })
        break;
      case 'remove':
        Taro.showModal({
          title: '确认删除',
          content: '确定要删除这张图片吗',
        }).then(({confirm}) => {
          if(confirm){
            let bookInfo = {
              ...$this.state.bookInfo,
              images:[...newList]
            }
            $this.setState({bookInfo})
          }
        })
        break;
      default:
        break;
    }
  }
  async getBookInfo(){
    if(/^(\d{10}|\d{13})$/.test(this.state.isbnCode) == false){
      Taro.showToast({
        title: '图书ISBN信息输入有误',
        icon: 'none'
      })
      return;
    }
    try{
      let res = await fly.get(BOOK_SEARCH_URL)
      if(res.data.errorCode != 0){
        throw new Error('Error')
      }
      let {title,author,summary,image} = res.data.data;
      let bookInfo = {
        title,
        author:author.join(','),
        summary,
        images: [{url:image}],
        totalNum: 1
      }
      this.setState({bookInfo:bookInfo,current:1})
    }catch(e){
      console.log(e)
      Taro.showToast({
        title: '获取图书信息出错',
        icon: 'none'
      })
    }
  }
}
