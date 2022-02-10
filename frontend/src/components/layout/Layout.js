import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Container, Nav } from 'react-bootstrap';
import { FcHome } from "react-icons/fc";
import { IoRestaurantOutline, IoPeopleOutline, IoPieChartOutline } from "react-icons/io5";
import { Link, Outlet, useLocation } from 'react-router-dom';
const Layout = () => {
    const location = useLocation();
    return (
        <div className="d-flex">
            <div className="p-3 bg-dark text-white vh-100" style={{ width: '250px' }}>
                <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <FcHome style={{ fontSize: 30 }} />
                    <span className="fs-4"> &nbsp; Yooda Hostel</span>
                </a>
                <hr />
                <Nav variant="pills" className="flex-column">
                    <Nav.Link className={`text-white ${location.pathname === '/' ? 'active' : ''}`} as={Link} to="/"> <IoRestaurantOutline />&nbsp; Foods</Nav.Link>
                    <Nav.Link className={`text-white ${location.pathname.includes('/students') ? 'active' : ''}`} as={Link} to="/students"> <IoPeopleOutline />&nbsp; Students</Nav.Link>
                    <Nav.Link className={`text-white ${location.pathname.includes('/distribution') ? 'active' : ''}`} as={Link} to="/distribution"> <IoPieChartOutline />&nbsp; Distribution</Nav.Link>
                </Nav>
            </div>
            <div
                style={{ width: 'calc(100% - 250px)' }}
                className="p-3 bg-light"
            >
                <Container style={{ background: 'white' }}>
                    <Outlet />
                </Container>
            </div>
        </div>
    );
};

export default Layout;