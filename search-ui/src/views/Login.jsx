import axios from "axios";
import React from "react";
import { Redirect } from "react-router";
import { Button, Form } from "semantic-ui-react";


const loginService = {

    url: 'http://localhost:8005/access/api/latest/',
    async login(username, password) {
        const authHeaderValue = 'Basic ' + btoa(username + ':' + password);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeaderValue,
                'X-Requested-With': 'XMLHttpRequest'
            },
            reposneType: 'text'
        };
        axios.get(this.url + "authenticate", config).then(
            response => {
                const jwtData = response.data.split('.')[1];

                const decodedJwtJsonData = window.atob(jwtData);
                const decodedJwtData = JSON.parse(decodedJwtJsonData);

                localStorage.setItem('currentUser', JSON.stringify({ user: decodedJwtData.sub, token: response.data }));

            }
        ).catch(error => {
            console.log(error);
        });
    }
}

export class LoginComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: this.checkAuth(),
            username: '',
            password: ''
        }

    }

    checkAuth() {
        if (localStorage.getItem("currentUser")) {
          return true;
        }
        else return false;
      }

    onChangeInput(e) {

        this.setState({ [e.target.name]: e.target.value });
    }

    async omSubmitCredentials() {
        await loginService.login(this.state.username, this.state.password);
        this.setState({ authenticated: true });

    }

    render() {
        if (this.state.authenticated) {
            return (
                <Redirect to="/search" />
            )
        }
        else {
            return (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                    <Form onSubmit={this.omSubmitCredentials.bind(this)}
                        style={{
                            width: '25vw'

                        }}>
                        <Form.Field >
                            <label>Brugernavn</label>
                            <input name="username" onChange={this.onChangeInput.bind(this)} />
                        </Form.Field>
                        <Form.Field>
                            <label>Adgangskode</label>
                            <input name="password" type="password" onChange={this.onChangeInput.bind(this)} />
                        </Form.Field>
                        <Button type='submit'>Login</Button>
                    </Form>
                </div>

            )
        }
    }
}

export default LoginComponent;