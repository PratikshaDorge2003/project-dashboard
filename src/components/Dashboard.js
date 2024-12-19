import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../redux/dataSlice';
import axiosInstance from './axiosInstance';
import 'jquery/dist/jquery.min.js';
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Alert } from 'react-bootstrap';
import Dropdown from "react-bootstrap/Dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";



function Dashboard() {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.data.data);
    const [details, setDetails] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [priority, setPriority] = useState("");
    const [status, setStatus] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [uniqueId, setUniqueId] = useState("");
    const [flag, setFlag] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);
    const [error, setError] = useState("");
    const [track, setTrack] = useState("");
    const [heading, setHeading] = useState("Add New Data");



    useEffect(() => {
        dispatch(fetchUserData());
    }, [dispatch]);

    useEffect(() => {
        setDetails(data);
        trackProgress(data);
    }, [data]);

    const trackProgress = (data) => {
        if (!data || data.length === 0) {
            setTrack("Not Started");
            return;
        }

        const allStatuses = data.map((item) => item.status);

        if (allStatuses.every((status) => status === "Completed")) {
            setTrack("Completed");
        } else if (allStatuses.every((status) => status === "Not Started")) {
            setTrack("Not Started");
        } else {
            setTrack("In Progress");
        }
    };

    const submitData = async () => {
        if (!title || !description || !date || !priority || !status) {
            setError("fill all the required fields");
        }
        else {
            const formattedDate = date instanceof Date ? date.toISOString().split('T')[0] : date;
            const formData = {
                title: title,
                description: description,
                dueDate: formattedDate,
                priority: priority,
                status: status
            };

            if (flag === true) {
                const result = await axiosInstance.post("/data", formData);
            }
            if (flag === false) {
                const result = await axiosInstance.patch(`/data/${uniqueId}`, formData);
            }
            dispatch(fetchUserData());
            setSuccessAlert(true);
            setTimeout(() => setSuccessAlert(false), 2000);
            handleCloseModal();

        }
    }

    const delFunction = async (id) => {
        try {
            await axiosInstance.delete(`/data/${id}`);
            dispatch(fetchUserData());
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 2000);

        } catch (error) {
            console.error("Error deleting the item:", error);
        }
    };

    const updateFunction = async (val) => {
        setHeading("Update Data")
        setTitle(val.title);
        setDescription(val.description);
        setPriority(val.priority);
        setStatus(val.status);
        setDate(val.dueDate);
        setFlag(false);
        setUniqueId(val.id);
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
        setTitle("");
        setDescription("");
        setDate("");
        setPriority("");
        setStatus("");
        setFlag(true);
        setUniqueId("");
        setError("");
        setHeading("Add New Data");
    };

    const sortbyDate = () => {
        const sortedDetails = [...details].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        setDetails(sortedDetails);
    };

    const sortByPriority = () => {
        const priorityOrder = {
            High: 1,
            Medium: 2,
            Low: 3,
        };

        const sortedDetails = [...details].sort(
            (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
        );
        setDetails(sortedDetails);
    };

    return (
        <div>
            <h5 className='heading'>Project Management DashBoard</h5>
            <div className='alert-div'>
                <Alert variant="warning" className='alert'>
                    Project Track : <strong>{track}</strong>
                </Alert>
            </div>
            <div className='alert-div'>
                {showAlert && (
                    <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible className='alert'>
                        Data deleted successfully!
                    </Alert>
                )}
                {successAlert && (
                    <Alert variant="success" onClose={() => setSuccessAlert(false)} dismissible className='alert'>
                        "Changes done successfully!
                    </Alert>
                )}
            </div>
            <div className='table-div'>

                <div className='btn-div'>
                    <Button variant="primary" onClick={() => setShowModal(true)} style={{ margin: "2px" }}>
                        Add Info
                    </Button>
                    <Dropdown style={{ margin: "2px" }}>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            Sort Data
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={sortbyDate}>Date</Dropdown.Item>
                            <Dropdown.Item onClick={sortByPriority} >Priority</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{heading}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input
                            placeholder='Project Title'
                            className='input-div'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <input
                            placeholder='Description'
                            className='input-div'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <input
                            placeholder='Priority'
                            className='input-div'
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        />
                        <select
                            className="input-div form-select"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="" disabled>Select Status</option>
                            <option value="Not Started">Not Started</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>

                        <DatePicker
                            selected={date}
                            onChange={(selectedDate) => setDate(selectedDate)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Due Date"
                            className="date-div"
                        />
                        <div className='centerized'><p style={{ color: "red" }}>{error}</p></div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={submitData} data-bs-dismiss="modal">Submit</Button>
                    </Modal.Footer>
                </Modal>

                <table className="table table-success table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Title</th>
                            <th scope="col">Description</th>
                            <th scope="col">Due Date</th>
                            <th scope="col">Priority</th>
                            <th scope="col">Status</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {details.map((val) => (
                            <tr key={val.id}>
                                <th scope="row">{val.title}</th>
                                <td>{val.description}</td>
                                <td>{val.dueDate}</td>
                                <td>{val.priority}</td>
                                <td>{val.status}</td>
                                <td>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16" onClick={() => delFunction(val.id)}>
                                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-minus-fill" viewBox="0 0 16 16" onClick={() => updateFunction(val)}>
                                        <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M6 8.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1 0-1" />
                                    </svg>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Dashboard;
