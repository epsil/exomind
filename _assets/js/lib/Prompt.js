import React, { Component } from 'react';

class Prompt extends Component {
  constructor() {
    super();
    this.state = { value: '' };

    // https://reactjs.org/docs/forms.html
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    alert('A value was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    // className="modal fade"
    return (
      <div id="passwordPrompt" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content text-center">
            <div className="modal-header">
              <h4 className="modal-title" title="Data is encrypted">
                <i className="fa fa-lock" /> Protected data
              </h4>
            </div>
            <div className="modal-body">
              <form onSubmit={this.handleSubmit} role="form">
                <div className="form-group">
                  <div className="input-group">
                    <div className="input-group-addon">
                      <i className="fa fa-key" title="Password" />
                    </div>
                    <input
                      type="password"
                      className="form-control text-center"
                      id="password"
                      placeholder="Password"
                      style={{ paddingRight: '4em' }}
                      title="Enter encryption key"
                      value={this.state.value}
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  title="Unlock data"
                >
                  <i className="fa fa-sign-in" /> Decrypt
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Prompt;
