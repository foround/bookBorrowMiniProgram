import Taro , { Component } from '@tarojs/taro';
import { View, Picker } from '@tarojs/components'
import { func } from 'prop-types';

export default class extends Component {

    static props = {
        onChange: func
    }
    config = {
        navigationBarTitleText: ''
    }

    state = {
        selector: ['全部','可借阅','工具书'],
        // eslint-disable-next-line react/no-unused-state
        category: '全部',
        isAsc: true
    }
    componentWillMount () {}
    componentDidMount () {} 
    render() {
        let containerClass = {
            height: '50px',
            backgroundColor: '#1a2a3a',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '14px',
            color: '#ffffff'
        }
        let pickerClass = {
            width: '20%',
            textAlign: "center",
            lineHeight: '50px'
        }
        return (
            <View style={containerClass}>
                <Picker mode='selector' style={pickerClass} range={this.state.selector} onChange={this.onChangeCategory}>
                    <View className='picker'>{this.category}</View>
                </Picker>
                <View style={pickerClass} onClick={this.toggleOrder}>
                    {this.state.isAsc? '从大到小': '从小到大' }
                </View>
            </View>
        );
    }
    onChangeCategory(e){
        let index = e.detail.value
        // eslint-disable-next-line react/no-unused-state
        this.setState({category: this.state.selector[index]})
        this.props.onChange({
            category: this.state.selector[index],
            isAsc: this.state.isAsc
        })
    }
    toggleOrder(){
        let isAsc = ! this.state.isAsc
        this.setState({isAsc})
        this.props.onChange({
            category: this.state.category,
            isAsc: isAsc
        })
    }
}