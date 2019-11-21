import React from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';

import SimpleNavbar from './components/SimpleNavbar';
import Upload from './components/Upload/Upload';

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

	componentDidMount() {
		if (localStorage.length > 0) {
			this.setState({ token: localStorage.getItem('token') })
		}
	}

	render() {
		return (
			<React.Fragment>
				<SimpleNavbar token={this.state.token} getTokenMethod={this.getLoginToken} />
				<footer className="fixed-bottom">
					<Upload token={this.state.token} />
				</footer>
			</React.Fragment>
		);
	}
}
