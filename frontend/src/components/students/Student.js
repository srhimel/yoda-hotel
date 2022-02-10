import axios from 'axios';
import React, { useState } from 'react';
import { Badge, Button, Form, Modal } from 'react-bootstrap';
import { useForm } from "react-hook-form";

const Student = ({ student, index, students, setStudents, setShowNotification, setMessage, setType, bulkSelect, setBulkSelect }) => {
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleFormClose = () => setShowForm(false);
    const handleFormShow = () => setShowForm(true);

    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmitForm = data => {

        axios.put(`http://localhost:5000/students/${student._id}`, data)
            .then(res => {
                console.log(res.data);
                setMessage('Food Updated Successfully');
                setType('success');
                setShowNotification(true);
                setShowForm(false);
                setStudents(students.map(s => s._id === student._id ? { ...data, _id: student._id } : s));

            })
            .catch(err => {
                console.log(err);
                setMessage('Error Updating Food');
                setType('danger');
                setShowNotification(true);

            })
    };
    const handleDelete = (id) => {
        setIsLoading(true);
        axios.delete(`http://localhost:5000/students/${id}`)
            .then(res => {
                console.log(res.data);
                setStudents(students.filter(s => s._id !== id));
                setType('danger');
                setMessage('Food Deleted Successfully');
                setShowNotification(true);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setMessage('Error Deleting Food');
                setType('warning');
                setShowNotification(true);
                setIsLoading(false);
            })
    }
    const handleBulkSelect = (e) => {
        if (e.target.checked) {
            setBulkSelect([...bulkSelect, student]);
        } else {
            setBulkSelect(bulkSelect.filter(s => s._id !== student._id));
        }
    }



    return (

        <tr
            style={{ background: student.status === 'active' ? '#dff0d8' : '#f2dede' }}>
            <td><Form.Check
                onChange={handleBulkSelect}
            /></td>
            <td>{student.name}</td>
            <td>{student.roll}</td>
            <td>{student.age}</td>
            <td>{student.class}</td>
            <td>{student.hall}</td>
            <td>{student.status === 'active' ?
                <Badge pill bg="success">
                    Active
                </Badge>
                :
                <Badge pill bg="danger">
                    Inactive
                </Badge>
            }</td>



            <td>
                <Button variant='primary' size='sm' onClick={handleFormShow}> Edit</Button>
                <Modal show={showForm} onHide={handleFormClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Food</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit(onSubmitForm)}>
                            <Form.Group className="mb-3" controlid="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Full Name"  {...register("name", { required: true })}
                                    defaultValue={student.name}
                                />
                                {errors.name?.type === 'required' && 'Name is required'}
                            </Form.Group>
                            <Form.Group className="mb-3" controlid="roll">
                                <Form.Label>Roll</Form.Label>
                                <Form.Control type="number" placeholder="Roll Number"  {...register("roll", { required: true })}
                                    defaultValue={student.roll}
                                />
                                {errors.foodPrice?.type === 'required' && 'Roll is required'}
                            </Form.Group>
                            <Form.Group className="mb-3" controlid="age">
                                <Form.Label>Age</Form.Label>
                                <Form.Control type="number" placeholder="Age"  {...register("age", { required: true })}
                                    defaultValue={student.age}
                                />
                                {errors.age?.type === 'required' && 'Age is required'}
                            </Form.Group>
                            <Form.Group className="mb-3" controlid="class">
                                <Form.Label>Class</Form.Label>
                                <Form.Control type="text" placeholder="Class"  {...register("class", { required: true })}
                                    defaultValue={student.class}
                                />
                                {errors.class?.type === 'required' && 'Class is required'}
                            </Form.Group>
                            <Form.Group className="mb-3" controlid="hall">
                                <Form.Label>Hall</Form.Label>
                                <Form.Control type="text" placeholder="Hall"  {...register("hall", { required: true })}
                                    defaultValue={student.hall}
                                />
                                {errors.hall?.type === 'required' && 'Hall is required'}
                            </Form.Group>
                            <Form.Group className="mb-3" controlid="status">
                                <Form.Label>Status</Form.Label>
                                <Form.Select  {...register("status", { required: true })}
                                    defaultValue={student.status}
                                >
                                    <option value="">Select Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </Form.Select>
                                {errors.status?.type === 'required' && 'Status is required'}
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                {isLoading ? 'Loading' : 'Update'}
                            </Button>
                        </Form>

                    </Modal.Body>
                </Modal>
                &nbsp;
                <Button variant='danger' size='sm' onClick={() => handleDelete(student._id)}>
                    {isLoading ? 'Loading' : 'Delete'}
                </Button>
            </td>
        </tr>


    );
};

export default Student;