import React from "react";
import {Input, InputNumber, Form, Button, Select, Radio, message, DatePicker} from  "antd";

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;

export default class BaseForm extends React.Component{
	constructor(props){
	    super(props);	    
	} 
	getFormItem(item){
		var obj = {};

		//初始化属性
		// if(item.value != undefined && (item.type != "select" && item.value != "")) {
			obj.value = item.value;			
		// }
		
		//得到获取placeholder属性
		if(item.type != "text" && item.type != "num") {
			obj.placeholder = this.getPlaceHolder(item);
		}

		//首先使用用户定义change事件，没有则使用系统默认
		var change = item.onChange == undefined ? (val)=>{				
			item.value =  typeof val == "object" && val.target != undefined ? val.target.value : val;
			this.forceUpdate();
		} : item.onChange;
		obj.onChange = change;

		var type = item.type;
		switch(type){		
			case "text":
				var value = item.showValue != undefined && item.showValue.length != 0 ? item.showValue : item.value;
				return (value != "" ? value + (item.unit ? item.unit : "") : "暂无值")
			break;
			case "input":			
				return (<Input {...obj} />)
			break;
			case "password":			
				return (<Input type="password" {...obj} />)
			break;			
			case "num":
				return (<InputNumber {...obj} style={{width: "100%"}}/>)
			break;
			case "textarea":
				return (<Input type="textarea" {...obj} rows={4} />);
			break;
			case "select":
				// if(itme.list > 20) {
				// 	obj["mode"] = "combobox";
				// }
				return (<Select {...obj} allowClear={true}>
					{
						item.list.map((sItem, index)=>{
							return (
								<Option key={index} value={sItem.value}>{sItem.name}</Option>
							)
						})
					}
				</Select>);
			break;
			case "radio":
				return (<RadioGroup {...obj}>
					{
						item.list.map((sItem, index)=>{
							return (
								<Radio key={index} value={sItem.value}>{sItem.name}</Radio>
							)
						})
					}
				</RadioGroup>);
			break;
			case "dateRange":
				return (<RangePicker {...obj} />)
			break;

		}
	}
	getPlaceHolder(item){
		if(item.placeholder != undefined) {
			return item.placeholder;
		}
		
		var prefix = "";
		switch(item.type) {
			case "input":
			case "password":
			case "textarea":
				return "请输入" + item.label + (item.maxLength != undefined ? " (最多" + item.maxLength + "个字)" : "");
			break; 
			case "select":
				return  "请选择" + item.label;
			break;
			case "dateRange":
				return  ["开始日期", "结束日期"];
			break;
		}
	}
	search(id){
		var form = this.state.form.data;
		for(var i = 0; i < form.length; i++) {
			if(form[i].id == id) {
				return form[i]
			}	
		}
		return null;
	}
	trim(str){
	    try {
	        return str.replace(/^\s+|\s+$/g, '');
	    }catch (a) {
	        return str;
	    }
	}
	check(){
		var form = this.state.form.data;
		for(var i = 0; i < form.length; i++) {
			
			//trim把输入框的值
			if(form[i].type == "input" || form[i].type == "textarea"){
				form[i].value = this.trim(form[i].value);
			}			

			//判断值是否为空
			var val = form[i].value;

			//当选项不是必填项且内容为空，就不做判断；
			if(form[i].isRequired == false && (typeof val == "string" && val.length == 0)) {
				continue;
			}

			if(val == undefined || (typeof val == "string" && val.length == 0) || (Object.prototype.toString.call(val) === '[object Array]' && val.length == 0)) {
				message.error(form[i].label + "的值不能为空");
				return false;
			}


			//调用自定义了验证方法验证
			if(form[i].validator != undefined && form[i].validator(val) == false) {
				message.error(form[i].label + "格式不正确");
				return false;
			}

			if((form[i]["type"] == "input" || form[i]["type"] == "textarea") && form[i]["maxLength"] != undefined && val.length > form[i]["maxLength"]){
				message.error(form[i].label + "的字数太长");
				return false;
			}
		}
		return true;
	}
	reset(){
		this.state.form.data.map((item)=>{
			if(item.type != "text") {
				item.value = typeof item.value != "object" ? "" : [];				
			}
		});
		this.forceUpdate();
	}
	getConf(item){
		var conf = this.state.form.conf;
		var itemConf = {
	      labelCol: {
	        md: { span: conf && conf.labelCol != undefined ?  conf.labelCol : 2 }
	      },
	      wrapperCol: {
	        md: { span: conf && conf.wrapperCol != undefined ?  conf.wrapperCol : 16 }
	      }	      
	      // required: conf && conf.isShowRequired == true ?  true : false
	    };

	    if(item) {
		    itemConf.required = conf && conf.isShowRequired == true ? (item.isRequired == false ? false : true) : false;
	    }
	    return itemConf;
	}
	handleSubmit(){
		if(this.check()) {
			console.log("提交成功");
		}else{
			console.log("提交失败");			
		}
	}
	getForm(){		
		var ButConf = {
			wrapperCol: {
	        	md: 23
	        }
		};
		return (
			<Form className="baseform">
				{
					this.state.form.data.map((item, index)=>{
						var itemConf = this.getConf(item);
						return(		
							 <FormItem {...itemConf} key={index} label={item.label} style={item["type"] == "hidden" ? {display:"none"}: null}>
									{item.getItem == undefined ? this.getFormItem(item) : item.getItem(item)}
							</FormItem>
							
						)
					})
				}
				{
		        	this.state.form.conf && this.state.form.conf.footer == false ? null		      			
		      			: <FormItem style={{textAlign: "center"}} {...ButConf}>		      			
				        	<Button type="default" onClick={this.reset.bind(this)} style={{marginRight: 10}}>清空</Button>				        	
				        	<Button type="primary" onClick={this.handleSubmit.bind(this)}>提交</Button>				        	
				        </FormItem>
		        }
			</Form>
		)
	}
};