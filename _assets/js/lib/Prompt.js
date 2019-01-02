import React, { Component } from 'react';

class Prompt extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };

    // https://reactjs.org/docs/forms.html
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const input = document.getElementById('password');
    input.focus();
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { value } = this.state;
    const { callback } = this.props;
    callback(value);
  }

  render() {
    // className="modal fade"
    const { value } = this.state;
    const { disabled, invalid, success } = this.props;
    return (
      <div id="passwordPrompt" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content text-center">
            <div className="modal-header">
              <h4 className="modal-title" title="Data is encrypted">
                {success ? (
                  <i className="fa fa-unlock" />
                ) : disabled ? (
                  <i className="fa fa-unlock-alt" />
                ) : (
                  <i className="fa fa-lock" />
                )}
                &nbsp;Protected data
              </h4>
            </div>
            <div className="modal-body">
              <form onSubmit={this.handleSubmit}>
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
                      value={value}
                      onChange={this.handleChange}
                      disabled={disabled}
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className={'btn btn-block ' + (success ? 'btn-success' : 'btn-primary')}
                  disabled={disabled}
                  title="Unlock data"
                >
                  <i className="fa fa-sign-in" />
                  &nbsp;Decrypt
                </button>
              </form>
            </div>
            {invalid && !success && (
              <div className="modal-footer">
                <p className="small text-danger text-center">Invalid password</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Prompt;
