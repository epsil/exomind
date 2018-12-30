import React, { Component } from 'react';

class Prompt extends Component {
  render() {
    return (
      <div
        className="modal fade"
        id="passwordPrompt"
        tabindex="-1"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content text-center">
            <div className="modal-header">
              <h4 className="modal-title" title="Data is encrypted">
                <i className="fa fa-lock" /> Protected data
              </h4>
            </div>
            <div className="modal-body">
              <form role="form">
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
                      style="padding-right: 4em;"
                      title="Enter encryption key"
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
