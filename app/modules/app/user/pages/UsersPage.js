import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Table, Header, Dropdown, Container, Dimmer, Loader, Button, Confirm } from 'semantic-ui-react';
import Pagination from 'components/Pagination';
import { userListRequest, userDeleteRequest } from '../redux/actions';
import { makeSelectUserList, makeSelectUserListLoading } from '../redux/selectors';

class UsersPage extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      deleteId: null,
      showDeleteConfirm: false,
      page: 1,
      pageSize: 10,
      role: null,
    };
  }

  componentWillMount() {
    this.props.userList();
  }

  onChangePage = (page) => {
    this.setState({ page });
  }

  onRemove = (deleteId) => () => {
    this.setState({ deleteId, showDeleteConfirm: true });
  }

  handleConfirm = () => {
    this.props.userDelete(this.state.deleteId);
    this.setState({ showDeleteConfirm: false });
  }

  filterRole = (event, data) => {
    this.setState({ role: data.text });
  }

  filter = (users) => {
    const { role } = this.state;

    if (role === null || role === 'All') {
      return users;
    } else if (role === 'Admin') {
      return users.filter((user) => user.get('role') === 'admin');
    }
    return users.filter((user) => user.get('role') === 'user');
  }

  handleCancel = () => this.setState({ showDeleteConfirm: false })

  renderUsers = () => {
    const { users } = this.props;
    const { page, pageSize } = this.state;
    const filteredUsers = this.filter(users);

    if (!filteredUsers.size) {
      return (
        <Table.Row>
          <Table.Cell colSpan="4">
            No Users
          </Table.Cell>
        </Table.Row>
      );
    }

    return filteredUsers.slice((page - 1) * pageSize, page * pageSize).map((user) => (
      <Table.Row key={user.get('_id')}>
        <Table.Cell>
          <Link to={`/users/${user.get('_id')}`}>
            {user.get('firstName')}
            &nbsp;
            {user.get('lastName')}
          </Link>
        </Table.Cell>
        <Table.Cell>
          {user.get('email')}
        </Table.Cell>
        <Table.Cell>
          {user.get('role')}
        </Table.Cell>
        <Table.Cell>
          <Button color="teal" size="mini" as={Link} to={`/users/${user.get('_id')}`} content="View" icon="edit" labelPosition="left" />
          &nbsp;
          <Button color="orange" size="mini" content="Remove" icon="minus" labelPosition="left" onClick={this.onRemove(user.get('_id'))} />
        </Table.Cell>
      </Table.Row>
    ));
  }

  render() {
    const { users, loading } = this.props;
    const { page, pageSize, showDeleteConfirm } = this.state;
    const filteredUsers = this.filter(users);

    return (
      <Container>
        <Confirm
          open={showDeleteConfirm}
          content="Are you sure to delete this user?"
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
        />
        <Dimmer active={loading}>
          <Loader />
        </Dimmer>
        <Header as="h2" content="Users" />
        <Dropdown text="Role">
          <Dropdown.Menu>
            <Dropdown.Item text="All" onClick={this.filterRole} />
            <Dropdown.Item text="Admin" onClick={this.filterRole} />
            <Dropdown.Item text="User" onClick={this.filterRole} />
          </Dropdown.Menu>
        </Dropdown>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Role</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.renderUsers()}
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan="4">
                <Pagination
                  total={filteredUsers.size}
                  currentPage={page}
                  onChange={this.onChangePage}
                  perPage={pageSize}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </Container>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  users: makeSelectUserList(),
  loading: makeSelectUserListLoading(),
});

const mapDispatchToProps = {
  userList: userListRequest,
  userDelete: userDeleteRequest,
};

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(UsersPage);
