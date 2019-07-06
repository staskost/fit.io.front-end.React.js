import React, { Component } from 'react'

class SendMessageModal extends Component {
    render() {
        return (
            <div class="modal fade" id="adminSendMessageModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">
                                {this.props.sender.firstName + " " + this.props.sender.lastName +
                                    " to " +
                                    this.props.receiver.firstName + " " + this.props.receiver.lastName}
                            </h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"   >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            NEW MESSAGE
                            <br />
                            <br />
                            <br />
                            <textarea id="typedMessage" rows="4" cols="50" width="100px" placeholder="Type here" />
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal" >
                                Close
                             </button>

                            <button type="button" class="btn btn-primary" onClick={this.props.sendMessage.bind(this)} >
                                SendMessage
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SendMessageModal
