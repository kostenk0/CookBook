import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Form } from 'react-bootstrap'

const Header = () => {
    return (
        <Navbar bg="light" variant="light" sticky="top">
            <Navbar.Brand href="#home">Книга рецептів</Navbar.Brand>
            <Nav className="mr-auto">

            </Nav>
            <Form inline>
                <Nav.Link ><Link to="/search" style={{ color: 'grey' }}>Пошук</Link></Nav.Link>
                <Nav.Link ><Link to="/add" style={{ color: 'grey' }}>Додати</Link></Nav.Link>
            </Form>
        </Navbar>
    );
}

export default Header;