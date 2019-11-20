import React from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';

import SimpleNavbar from './components/SimpleNavbar';

export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			token: '',
		}
		this.getLoginToken = this.getLoginToken.bind(this);
	}

	getLoginToken(userToken) {
		this.setState({ token: userToken });
	}

	render() {
		return (
			<div>
				<SimpleNavbar setToken={this.state.token} getToken={this.getLoginToken} />
			</div>
		);
	}
}
