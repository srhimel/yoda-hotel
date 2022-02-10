import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Pagination, Spinner, Table, Toast, ToastContainer } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import axios from 'axios';
import Student from './Student';
const Students = () => {
    const [showForm, setShowForm] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const handleFormClose = () => setShowForm(false);
    const handleFormShow = () => setShowForm(true);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('success');
    const [inserted, setInserted] = useState('');

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const [loadingData, setLoadingData] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [students, setStudents] = useState([]);

    const [studentsPerPage, setStudentsPerPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const handleFoodsPerPage = (e) => { console.log(e.target.value); setStudentsPerPage(e.target.value); }

    useEffect(() => {
        axios.get(`http://localhost:5000/students?page=${currentPage}&limit=${studentsPerPage}`)
            .then(res => {
                setStudents(res.data.students);
                const count = res.data.count;
                setPageCount(Math.ceil(count / studentsPerPage));
                setLoadingData(false);
            })
            .catch(err => {
                console.log(err);
                setLoadingData(false);
            })
    }, [inserted, studentsPerPage, currentPage]);
    const onSubmitForm = data => {
        setIsLoading(true);
        axios.post('http://localhost:5000/students', data)
            .then(res => {
                setInserted(res.data.insertedId);
                setType('success');
                setMessage('Students Added Successfully');
                setShowForm(false);
                setIsLoading(false);
                reset();
                setShowNotification(true);
            })
            .catch(err => {
                console.log(err);
                setType('danger');
                setMessage('Error Adding Food');
                setShowNotification(true);
            })

    };

    const [bulkSelect, setBulkSelect] = useState([]);
    const handleStatusUpdate = (e) => {
        e.target.innerText = 'Updating...';
        axios.put('http://localhost:5000/students-bulk', bulkSelect)
            .then(res => {
                window.location.reload();

            })
            .catch(err => {
                console.log(err);
            })
    }
    const handleStatusInactive = (e) => {
        e.target.innerText = 'Updating...';
        axios.put('http://localhost:5000/students-bulk-inactive', bulkSelect)
            .then(res => {
                window.location.reload();
            })

            .catch(err => {
                console.log(err);
            })
    }



    return (
        <div className='pb-3 pt-3'>
            <div className="text-center p-3"><Button variant="dark" size='lg' onClick={handleFormShow}>Add new Student</Button>

                <Modal show={showForm} onHide={handleFormClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Student</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit(onSubmitForm)}>
                            <Form.Group className="mb-3" controlid="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Full Name"  {...register("name", { required: true })} />
                                {errors.name?.type === 'required' && 'Name is required'}
                            </Form.Group>
                            <Form.Group className="mb-3" controlid="roll">
                                <Form.Label>Roll</Form.Label>
                                <Form.Control type="number" placeholder="Roll Number"  {...register("roll", { required: true })} />
                                {errors.foodPrice?.type === 'required' && 'Roll is required'}
                            </Form.Group>
                            <Form.Group className="mb-3" controlid="age">
                                <Form.Label>Age</Form.Label>
                                <Form.Control type="number" placeholder="Age"  {...register("age", { required: true })} />
                                {errors.age?.type === 'required' && 'Age is required'}
                            </Form.Group>
                            <Form.Group className="mb-3" controlid="class">
                                <Form.Label>Class</Form.Label>
                                <Form.Control type="text" placeholder="Class"  {...register("class", { required: true })} />
                                {errors.class?.type === 'required' && 'Class is required'}
                            </Form.Group>
                            <Form.Group className="mb-3" controlid="hall">
                                <Form.Label>Hall</Form.Label>
                                <Form.Control type="text" placeholder="Hall"  {...register("hall", { required: true })} />
                                {errors.hall?.type === 'required' && 'Hall is required'}
                            </Form.Group>
                            <Form.Group className="mb-3" controlid="status">
                                <Form.Label>Status</Form.Label>
                                <Form.Select  {...register("status", { required: true })}>
                                    <option value="">Select Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </Form.Select>
                                {errors.status?.type === 'required' && 'Status is required'}
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                {isLoading ? <Spinner animation="border" variant="light" /> : 'Add Food'}
                            </Button>
                        </Form>

                    </Modal.Body>
                </Modal>


            </div>
            <h3>Student List:</h3>
            {
                bulkSelect.length > 0 ?
                    <div className="text-center p-3">
                        <Button onClick={handleStatusUpdate} variant="success">Set Status Active</Button> &nbsp;
                        <Button onClick={handleStatusInactive} variant="danger">Set Status Inactive</Button>
                    </div>

                    :
                    ''
            }

            {loadingData
                ?
                <Spinner animation="border" />
                :
                students.length
                    ?
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Bulk Select</th>
                                <th>Name</th>
                                <th>Roll</th>
                                <th>Age</th>
                                <th>Class</th>
                                <th>Hall</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => <Student key={index} index={index} student={student} students={students} setStudents={setStudents} bulkSelect={bulkSelect} setBulkSelect={setBulkSelect}
                                setShowNotification={setShowNotification} setMessage={setMessage} setType={setType}
                            />)}
                        </tbody>
                    </Table>

                    :
                    <div className="text-danger">Food List is empty! Please add food</div>
            }
            <div className="d-flex justify-content-between">
                <span>
                    Load Data Per Page: &nbsp;
                    <select onChange={handleFoodsPerPage}>
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                        <option value={100}>100 per page</option>
                    </select>
                </span>
                <Pagination>
                    {[...Array(pageCount)].map((page, index) =>
                        <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
                            {index + 1}
                        </Pagination.Item>
                    )}

                </Pagination>
            </div>
            <ToastContainer position='bottom-end' className='p-3'>
                <Toast onClose={() => setShowNotification(false)} show={showNotification} delay={3000} autohide bg={type}>
                    <Toast.Header>
                        <strong className="me-auto">{message}</strong>
                    </Toast.Header>
                </Toast>
            </ToastContainer>

        </div>
    );
};

export default Students;