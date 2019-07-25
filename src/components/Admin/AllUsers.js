import React, { Component } from 'react';
import Role from '../../hoc/Role';
import withAuthorization from '../../hoc/withAuthorization';
import PageOfPagination from "./PageOfPagination";
import UserRow from "./UserRow";
import SendMessageModal from "./SendMessageModal";
import $ from "jquery";


class AllUsers extends Component {

    state = {
        user: {},
        users: [],
        count: 0,
        numberOfPages: 0,
        currentPage: 1,
        receiverOfMessage: {}
    }

    componentDidMount() {
        if (localStorage.getItem("userInfo") != null && localStorage.getItem("userInfo") != "") {
            let user = JSON.parse(localStorage.getItem("userInfo"));
            this.setState({
                user: user
            })
            $.ajax({
                type: "GET",
                url: `http://localhost:8080/admin/all?start=0&size=10`,
                headers: { "X-MSG-AUTH": localStorage.getItem("token") },
                dataType: "json",
                async: true,
                success: response => {
                    console.log(response);
                    this.setState({
                        count: response.count,
                        users: response.results
                    });
                    this.calculateNumberOfPages();
                },
                error: () => { }
            });
        }
    }

    calculateNumberOfPages = () => {
        let count = this.state.count;
        let wholeNum;
        let remainder;
        let numberOfPages;
        if (count < 10) {
            this.setState({
                numberOfPages: 1
            });
        }
        if (count > 10) {
            wholeNum = Math.floor(count / 10);
            remainder = count % 10;
            if (remainder > 0) {
                numberOfPages = wholeNum + 1;
            } else {
                numberOfPages = wholeNum;
            }
        }
        this.setState({
            numberOfPages: numberOfPages
        });
    };

    changePage = page => {
        if (page != 0 && page <= this.state.numberOfPages) {
            let token = localStorage.getItem("token");
            let start = (page - 1) * 10;
            $.ajax({
                type: "GET",
                contentType: "application/json; charset=utf-8",
                url: `http://localhost:8080/admin/all?start=${start}&size=10`,
                headers: {
                    "X-MSG-AUTH": token
                },
                dataType: "json",
                async: true,
                success: data => {
                    console.log(data);
                    this.setState({
                        count: data.count,
                        currentPage: page,
                        users: data.results
                    });
                    this.calculateNumberOfPages();
                },
                error: () => { }
            });
        }
    };

    generateNumberOfPage = () => {
        let pages = [];
        for (var i = 1; i <= this.state.numberOfPages; i++) {
            pages.push(
                <PageOfPagination key={i} pageNum={i} changePage={this.changePage} />
            );
        }
        return pages;
    };


    openModal = user => {
        this.setState({
            receiverOfMessage: user
        }, function () {
            $('#adminSendMessageModal').modal('show');
        })
    }

    sendMessage = () => {
        let text = document.getElementById("typedMessage").value;
        console.log(text);

        $.ajax({
            type: "POST",
            contentType: "text/plain",
            url: `http://localhost:8080/messages/save/${this.state.receiverOfMessage.username}`,
            headers: { "X-MSG-AUTH": localStorage.getItem("token") },
            data: text,
            async: true,
            success: () => {
                alert("Message Successfully Sent");
                document.getElementById("typedMessage").value = "";
                $('#adminSendMessageModal').modal('hide');
            },
            error: () => { }
        });



    }

    render() {
        const { users } = this.state;
        let count = this.state.currentPage * 10 - 10;
        return (
            <React.Fragment>
                <table class="table table-striped custab" style={{ width: "80%", margin: "auto" }}>
                    <thead>
                        <tr>
                            <th>Index</th>
                            <th> Username</th>
                            <th> FirstName </th>
                            <th> LastName </th>
                            <th> email </th>
                            <th> Role </th>
                            <th>Price</th>
                            <th class="text-center"> Action </th>
                        </tr>
                    </thead>
                    <tbody>

                        {users.length == 0 ? (<img src="http://photodentro.edu.gr/v/images/loading.gif" alt="Loading" width="80px" />) : null}
                        {users.map(user => {
                            count = count + 1;
                            return (<UserRow key={user.id} user={user} index={count} banUser={this.banUser} unbanUser={this.unbanUser} openModal={this.openModal} />);
                        })}
                    </tbody>
                </table>
                <nav aria-label="Page navigation example">
                    <ul class="pagination">
                        <li class="page-item">
                            <p class="page-link" onClick={this.changePage.bind(this, this.state.currentPage - 1)} style={{ cursor: "pointer" }} >
                                Previous
                            </p>
                        </li>
                        {this.generateNumberOfPage()}
                        <li class="page-item">
                            <p class="page-link" onClick={this.changePage.bind(this, this.state.currentPage + 1)} style={{ cursor: "pointer" }} >
                                Next
                            </p>
                        </li>
                    </ul>
                </nav>
                <SendMessageModal sender={this.state.user} receiver={this.state.receiverOfMessage} sendMessage={this.sendMessage}></SendMessageModal>
            </React.Fragment>
        )
    }
}

export default withAuthorization(AllUsers, [Role.Admin], true);
