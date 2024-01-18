import React, { useEffect } from 'react';

function PrivacyPolicy() {

    useEffect(() => {
        document.title = "Privacy Policy | Kinnie Playlist";
    }, [])

    return (
        <div className="empty">
            <h2>Privacy Policy</h2>
            <p><b>Kinnie Playlist</b> does not store any personal data, including Spotify user data such as email and display name, other than Spotify user ID to track votes.</p>
        </div>
    );
}

export default PrivacyPolicy;