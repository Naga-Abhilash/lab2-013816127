import React, { Component } from 'react';
import './ChatBox.css'

class ChatInput extends Component {
    constructor(props) {
        super(props);
        this.state = { chatInput: '' };

        // React ES6 does not bind 'this' to event handlers by default
        this.submitHandler = this.submitHandler.bind(this);
        this.textChangeHandler = this.textChangeHandler.bind(this);
    }

    submitHandler(event) {
        // Stop the form from refreshing the page on submit
        event.preventDefault();

        // Clear the input box
        this.setState({ chatInput: '' });

        // Call the onSend callback with the chatInput message
        this.props.onSend(this.state.chatInput);
    }

    textChangeHandler(event) {
        this.setState({ chatInput: event.target.value });
    }

    render() {
        return (
            <form className="chat-input" onSubmit={this.submitHandler}>
                <span className="span-input">
                    <input type="text" className="form-control"
                        onChange={this.textChangeHandler}
                        value={this.state.chatInput}
                        placeholder="Write a message..."
                        required /> &nbsp;&nbsp;&nbsp;&nbsp;
                    <button className="btn btn-success" type='submit'>Send</button>
                </span>
            </form>
        );
    }
}

ChatInput.defaultProps = {
};

export default ChatInput;