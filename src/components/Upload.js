import React from "react";
import API_Calls from "../utilities/Axios";

import { Form, Button, Input } from "reactstrap";

export default class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: '',
        }
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
    }
    onFormSubmit(e){
        e.preventDefault() 
        this.fileUpload(this.state.image);
      }
      onChange(e) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length)
              return;
        this.createImage(files[0]);
      }
      createImage(file) {
        let reader = new FileReader();
        reader.onload = (e) => {
          this.setState({
            image: e.target.result
          })
        };
        reader.readAsDataURL(file);
      }
      fileUpload(image){
        const url = '/fileupload';
        const formData = {file: this.state.image}
        API_Calls.__post(formData, url, this.props.token)
            .then(res => {
                console.log(res);
            });
      }

    render() {
        return (
            <div>  
                <Form onSubmit={this.onFormSubmit}>
                    <Input type="file" onChange={this.onChange} capture="environment"></Input>
                    <Button type="submit">Upload</Button>
                </Form>
            </div> 
        );
    }
}