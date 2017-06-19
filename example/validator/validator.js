import "antd/dist/antd.css";
import BaseForm from "../../index.js";
import ReactDOM from "react-dom";
import React from "react";

class Login extends BaseForm {
	constructor(props) {
    	super(props);
    	this.state = {
    		form: {
	    		data: [{
		    		   id: "email",
	    			label: "邮箱",
	    			type: "input",
	    			value: "",
	    			validator:(val)=>{
		    			return /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/.test(val);	
		    		}
	    		},{
	    			   id: "mobile",
	    			label: "手机号",
	    			 type: "input",
	    			value: "",
	    			validator: (val)=>{
		    			return /^1[0-9]{10}$/.test(val);	
		    		}
	    		}],
	    		conf: {
	    			  labelCol: 5,
	    			wrapperCol: 18,
	    			isShowRequired: true
    			}
    		}
    	};
    }
    reset(){		
		this.state.form.data.map((item, index)=>{
			if(item.value != "") {
				item.value = "";
			}
		});
		this.forceUpdate();
    }
    handleSubmit(){
		if(!this.check()) {
			return false;
		}
		console.log("已提交");
    }
    render(){
    	return(
    		<div style={{width: "500px", marginTop: 20}}>
				{this.getForm()}
			</div>
    	)
    }
}

ReactDOM.render(<Login />, document.getElementById("root"));