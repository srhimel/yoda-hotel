import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row, Table, Toast, ToastContainer } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Select from 'react-select';

const Distribution = () => {
    const [students, setStudents] = useState([]);
    const [foods, setFoods] = useState([]);
    const [roll, setRoll] = useState('');
    const [distribution, setDistribution] = useState([]);
    const handleRollSelect = (e) => {
        setRoll(e.value);
    }
    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('success');
    const [inserted, setInserted] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/all-students')
            .then(res => {
                setStudents(res.data);
            })
            .catch(err => {
                console.log(err);
            })
        axios.get('http://localhost:5000/all-foods')
            .then(res => {
                setFoods(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:5000/distribution`)
            .then(res => {
                setDistribution(res.data);
            }
            )
            .catch(err => {
                console.log(err);
            }
            )
    }, [inserted]);


    const options = students.map(s => ({ label: s.roll, value: s.roll }));
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const onSubmitForm = data => {
        const newData = { ...data, roll: roll };
        axios.post('http://localhost:5000/distribution', newData)
            .then(res => {
                console.log(res.data);
                if (res.data.insertedId) {
                    setInserted(res.data.insertedId);
                    setType('success');
                    setMessage('Food distributed Successfully');
                    setShowNotification(true);
                    reset();
                }
                else {
                    setType('danger');
                    setMessage('Already Served');
                    setShowNotification(true);
                }
            })
            .catch(err => {
                console.log(err);
            });

    }
    return (
        <div>
            <h1>Serve Food:</h1>

            <Form onSubmit={handleSubmit(onSubmitForm)}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlid="roll">
                            <Form.Label>Roll</Form.Label>
                            <Select
                                required
                                options={options}
                                placeholder="Roll Number"
                                onChange={handleRollSelect}

                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form className="mb-3" controlid="shift">
                            <Form.Label>Shift</Form.Label>
                            <Form.Select placeholder='Select Shift'  {...register("shift", { required: true })}>
                                <option value='Morning'>Morning</option>
                                <option value='Evening'>Evening</option>
                            </Form.Select>
                            {errors.shift?.type === 'required' && 'Shift is required'}
                        </Form>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlid="date">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" placeholder="Date"  {...register("date", { required: true })} />
                            {errors.date?.type === 'required' && 'Date is required'}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlid="food">
                            <Form.Label>Food</Form.Label>
                            <Form.Select placeholder='Select Food'  {...register("food", { required: true })}>
                                <option value=''>Select Food</option>
                                {foods.map(f => <option key={f._id} value={f.foodName}>{f.foodName}</option>)}
                            </Form.Select>
                            {errors.food?.type === 'required' && 'Food is required'}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlid="status">
                            <Form.Label>Status</Form.Label>
                            <Form.Select placeholder='Select Status'  {...register("status", { required: true })}>
                                <option value='Served'>Served</option>
                                <option value='Not Served'>Not Served</option>
                            </Form.Select>
                            {errors.status?.type === 'required' && 'Status is required'}
                        </Form.Group>
                    </Col>
                </Row>
                <Button variant="primary" type="submit"> Submit </Button>

            </Form>

            <h2>Distribution List</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Roll</th>
                        <th>Shift</th>
                        <th>Date</th>
                        <th>Food</th>
                        <th>Status</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {distribution.map(d => <tr key={d._id}>
                        <td>{d.roll}</td>
                        <td>{d.shift}</td>
                        <td>{d.date}</td>
                        <td>{d.food}</td>
                        <td>{d.status}</td>
                        <td><Button variant="danger" onClick={() => {
                            axios.delete(`http://localhost:5000/distribution/${d._id}`)
                                .then(res => {
                                    setDistribution(distribution.filter(des => des._id !== d._id));
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                        }}>Delete</Button></td>
                    </tr>)}
                </tbody>
            </Table>
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

export default Distribution;