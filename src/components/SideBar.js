import React, { useState } from 'react';
import Dashboard from './Dashboard';

const Sidebar = () => {
    const [selectedProject, setSelectedProject] = useState(1);

    const handleProjectClick = (projectNumber) => {
        setSelectedProject(projectNumber);
    };

    return (
        <>
            <nav class="navbar navbar-light bg-light">
                <button
                    className="btn btn-secondary"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasSidebar"
                    aria-controls="offcanvasSidebar"
                    style={{marginLeft:"20px"}}
                >
                    Project List
                </button>

            </nav>


            <div
                className="offcanvas offcanvas-start"
                tabIndex="-1"
                id="offcanvasSidebar"
                aria-labelledby="offcanvasSidebarLabel"
            >

                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasSidebarLabel">Project Names</h5>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body">
                    <ul className="list-group">
                        <li
                            className="list-group-item"
                            onClick={() => handleProjectClick(1)}
                            style={{ cursor: 'pointer' }}
                            data-bs-dismiss="offcanvas"
                        >
                            Project 1
                        </li>
                        <li
                            className="list-group-item"
                            onClick={() => handleProjectClick(2)}
                            style={{ cursor: 'pointer' }}
                             data-bs-dismiss="offcanvas"
                        >
                            Project 2
                        </li>
                        <li
                            className="list-group-item"
                            onClick={() => handleProjectClick(3)}
                            style={{ cursor: 'pointer' }}
                            data-bs-dismiss="offcanvas"
                        >
                            Project 3
                        </li>
                        <li
                            className="list-group-item"
                            onClick={() => handleProjectClick(4)}
                            style={{ cursor: 'pointer' }}
                            data-bs-dismiss="offcanvas"
                        >
                            Project 4
                        </li>
                    </ul>
                </div>
            </div>

            <Dashboard projectNumber={selectedProject} />
        </>
    );
};

export default Sidebar;
