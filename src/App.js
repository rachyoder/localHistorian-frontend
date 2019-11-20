import React from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';

import Login from './components/Login';

export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			token: '',
		}
		this.getLoginToken = this.getLoginToken.bind(this);
	}

	getLoginToken(userToken) {
		console.log(userToken);
		this.setState({ token: userToken });
	}

	render() {
		return(
			<div>
				<Login getToken={this.getLoginToken} />
			</div>
		);
	}
}
