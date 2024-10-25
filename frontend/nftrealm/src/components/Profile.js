import React from 'react';
import './Profile.css'; 

const Profile = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Profile</h2>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Profile;
