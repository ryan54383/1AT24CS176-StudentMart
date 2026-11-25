function Logout({ onLogout }) {
    return (
        <button type="button" className="btn-logout" onClick={onLogout}>
            Log Out
        </button>
    );
}

export default Logout;
