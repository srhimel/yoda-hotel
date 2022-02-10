import axios from 'axios';
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useForm } from "react-hook-form";

const Food = ({ food, index, foods, setFoods, setShowNotification, setMessage, setType }) => {
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleFormClose = () => setShowForm(false);
    const handleFormShow = () => setShowForm(true);

    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmitForm = data => {

        axios.put(`http://localhost:5000/foods/${food._id}`, data)
            .then(res => {
                console.log(res.data);
                setMessage('Food Updated Successfully');
                setType('success');
                setShowNotification(true);
                setShowForm(false);
                setFoods(foods.map(f => f._id === food._id ? { ...data, _id: food._id } : f));

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
        axios.delete(`http://localhost:5000/foods/${id}`)
            .then(res => {
                console.log(res.data);
                setFoods(foods.filter(f => f._id !== id));
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

    return (

        <tr>
            <td>{food._id}</td>
            <td>{food.foodName}</td>
            <td>{food.foodPrice}</td>
            <td>
                <Button variant='primary' size='sm' onClick={handleFormShow}> Edit</Button>
                <Modal show={showForm} onHide={handleFormClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Food</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit(onSubmitForm)}>
                            <Form.Group className="mb-3" controlid="foodName">
                                <Form.Label>Food Name</Form.Label>
                                <Form.Control type="text" placeholder="Food Name"  {...register("foodName", { required: true })} defaultValue={food.foodName} />
                                {errors.foodName?.type === 'required' && 'Food Name is required'}
                            </Form.Group>
                            <Form.Group className="mb-3" controlid="foodPrice">
                                <Form.Label>Food Price</Form.Label>
                                <Form.Control type="number" placeholder="Food Price"  {...register("foodPrice", { required: true })}
                                    defaultValue={food.foodPrice}
                                />
                                {errors.foodPrice?.type === 'required' && 'Food Price is required'}
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                {isLoading ? 'Loading' : 'Update'}
                            </Button>
                        </Form>

                    </Modal.Body>
                </Modal>
                &nbsp;
                <Button variant='danger' size='sm' onClick={() => handleDelete(food._id)}>
                    {isLoading ? 'Loading' : 'Delete'}
                </Button>
            </td>
        </tr>


    );
};

export default Food;