import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Pagination, Spinner, Table, Toast, ToastContainer } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import Food from './Food';
import axios from 'axios';
const Foods = () => {
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
    const [foods, setFoods] = useState([]);

    const [foodsPerPage, setFoodsPerPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const handleFoodsPerPage = (e) => { console.log(e.target.value); setFoodsPerPage(e.target.value); }

    useEffect(() => {
        axios.get(`http://localhost:5000/foods?page=${currentPage}&limit=${foodsPerPage}`)
            .then(res => {
                setFoods(res.data.foods);
                const count = res.data.count;
                setPageCount(Math.ceil(count / foodsPerPage));
                setLoadingData(false);
            })
            .catch(err => {
                console.log(err);
                setLoadingData(false);
            })
    }, [inserted, foodsPerPage, currentPage]);
    const onSubmitForm = data => {
        setIsLoading(true);
        axios.post('http://localhost:5000/foods', data)
            .then(res => {
                setInserted(res.data.insertedId);
                setType('success');
                setMessage('Food Added Successfully');
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



    return (
        <div className='pb-3 pt-3'>
            <div className="text-center p-3"><Button variant="dark" size='lg' onClick={handleFormShow}>Add new food</Button>

                <Modal show={showForm} onHide={handleFormClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Food</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit(onSubmitForm)}>
                            <Form.Group className="mb-3" controlid="foodName">
                                <Form.Label>Food Name</Form.Label>
                                <Form.Control type="text" placeholder="Food Name"  {...register("foodName", { required: true })} />
                                {errors.foodName?.type === 'required' && 'Food Name is required'}
                            </Form.Group>
                            <Form.Group className="mb-3" controlid="foodPrice">
                                <Form.Label>Food Price</Form.Label>
                                <Form.Control type="number" placeholder="Food Price"  {...register("foodPrice", { required: true })} />
                                {errors.foodPrice?.type === 'required' && 'Food Price is required'}
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                {isLoading ? <Spinner animation="border" variant="light" /> : 'Add Food'}
                            </Button>
                        </Form>

                    </Modal.Body>
                </Modal>


            </div>
            <h3>Food List:</h3>

            {loadingData
                ?
                <Spinner animation="border" />
                :
                foods.length
                    ?
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {foods.map((food, index) => <Food key={index} index={index} food={food} foods={foods} setFoods={setFoods}
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

export default Foods;