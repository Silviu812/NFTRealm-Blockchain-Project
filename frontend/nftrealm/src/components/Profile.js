import React from 'react';
import './Profile.css'; 

const Profile = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    ×
                </button>
                <h2>Profile</h2>
                <p>Your profile details go here.</p>
            </div>
        </div>
    );
};

export default Profile;
